-- Vertex Tech Solutions - Initial Database Schema
-- Creates all core tables for the admin dashboard and website CMS

-- ============================================
-- 1. SERVICES TABLE (CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  headline TEXT,
  overview TEXT,
  what_you_get TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  process_steps TEXT[] DEFAULT '{}',
  cta_text TEXT,
  icon_name TEXT,
  color TEXT DEFAULT 'blue',
  tagline TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. LEADS TABLE (Contact Form Submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  service_interest TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. CLIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
  budget DECIMAL(12, 2),
  deadline TIMESTAMPTZ,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. MESSAGES TABLE (Website Contact Messages)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. SITE SETTINGS TABLE (For editable site content)
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_company ON public.clients(company);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON public.projects(deadline);

CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- SERVICES: Public read, admin write
-- Anyone can read active services (for the website)
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (is_active = true);

-- Services can be managed by anyone (admin panel uses PIN, not Supabase Auth)
-- In production, you'd use auth.uid() checks here
CREATE POLICY "Services can be inserted by anyone"
  ON public.services FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Services can be updated by anyone"
  ON public.services FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Services can be deleted by anyone"
  ON public.services FOR DELETE
  USING (true);

-- LEADS: Public insert (contact form), admin read/write
CREATE POLICY "Leads can be inserted by anyone"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Leads are viewable by anyone"
  ON public.leads FOR SELECT
  USING (true);

CREATE POLICY "Leads can be updated by anyone"
  ON public.leads FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Leads can be deleted by anyone"
  ON public.leads FOR DELETE
  USING (true);

-- CLIENTS: Admin only (but open for now since no auth)
CREATE POLICY "Clients are viewable by anyone"
  ON public.clients FOR SELECT
  USING (true);

CREATE POLICY "Clients can be inserted by anyone"
  ON public.clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Clients can be updated by anyone"
  ON public.clients FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Clients can be deleted by anyone"
  ON public.clients FOR DELETE
  USING (true);

-- PROJECTS: Admin only (but open for now)
CREATE POLICY "Projects are viewable by anyone"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Projects can be inserted by anyone"
  ON public.projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Projects can be updated by anyone"
  ON public.projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Projects can be deleted by anyone"
  ON public.projects FOR DELETE
  USING (true);

-- MESSAGES: Public insert, admin read/manage
CREATE POLICY "Messages can be inserted by anyone"
  ON public.messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Messages are viewable by anyone"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Messages can be updated by anyone"
  ON public.messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Messages can be deleted by anyone"
  ON public.messages FOR DELETE
  USING (true);

-- SITE SETTINGS: Public read, admin write
CREATE POLICY "Site settings are viewable by anyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Site settings can be inserted by anyone"
  ON public.site_settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Site settings can be updated by anyone"
  ON public.site_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at_services
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_leads
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_site_settings
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================
-- SEED DATA: Initial Services
-- ============================================
INSERT INTO public.services (title, slug, description, headline, overview, what_you_get, technologies, use_cases, benefits, process_steps, cta_text, color, tagline, display_order) VALUES
(
  'Mobile App Development',
  'mobile-app-development',
  'Building high-performance, cross-platform mobile applications with seamless user experiences.',
  'Next-Gen Mobile Experiences for iOS and Android',
  'We engineer high-performance mobile applications that combine native-level speed with cross-platform efficiency. Our mobile solutions are built to engage users, drive retention, and scale with your business demands.',
  ARRAY['High-fidelity iOS and Android applications', 'Zero-latency user interfaces and interactions', 'Offline-first capability and local storage', 'Push notification and biometric integration', 'App Store and Play Store optimization'],
  ARRAY['React Native', 'Expo', 'Swift', 'Kotlin', 'Firebase', 'Redux', 'Lottie Animations'],
  ARRAY['E-commerce Mobiles', 'Fintech Applications', 'Social Platforms', 'Health & Wellness Tracking'],
  ARRAY['Direct Customer Engagement', 'Brand Authority', 'Enhanced User Loyalty'],
  ARRAY['User Journey Mapping', 'UI/UX Engineering', 'Agile Development Cycles', 'Quality Assurance', 'Store Submission'],
  '👉 Build Your Mobile App',
  'blue',
  'BUILD',
  1
),
(
  'Customized Web Development',
  'custom-web-development',
  'Scalable, secure, and responsive web solutions tailored to your unique business needs.',
  'Engineered Web Solutions for the Modern Enterprise',
  'We architect and deploy bespoke web ecosystems designed for extreme performance, ironclad security, and limitless scalability. From enterprise-grade platforms to high-conversion digital experiences, we build the engine of your digital growth.',
  ARRAY['Ultra-responsive architecture for all devices', 'Sub-second load times and performance optimization', 'Enterprise-grade security and data encryption', 'Custom API development and seamless integrations', 'Advanced SEO-first structural engineering'],
  ARRAY['React / Next.js', 'Node.js', 'Python / Django', 'PostgreSQL', 'Tailwind CSS', 'TypeScript', 'GraphQL'],
  ARRAY['Corporate Ecosystems', 'Digital Platforms', 'Analytics Dashboards', 'Booking & Reservation Engines'],
  ARRAY['Market Advantage', 'Operational Efficiency', 'Future-Proof Scalability'],
  ARRAY['Requirement Architecture', 'Prototype & Interface Engineering', 'Full-Stack Development', 'Rigorous Stress Testing', 'Global Deployment'],
  '👉 Start Your Website Project',
  'green',
  'CREATE',
  2
),
(
  'SaaS Development',
  'saas-development',
  'End-to-end SaaS platforms with multi-tenant architecture and robust subscription models.',
  'Scalable SaaS Architectures Built for Global Markets',
  'Launch and scale your software product with a robust SaaS architecture. We build multi-tenant systems designed for high availability, seamless subscription management, and massive user growth.',
  ARRAY['Multi-tenant database architecture', 'Secure subscription and billing systems (Stripe)', 'Role-based access control (RBAC)', 'Real-time analytics and user monitoring', 'Automated scaling and load balancing'],
  ARRAY['Next.js', 'Supabase', 'Stripe API', 'AWS Lambda', 'Kubernetes', 'Redis'],
  ARRAY['B2B Software Platforms', 'Member Portals', 'Cloud Management Tools', 'Educational Platforms'],
  ARRAY['Recurring Revenue Model', 'Market Scalability', 'Operational Automation'],
  ARRAY['Architecture Design', 'Core Feature Sprint', 'Security & Multi-tenancy Setup', 'Beta Launch & Feedback', 'Scaling Strategy'],
  '👉 Build Your SaaS Product',
  'violet',
  'SCALE',
  3
),
(
  'Cloud & DevOps',
  'cloud-devops-services',
  'Optimizing infrastructure for reliability, scalability, and automated deployments.',
  'Mission-Critical Infrastructure and DevOps Automation',
  'Optimizing your digital infrastructure for 99.99% availability. We implement modern DevOps practices and cloud-native solutions to ensure your systems are resilient, secure, and fast.',
  ARRAY['Automated CI/CD deployment pipelines', 'Infrastructure as Code (Terraform / CloudFormation)', 'Zero-downtime migration strategies', 'Proactive monitoring and incident response', 'Cost-optimized cloud resource management'],
  ARRAY['AWS', 'Azure', 'Google Cloud', 'Docker', 'Jenkins', 'Terraform', 'GitHub Actions'],
  ARRAY['High-Traffic Platforms', 'Data-Intensive Applications', 'Cloud Migrations', 'Security Hardening'],
  ARRAY['Maximum Uptime', 'Faster Deployment Cycles', 'Reduced Operational Costs'],
  ARRAY['Infrastructure Audit', 'DevOps Roadmap', 'Cloud Architecture Design', 'Automation Implementation', 'Ongoing Optimization'],
  '👉 Move to the Cloud',
  'blue',
  'DEPLOY',
  4
),
(
  'AI Application Services',
  'ai-application-services',
  'Integrating advanced AI models to drive intelligence and innovation in your apps.',
  'Intelligent Systems Powered by Advanced AI Models',
  'Integrate the power of artificial intelligence into your business applications. From predictive analytics to intelligent agents, we build AI solutions that solve complex problems and drive innovation.',
  ARRAY['Custom AI model integration (LLMs, OpenAI)', 'Natural Language Processing (NLP) systems', 'Predictive analytics and data modeling', 'Intelligent recommendation engines', 'AI-driven content generation and analysis'],
  ARRAY['OpenAI API', 'Python', 'TensorFlow', 'PyTorch', 'Pinecone (Vector DB)', 'LangChain'],
  ARRAY['Intelligent Search', 'Content Generation Tools', 'Market Analysis AI', 'Personalized User Experiences'],
  ARRAY['Innovation Leadership', 'Enhanced Decision Making', 'Competitive Differentiation'],
  ARRAY['AI Opportunity Analysis', 'Data Strategy', 'Model Engineering', 'Application Integration', 'Continuous Learning Setup'],
  '👉 Integrate AI Into Your Business',
  'violet',
  'INTELLIGENT',
  5
),
(
  'Automation & AI Integration',
  'automation-ai-integration',
  'Streamlining workflows with intelligent automation and AI-driven process optimization.',
  'Hyper-Automation for Modern Business Workflows',
  'Eliminate manual bottlenecks and increase operational efficiency. We design and implement intelligent automation systems that streamline your workflows and liberate your team for higher-value tasks.',
  ARRAY['End-to-end workflow automation', 'Intelligent Chatbots and AI Agents', 'CRM and ERP automation integrations', 'Automated reporting and data sync', 'RPA (Robotic Process Automation) solutions'],
  ARRAY['Zapier', 'Make.com', 'Python Scripts', 'n8n', 'AI Assistants', 'API Middleware'],
  ARRAY['Customer Support Automation', 'Sales Funnel Automation', 'Internal Process Optimization', 'Automated Data Collection'],
  ARRAY['Operational Speed', 'Error Reduction', 'Significant Cost Savings'],
  ARRAY['Workflow Discovery', 'Automation Mapping', 'System Integration', 'Testing & Calibration', 'Full-Scale Launch'],
  '👉 Automate Your Workflow',
  'green',
  'AUTOMATE',
  6
),
(
  'Cybersecurity',
  'cybersecurity',
  'Fortifying your digital assets with advanced threat detection and security protocols.',
  'Ironclad Security for Your Digital Assets and Data',
  'Protect your business from evolving cyber threats. We provide comprehensive security solutions including threat detection, vulnerability assessments, and robust data protection strategies.',
  ARRAY['Advanced penetration testing', 'Real-time threat monitoring and alerts', 'Secure data encryption and storage', 'Compliance readiness (GDPR, HIPAA)', 'Security audit and recovery planning'],
  ARRAY['SSL/TLS', 'OAuth 2.0', 'Security Headers', 'WAF (Web App Firewalls)', 'Data Encryption', 'Auth0'],
  ARRAY['Financial Systems', 'E-health Platforms', 'Enterprise Data Storage', 'Identity Management'],
  ARRAY['Customer Trust', 'Data Integrity', 'Regulatory Compliance'],
  ARRAY['Vulnerability Scan', 'Security Architecture Design', 'Implementation of Safeguards', 'Employee Security Training', 'Continuous Monitoring'],
  '👉 Secure Your Business',
  'blue',
  'SECURE',
  7
),
(
  'SEO Services',
  'seo-services',
  'Data-driven strategies to boost your online visibility and drive organic growth.',
  'Strategic Search Dominance and Organic Growth',
  'Go beyond keywords. We implement data-driven SEO strategies that improve your search visibility, drive high-quality organic traffic, and convert visitors into loyal customers.',
  ARRAY['Deep keyword research and intent mapping', 'Technical SEO and site health audits', 'Content strategy and semantic optimization', 'Backlink profile engineering', 'Detailed performance analytics and reporting'],
  ARRAY['Google Search Console', 'Ahrefs', 'Semrush', 'Schema Markup', 'Performance Core Web Vitals'],
  ARRAY['E-commerce Growth', 'B2B Lead Generation', 'Brand Visibility Campaigns', 'Local Market Dominance'],
  ARRAY['Long-term ROI', 'Market Authority', 'Sustainable Lead Flow'],
  ARRAY['SEO Audit', 'Competitor Analysis', 'Strategy Roadmap', 'On-page & Off-page Execution', 'Monthly ROI Reporting'],
  '👉 Improve Your Rankings',
  'green',
  'GROW',
  8
);

-- ============================================
-- SEED DATA: Site Settings (Contact Info)
-- ============================================
INSERT INTO public.site_settings (key, value, description) VALUES
('company_name', 'Vertex Tech Solutions', 'Company display name'),
('company_tagline', 'Innovate. Automate. Secure. Grow.', 'Company tagline'),
('contact_phone', '+254 708 688 691', 'Primary contact phone number'),
('contact_email', 'oscarodero@tech-center.com', 'Primary contact email'),
('contact_address', 'Nairobi, Kenya', 'Company address'),
('admin_pin', '3381', 'Admin panel access PIN')
ON CONFLICT (key) DO NOTHING;
