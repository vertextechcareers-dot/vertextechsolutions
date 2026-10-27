export interface ServiceDetailContent {
  slug: string;
  title: string;
  headline: string;
  overview: string;
  whatYouGet: string[];
  technologies?: string[];
  useCases?: string[];
  results?: string[];
  benefits?: string[];
  process?: string[];
  ctaText: string;
  icon?: string;
}

export const serviceDetails: Record<string, ServiceDetailContent> = {
  "custom-web-development": {
    slug: "custom-web-development",
    title: "Custom Web Development",
    headline: "Engineered Web Solutions for the Modern Enterprise",
    overview: "We architect and deploy bespoke web ecosystems designed for extreme performance, ironclad security, and limitless scalability. From enterprise-grade platforms to high-conversion digital experiences, we build the engine of your digital growth.",
    whatYouGet: [
      "Ultra-responsive architecture for all devices",
      "Sub-second load times and performance optimization",
      "Enterprise-grade security and data encryption",
      "Custom API development and seamless integrations",
      "Advanced SEO-first structural engineering"
    ],
    technologies: ["React / Next.js", "Node.js", "Python / Django", "PostgreSQL", "Tailwind CSS", "TypeScript", "GraphQL"],
    useCases: ["Corporate Ecosystems", "Digital Platforms", "Analytics Dashboards", "Booking & Reservation Engines"],
    process: ["Requirement Architecture", "Prototype & Interface Engineering", "Full-Stack Development", "Rigorous Stress Testing", "Global Deployment"],
    benefits: ["Market Advantage", "Operational Efficiency", "Future-Proof Scalability"],
    ctaText: "👉 Start Your Website Project"
  },
  "mobile-app-development": {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    headline: "Next-Gen Mobile Experiences for iOS and Android",
    overview: "We engineer high-performance mobile applications that combine native-level speed with cross-platform efficiency. Our mobile solutions are built to engage users, drive retention, and scale with your business demands.",
    whatYouGet: [
      "High-fidelity iOS and Android applications",
      "Zero-latency user interfaces and interactions",
      "Offline-first capability and local storage",
      "Push notification and biometric integration",
      "App Store and Play Store optimization"
    ],
    technologies: ["React Native", "Expo", "Swift", "Kotlin", "Firebase", "Redux", "Lottie Animations"],
    useCases: ["E-commerce Mobiles", "Fintech Applications", "Social Platforms", "Health & Wellness Tracking"],
    process: ["User Journey Mapping", "UI/UX Engineering", "Agile Development Cycles", "Quality Assurance", "Store Submission"],
    benefits: ["Direct Customer Engagement", "Brand Authority", "Enhanced User Loyalty"],
    ctaText: "👉 Build Your Mobile App"
  },
  "saas-development": {
    slug: "saas-development",
    title: "SaaS Development",
    headline: "Scalable SaaS Architectures Built for Global Markets",
    overview: "Launch and scale your software product with a robust SaaS architecture. We build multi-tenant systems designed for high availability, seamless subscription management, and massive user growth.",
    whatYouGet: [
      "Multi-tenant database architecture",
      "Secure subscription and billing systems (Stripe)",
      "Role-based access control (RBAC)",
      "Real-time analytics and user monitoring",
      "Automated scaling and load balancing"
    ],
    technologies: ["Next.js", "Supabase", "Stripe API", "AWS Lambda", "Kubernetes", "Redis"],
    useCases: ["B2B Software Platforms", "Member Portals", "Cloud Management Tools", "Educational Platforms"],
    process: ["Architecture Design", "Core Feature Sprint", "Security & Multi-tenancy Setup", "Beta Launch & Feedback", "Scaling Strategy"],
    benefits: ["Recurring Revenue Model", "Market Scalability", "Operational Automation"],
    ctaText: "👉 Build Your SaaS Product"
  },
  "cloud-devops-services": {
    slug: "cloud-devops-services",
    title: "Cloud & DevOps",
    headline: "Mission-Critical Infrastructure and DevOps Automation",
    overview: "Optimizing your digital infrastructure for 99.99% availability. We implement modern DevOps practices and cloud-native solutions to ensure your systems are resilient, secure, and fast.",
    whatYouGet: [
      "Automated CI/CD deployment pipelines",
      "Infrastructure as Code (Terraform / CloudFormation)",
      "Zero-downtime migration strategies",
      "Proactive monitoring and incident response",
      "Cost-optimized cloud resource management"
    ],
    technologies: ["AWS", "Azure", "Google Cloud", "Docker", "Jenkins", "Terraform", "GitHub Actions"],
    useCases: ["High-Traffic Platforms", "Data-Intensive Applications", "Cloud Migrations", "Security Hardening"],
    process: ["Infrastructure Audit", "DevOps Roadmap", "Cloud Architecture Design", "Automation Implementation", "Ongoing Optimization"],
    benefits: ["Maximum Uptime", "Faster Deployment Cycles", "Reduced Operational Costs"],
    ctaText: "👉 Move to the Cloud"
  },
  "ai-application-services": {
    slug: "ai-application-services",
    title: "AI Application Services",
    headline: "Intelligent Systems Powered by Advanced AI Models",
    overview: "Integrate the power of artificial intelligence into your business applications. From predictive analytics to intelligent agents, we build AI solutions that solve complex problems and drive innovation.",
    whatYouGet: [
      "Custom AI model integration (LLMs, OpenAI)",
      "Natural Language Processing (NLP) systems",
      "Predictive analytics and data modeling",
      "Intelligent recommendation engines",
      "AI-driven content generation and analysis"
    ],
    technologies: ["OpenAI API", "Python", "TensorFlow", "PyTorch", "Pinecone (Vector DB)", "LangChain"],
    useCases: ["Intelligent Search", "Content Generation Tools", "Market Analysis AI", "Personalized User Experiences"],
    process: ["AI Opportunity Analysis", "Data Strategy", "Model Engineering", "Application Integration", "Continuous Learning Setup"],
    benefits: ["Innovation Leadership", "Enhanced Decision Making", "Competitive Differentiation"],
    ctaText: "👉 Integrate AI Into Your Business"
  },
  "automation-ai-integration": {
    slug: "automation-ai-integration",
    title: "Automation & AI Integration",
    headline: "Hyper-Automation for Modern Business Workflows",
    overview: "Eliminate manual bottlenecks and increase operational efficiency. We design and implement intelligent automation systems that streamline your workflows and liberate your team for higher-value tasks.",
    whatYouGet: [
      "End-to-end workflow automation",
      "Intelligent Chatbots and AI Agents",
      "CRM and ERP automation integrations",
      "Automated reporting and data sync",
      "RPA (Robotic Process Automation) solutions"
    ],
    technologies: ["Zapier", "Make.com", "Python Scripts", "n8n", "AI Assistants", "API Middleware"],
    useCases: ["Customer Support Automation", "Sales Funnel Automation", "Internal Process Optimization", "Automated Data Collection"],
    process: ["Workflow Discovery", "Automation Mapping", "System Integration", "Testing & Calibration", "Full-Scale Launch"],
    benefits: ["Operational Speed", "Error Reduction", "Significant Cost Savings"],
    ctaText: "👉 Automate Your Workflow"
  },
  "cybersecurity": {
    slug: "cybersecurity",
    title: "Cybersecurity",
    headline: "Ironclad Security for Your Digital Assets and Data",
    overview: "Protect your business from evolving cyber threats. We provide comprehensive security solutions including threat detection, vulnerability assessments, and robust data protection strategies.",
    whatYouGet: [
      "Advanced penetration testing",
      "Real-time threat monitoring and alerts",
      "Secure data encryption and storage",
      "Compliance readiness (GDPR, HIPAA)",
      "Security audit and recovery planning"
    ],
    technologies: ["SSL/TLS", "OAuth 2.0", "Security Headers", "WAF (Web App Firewalls)", "Data Encryption", "Auth0"],
    useCases: ["Financial Systems", "E-health Platforms", "Enterprise Data Storage", "Identity Management"],
    process: ["Vulnerability Scan", "Security Architecture Design", "Implementation of Safeguards", "Employee Security Training", "Continuous Monitoring"],
    benefits: ["Customer Trust", "Data Integrity", "Regulatory Compliance"],
    ctaText: "👉 Secure Your Business"
  },
  "seo-services": {
    slug: "seo-services",
    title: "SEO Services",
    headline: "Strategic Search Dominance and Organic Growth",
    overview: "Go beyond keywords. We implement data-driven SEO strategies that improve your search visibility, drive high-quality organic traffic, and convert visitors into loyal customers.",
    whatYouGet: [
      "Deep keyword research and intent mapping",
      "Technical SEO and site health audits",
      "Content strategy and semantic optimization",
      "Backlink profile engineering",
      "Detailed performance analytics and reporting"
    ],
    technologies: ["Google Search Console", "Ahrefs", "Semrush", "Schema Markup", "Performance Core Web Vitals"],
    useCases: ["E-commerce Growth", "B2B Lead Generation", "Brand Visibility Campaigns", "Local Market Dominance"],
    process: ["SEO Audit", "Competitor Analysis", "Strategy Roadmap", "On-page & Off-page Execution", "Monthly ROI Reporting"],
    benefits: ["Long-term ROI", "Market Authority", "Sustainable Lead Flow"],
    ctaText: "👉 Improve Your Rankings"
  }
};