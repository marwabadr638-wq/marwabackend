-- Supabase Sections Patch
-- This creates the sections table to allow full editability of the website from the admin dashboard

CREATE TABLE IF NOT EXISTS public.sections (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default rows if they don't exist
INSERT INTO public.sections (section_key, title, subtitle, content)
VALUES
    ('hero', 'Dr. Marwa Badr Ahmed', 'Family, Marital & Educational Counselor | Psychological Trainer', 'Helping individuals understand themselves, build emotional resilience, and create healthier relationships through evidence-based psychological practices.'),
    ('about', 'About Me', '', '<p>I am a Mental Health Specialist with several years of experience in psychological counseling, family and marital guidance, and self-development training. My work is rooted in a deep belief that awareness is the first step toward healing and transformation.</p><p>I specialize in <strong>Cognitive Behavioral Therapy (CBT)</strong>, <strong>Dialectical Behavior Therapy (DBT)</strong>, and <strong>Acceptance & Commitment Therapy (ACT)</strong>, using structured, evidence-based approaches to help individuals regulate emotions, overcome anxiety, and rebuild their sense of identity.</p><p>Through both one-on-one sessions and group programs, I aim to create meaningful, lasting impact in people’s lives by helping them develop clarity, emotional strength, and healthier behavioral patterns.</p>'),
    ('expertise', 'My Expertise', '', ''),
    ('courses', 'Online Courses', 'Unlock your potential with specialized digital courses.', ''),
    ('contact', 'Get In Touch', 'Have an inquiry or want to send a message? Reach out below.', '')
ON CONFLICT (section_key) DO NOTHING;

-- Set up Row Level Security
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sections"
ON public.sections FOR SELECT
USING (true);

-- Allow all operations for simplicity in this backend pattern, though typically you'd restrict this
CREATE POLICY "Allow all operations on sections"
ON public.sections FOR ALL
USING (true)
WITH CHECK (true);
