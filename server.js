require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
// Note: In a production app, we usually put HTML/CSS/JS in a 'public' folder.
// Since the structure is flat, we serve the root directory, but exclude node_modules.
app.use(express.static(__dirname, {
    index: ['index.html']
}));

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// 1. Signup Endpoint
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name || ''
            }
        }
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Account created successfully!', user: data.user, session: data.session });
});

// 2. Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Login successful', session: data.session });
});

// ==========================================
// DATABASE ENDPOINTS
// ==========================================

// Get all posts from Supabase
app.get('/api/posts', async (req, res) => {
    try {
        // We assume you have a 'posts' table in Supabase
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('order_index', { ascending: true, nullsFirst: false })
            .order('id', { ascending: false });

        if (error) {
            console.error("Error fetching posts from DB:", error);
            // Fallback to dummy data if DB query fails (e.g. table doesn't exist yet)
            return res.json([
                { id: 1, title: 'Understanding CBT', excerpt: 'A brief introduction to Cognitive Behavioral Therapy.', date: '2026-05-01' },
                { id: 2, title: 'Emotional Regulation Techniques', excerpt: 'How to manage overwhelming emotions.', date: '2026-05-15' }
            ]);
        }

        // If no posts in DB yet, return the dummy data for now
        if (!data || data.length === 0) {
            return res.json([
                { id: 1, title: 'Understanding CBT', excerpt: 'A brief introduction to Cognitive Behavioral Therapy.', date: '2026-05-01' },
                { id: 2, title: 'Emotional Regulation Techniques', excerpt: 'How to manage overwhelming emotions.', date: '2026-05-15' }
            ]);
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all courses from Supabase
app.get('/api/courses', async (req, res) => {
    try {
        const { data, error } = await supabase.from('courses').select('*').order('order_index', { ascending: true, nullsFirst: false }).order('id', { ascending: true });

        if (error || !data || data.length === 0) {
            // Fallback to dummy data
            return res.json([
                { id: 1, title: 'Tri-Therapy Bundle <br><small class="arabic-text medium">(باقة العلاج الثلاثي)</small>', price: 299.99, original_price: 400.00, discount_badge: 'Save 25%', image_url: 'images/course-tri-therapy.png', is_bundle: true, duration: '15 Days', excerpt: 'Complete mastery of evidence-based therapies. Includes full access to DBT, CBT, and ACT courses.' },
                { id: 6, title: 'Healing Journey Program <br><small class="arabic-text medium">(رحلة تعافي)</small>', price: 74.99, original_price: 150.00, discount_badge: 'Save 50%', image_url: 'images/course-healing-journey.png', is_bundle: false, duration: '2 Days', excerpt: 'A comprehensive program designed to help you process trauma and build emotional resilience.' }
            ]);
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all testimonials from Supabase
app.get('/api/testimonials', async (req, res) => {
    try {
        const { data, error } = await supabase.from('testimonials').select('*').order('order_index', { ascending: true, nullsFirst: false }).order('id', { ascending: false });

        if (error || !data || data.length === 0) {
            return res.json([
                { id: 1, rating: 5, quote: "The CBT course completely changed how I handle my anxiety.", author: "Sarah M." },
                { id: 2, rating: 5, quote: "I took the Tri-Therapy bundle. Best investment ever.", author: "Ahmed K." },
                { id: 3, rating: 5, quote: "Dr. Marwa has a way of explaining complex concepts simply.", author: "Laila T." }
            ]);
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// --- POSTS ---
app.post('/api/posts', async (req, res) => {
    const { title, excerpt, content } = req.body;
    const { data, error } = await supabase.from('posts').insert([{ title, excerpt, content, date: new Date().toISOString() }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Post created successfully', data });
});

app.put('/api/posts/reorder', (req, res) => handleReorder(req, res, 'posts'));

app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content } = req.body;
    const { data, error } = await supabase.from('posts').update({ title, excerpt, content }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Post updated successfully', data });
});

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Post deleted successfully' });
});

// --- COURSES ---
app.post('/api/courses', async (req, res) => {
    const { title, price, original_price, discount_badge, duration, excerpt, is_bundle, image_url } = req.body;
    const { data, error } = await supabase.from('courses').insert([{ 
        title, price, original_price: original_price || null, discount_badge, duration, excerpt, is_bundle, image_url 
    }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Course created successfully', data });
});

app.put('/api/courses/reorder', (req, res) => handleReorder(req, res, 'courses'));

app.put('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, price, original_price, discount_badge, duration, excerpt, is_bundle, image_url } = req.body;
    const { data, error } = await supabase.from('courses').update({ 
        title, price, original_price: original_price || null, discount_badge, duration, excerpt, is_bundle, image_url 
    }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Course updated successfully', data });
});

app.delete('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Course deleted successfully' });
});

// --- TESTIMONIALS ---
app.post('/api/testimonials', async (req, res) => {
    const { author, quote, rating } = req.body;
    const { data, error } = await supabase.from('testimonials').insert([{ author, quote, rating }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Testimonial created successfully', data });
});

app.put('/api/testimonials/reorder', (req, res) => handleReorder(req, res, 'testimonials'));

app.put('/api/testimonials/:id', async (req, res) => {
    const { id } = req.params;
    const { author, quote, rating } = req.body;
    const { data, error } = await supabase.from('testimonials').update({ author, quote, rating }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Testimonial updated successfully', data });
});

app.delete('/api/testimonials/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Testimonial deleted successfully' });
});

// Fallback route to serve index.html for SPA-like behavior or if page not found
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`To start this server, run 'npm install' then 'node server.js'`);
});
