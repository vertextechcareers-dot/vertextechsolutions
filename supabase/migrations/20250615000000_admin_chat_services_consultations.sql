-- ============================================================
-- Admin Features: Real-time Chat, Services CRUD, Consultations
-- ============================================================
-- This migration adds:
-- 1. conversations table for chat threads
-- 2. Enhances messages table for real-time chat (conversation_id, sender_type)
-- 3. consultations table for free consultation bookings
-- 4. RLS policies for all tables
-- 5. Realtime enabled on messages and conversations
-- ============================================================

-- ============================================================
-- 1. CONVERSATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for sorting conversations by latest activity
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON public.conversations(status);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. ENHANCE MESSAGES TABLE FOR CHAT
-- ============================================================
-- Add conversation_id for threading
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE;
-- Add sender_type to distinguish user vs admin messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender_type text NOT NULL DEFAULT 'user' CHECK (sender_type IN ('user', 'admin'));

-- Index for fetching messages in a conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON public.messages(sender_type);

-- Enable RLS on messages (if not already enabled)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. CONSULTATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_email text NOT NULL,
  phone text,
  service_type text,
  preferred_date timestamptz,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================
-- Note: This app uses PIN-based admin auth (frontend-only).
-- All operations use the anon key. RLS allows anon for all ops
-- since admin security is handled at the frontend level.

-- CONVERSATIONS policies
DROP POLICY IF EXISTS "conversations_select_all" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert_all" ON public.conversations;
DROP POLICY IF EXISTS "conversations_update_all" ON public.conversations;
DROP POLICY IF EXISTS "conversations_delete_all" ON public.conversations;

CREATE POLICY "conversations_select_all" ON public.conversations
  FOR SELECT TO anon USING (true);

CREATE POLICY "conversations_insert_all" ON public.conversations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "conversations_update_all" ON public.conversations
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "conversations_delete_all" ON public.conversations
  FOR DELETE TO anon USING (true);

-- MESSAGES policies
DROP POLICY IF EXISTS "messages_select_all" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_all" ON public.messages;
DROP POLICY IF EXISTS "messages_update_all" ON public.messages;
DROP POLICY IF EXISTS "messages_delete_all" ON public.messages;

CREATE POLICY "messages_select_all" ON public.messages
  FOR SELECT TO anon USING (true);

CREATE POLICY "messages_insert_all" ON public.messages
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "messages_update_all" ON public.messages
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "messages_delete_all" ON public.messages
  FOR DELETE TO anon USING (true);

-- CONSULTATIONS policies
DROP POLICY IF EXISTS "consultations_select_all" ON public.consultations;
DROP POLICY IF EXISTS "consultations_insert_all" ON public.consultations;
DROP POLICY IF EXISTS "consultations_update_all" ON public.consultations;
DROP POLICY IF EXISTS "consultations_delete_all" ON public.consultations;

CREATE POLICY "consultations_select_all" ON public.consultations
  FOR SELECT TO anon USING (true);

CREATE POLICY "consultations_insert_all" ON public.consultations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "consultations_update_all" ON public.consultations
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "consultations_delete_all" ON public.consultations
  FOR DELETE TO anon USING (true);

-- SERVICES policies (ensure they exist)
DROP POLICY IF EXISTS "services_select_all" ON public.services;
DROP POLICY IF EXISTS "services_insert_all" ON public.services;
DROP POLICY IF EXISTS "services_update_all" ON public.services;
DROP POLICY IF EXISTS "services_delete_all" ON public.services;

CREATE POLICY "services_select_all" ON public.services
  FOR SELECT TO anon USING (true);

CREATE POLICY "services_insert_all" ON public.services
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "services_update_all" ON public.services
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "services_delete_all" ON public.services
  FOR DELETE TO anon USING (true);

-- ============================================================
-- 5. ENABLE REALTIME
-- ============================================================
-- Enable realtime on messages and conversations tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;

-- Note: conversations table realtime is handled via messages table changes
-- (when a new message arrives, the conversation's last_message_at updates)

-- ============================================================
-- 6. AUTO-UPDATE FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update conversation's last_message_at when a new message is added
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.conversation_id IS NOT NULL THEN
    UPDATE public.conversations
    SET last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.conversation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-updating conversation
DROP TRIGGER IF EXISTS trg_update_conversation_on_message ON public.messages;
CREATE TRIGGER trg_update_conversation_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_message();

-- Triggers for updated_at (using existing handle_updated_at function from initial schema)
DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.conversations;
CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_consultations_updated_at ON public.consultations;
CREATE TRIGGER trg_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
