CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_super_admin
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'oscarodero@tech-center.com',
  crypt('Tornado@93', gen_salt('bf', 10)),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Super Admin Oscar"}',
  now(),
  now(),
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'oscarodero@tech-center.com'
);