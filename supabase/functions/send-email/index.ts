import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, body, fromName }: EmailRequest = await req.json();

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Resend API for sending emails
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      // Fallback: log the email details (for development/testing)
      console.log("Email would be sent:", { to, subject, body, fromName });
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email logged (RESEND_API_KEY not configured)",
          email: { to, subject, body, fromName },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fromAddress = fromName
      ? `${fromName} <noreply@vertex-tech.com>`
      : "Vertex Tech Solutions <noreply@vertex-tech.com>";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject: subject,
        html: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E7FD8 0%, #3DBE5B 100%); padding: 2px; border-radius: 16px; margin-bottom: 24px;">
            <div style="background: white; border-radius: 14px; padding: 24px;">
              <h2 style="color: #13294B; margin: 0 0 8px 0; font-family: 'Space Grotesk', sans-serif;">Vertex Tech Solutions</h2>
            </div>
          </div>
          <div style="background: #F7F9FC; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #13294B; line-height: 1.6; margin: 0; white-space: pre-wrap;">${body}</p>
          </div>
          <div style="text-align: center; color: #5B6B82; font-size: 12px;">
            <p>This email was sent by Vertex Tech Solutions</p>
            <p>+254 708 688 691 | oscarodero@tech-center.com</p>
          </div>
        </div>`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
