-- Vertex Tech Solutions - Admin CMS Expansion
-- Adds testimonials, content pages, and additional site settings
-- for the comprehensive admin dashboard

-- ============================================
-- 1. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_company TEXT,
  client_role TEXT,
  client_avatar_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. PAGES TABLE (Content Management)
-- ============================================
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON public.testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON public.testimonials(display_order);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_published ON public.pages(is_published);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (no_auth_controlled_write model)
-- Public read for active/featured items, open write for admin panel
-- ============================================

-- TESTIMONIALS
CREATE POLICY "Testimonials are viewable by everyone"
  ON public.testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Testimonials can be inserted by anyone"
  ON public.testimonials FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Testimonials can be updated by anyone"
  ON public.testimonials FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Testimonials can be deleted by anyone"
  ON public.testimonials FOR DELETE
  USING (true);

-- PAGES
CREATE POLICY "Published pages are viewable by everyone"
  ON public.pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Pages can be inserted by anyone"
  ON public.pages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Pages can be updated by anyone"
  ON public.pages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Pages can be deleted by anyone"
  ON public.pages FOR DELETE
  USING (true);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE TRIGGER set_updated_at_testimonials
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_pages
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================
-- SEED DATA: Additional Site Settings (Socials & About)
-- ============================================
INSERT INTO public.site_settings (key, value, description) VALUES
  ('social_twitter', '', 'Twitter/X profile URL'),
  ('social_linkedin', '', 'LinkedIn profile URL'),
  ('social_github', '', 'GitHub profile URL'),
  ('social_instagram', '', 'Instagram profile URL'),
  ('about_heading', 'Why Choose Vertex?', 'About section heading'),
  ('about_description', 'Vertex Tech Solutions is a premier technology partner dedicated to empowering businesses through innovative digital solutions. We combine cutting-edge technology with deep industry expertise to deliver transformative results.', 'About section description'),
  ('seo_title', 'Vertex Tech Solutions | Innovate. Automate. Secure. Grow.', 'Default page title for SEO'),
  ('seo_description', 'Premier technology partner for mobile apps, web development, SaaS, cloud, AI, and cybersecurity solutions.', 'Default meta description for SEO')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED DATA: Legal Pages
-- ============================================
INSERT INTO public.pages (title, slug, content, is_published, published_at) VALUES
  (
    'Privacy Policy',
    'privacy-policy',
    '<h2>Privacy Policy</h2><p>At Vertex Tech Solutions, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p><h3>Information We Collect</h3><p>We collect information that you provide directly to us, including your name, email address, phone number, and any messages you send through our contact form.</p><h3>How We Use Your Information</h3><p>We use the information we collect to respond to your inquiries, provide our services, and improve our website experience.</p><h3>Data Security</h3><p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>',
    true,
    now()
  ),
  (
    'Terms of Service',
    'terms-of-service',
    '<h2>Terms of Service</h2><p>Welcome to Vertex Tech Solutions. By accessing our website and using our services, you agree to comply with these terms and conditions.</p><h3>Services</h3><p>We provide technology solutions including mobile app development, web development, SaaS development, cloud services, AI integration, and cybersecurity consulting.</p><h3>Intellectual Property</h3><p>All content on this website, including text, graphics, logos, and software, is the property of Vertex Tech Solutions and is protected by applicable intellectual property laws.</p><h3>Limitation of Liability</h3><p>Vertex Tech Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.</p>',
    true,
    now()
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: Sample Testimonials
-- ============================================
INSERT INTO public.testimonials (client_name, client_company, client_role, quote, rating, is_featured, display_order) VALUES
  (
    'Sarah M.',
    'FinTech Startup',
    'CEO',
    'Vertex transformed our vision into a powerful mobile application. Their team''s expertise in React Native delivered a product that exceeded our expectations in both performance and design.',
    5,
    true,
    1
  ),
  (
    'James K.',
    'E-Commerce Platform',
    'CTO',
    'The web platform Vertex built for us handles thousands of daily transactions seamlessly. Their attention to security and scalability was exactly what we needed.',
    5,
    true,
    2
  ),
  (
    'Amina O.',
    'HealthTech Company',
    'Founder',
    'Working with Vertex on our SaaS platform was a game-changer. They understood our multi-tenant requirements perfectly and delivered a robust, scalable solution.',
    5,
    true,
    3
  )
ON CONFLICT DO NOTHING;
