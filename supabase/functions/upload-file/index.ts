import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, admin-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight immediately for every OPTIONS request.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate admin secret
    const adminSecret = req.headers.get("admin-secret");
    const expectedSecret = Deno.env.get("ADMIN_SECRET");

    if (!adminSecret || adminSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid admin secret" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const externalUrl = formData.get("external_url") as string | null;
    const secretPhrase = formData.get("secret_phrase") as string | null;
    const originalFilename = formData.get("original_filename") as string | null;

    if (!name || !name.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required field: name" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase admin client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate access code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let accessCode = "";
    for (let i = 0; i < 8; i++) {
      accessCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    let filePath: string | null = null;
    let fileSize = 0;
    let fileType: string | null = null;

    if (externalUrl && externalUrl.trim()) {
      // External link path: validate URL shape
      try {
        new URL(externalUrl.trim());
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid external URL" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else if (file) {
      // File upload path
      const fileExt = file.name.split(".").pop();
      filePath = `secured/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      fileSize = file.size;
      fileType = file.type || null;

      const { error: uploadError } = await supabase.storage
        .from("secured-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return new Response(
          JSON.stringify({ error: "Failed to upload file", details: uploadError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Missing required field: file or external_url" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert record into secured_files table
    const insertPayload: Record<string, unknown> = {
      name: name.trim(),
      description: description?.trim() || null,
      access_code: accessCode,
      secret_phrase: secretPhrase?.trim() || null,
      external_url: externalUrl ? externalUrl.trim() : null,
      file_size: fileSize || null,
      file_type: fileType,
      original_filename: originalFilename?.trim() || null,
    };

    if (filePath) {
      insertPayload.file_path = filePath;
    }

    const { data: insertData, error: dbError } = await supabase
      .from("secured_files")
      .insert(insertPayload)
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Clean up the uploaded file if DB insert fails
      if (filePath) {
        await supabase.storage.from("secured-files").remove([filePath]);
      }
      return new Response(
        JSON.stringify({ error: "Failed to save file record", details: dbError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return success with file metadata
    return new Response(
      JSON.stringify({
        success: true,
        file: insertData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});