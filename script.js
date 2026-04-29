document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // Sticky CTA Logic
    // ==========================================
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');
    
    if (stickyCta && heroSection) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (window.scrollY > heroBottom - 200) {
                stickyCta.style.opacity = '1';
                stickyCta.style.pointerEvents = 'auto';
                stickyCta.style.transform = 'translateY(0)';
            } else {
                stickyCta.style.opacity = '0';
                stickyCta.style.pointerEvents = 'none';
                stickyCta.style.transform = 'translateY(20px)';
            }
        });

        stickyCta.addEventListener('click', () => {
            if (window.AnalyticsSystem) {
                window.AnalyticsSystem.trackEvent('CTA_click', { button: 'sticky_cta' });
            }
        });
    }

    // ==========================================
    // Quiz Logic
    // ==========================================
    const openQuizBtn = document.getElementById('open-quiz-btn');
    const quizModal = document.getElementById('quiz-modal');
    const quizAnswerBtns = document.querySelectorAll('.quiz-answer-btn');
    const quizQuestionContainer = document.getElementById('quiz-question-container');
    const quizResultContainer = document.getElementById('quiz-result-container');
    const quizRecommendation = document.getElementById('quiz-recommendation');

    const courseMap = {
        '1': {
            title: 'برنامج رحلة تعافي (Healing Journey)',
            desc: 'هذا البرنامج مصمم خصيصاً لمساعدتك على معالجة الصدمات النفسية، التحرر من أعباء الماضي، وإعادة بناء السلام الداخلي بخطوات عملية ومدروسة.'
        },
        '2': {
            title: 'دورة العلاج المعرفي السلوكي (CBT)',
            desc: 'العلاج المعرفي السلوكي (CBT) هو المعيار الذهبي عالمياً للتعامل مع التفكير المفرط، القلق، والاكتئاب. سيساعدك على تفكيك الأفكار السلبية وإعادة هيكلة طريقة تفكيرك.'
        },
        '3': {
            title: 'دورة العلاج الجدلي السلوكي (DBT)',
            desc: 'العلاج الجدلي السلوكي (DBT) هو الأقوى علمياً في علاج التقلبات المزاجية الحادة، الاندفاعية، وتطوير مهارات تنظيم المشاعر وبناء علاقات صحية.'
        },
        '4': {
            title: 'دورة اضطرابات الشخصية',
            desc: 'هذه الدورة ستوفر لك الفهم العميق للأنماط السلوكية المعقدة وتمنحك الأدوات اللازمة للتعامل مع سمات اضطرابات الشخصية بوعي واستقرار.'
        },
        '5': {
            title: 'دورة العلاج بالتقبل والالتزام (ACT)',
            desc: 'سيساعدك العلاج بالتقبل والالتزام (ACT) على التوقف عن محاربة مشاعرك، وزيادة المرونة النفسية، والتحرك نحو حياة مليئة بالمعنى والقيم الحقيقية.'
        },
        '6': {
            title: 'باقة العلاج الثلاثي المتكامل',
            desc: 'نظراً لأنك تواجه تحديات متعددة، فإن دمج تقنيات (CBT) و(DBT) و(ACT) سيمنحك أقوى الأدوات العلاجية المتاحة للوصول إلى الاتزان النفسي الشامل.'
        }
    };

    if (openQuizBtn && quizModal) {
        openQuizBtn.addEventListener('click', () => {
            quizQuestionContainer.style.display = 'block';
            quizResultContainer.style.display = 'none';
            quizModal.classList.add('active');
            if (window.AnalyticsSystem) window.AnalyticsSystem.trackEvent('quiz_started');
        });

        quizAnswerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resultId = e.currentTarget.getAttribute('data-result');
                const resultData = courseMap[resultId] || courseMap['1'];
                
                quizRecommendation.textContent = resultData.title;
                document.getElementById('quiz-explanation').textContent = resultData.desc;
                
                quizQuestionContainer.style.display = 'none';
                quizResultContainer.style.display = 'block';
                
                if (window.AnalyticsSystem) window.AnalyticsSystem.trackEvent('quiz_completed', { recommended_course: resultId });
            });
        });
    }

    // ==========================================
    // Theme Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage for theme preference, default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================
    // Mobile Navigation
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // Scroll Animations (Intersection Observer)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: stop observing once animated
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // ==========================================
    // Expertise Tabs
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // ==========================================
    // Modals Handling (Course & Auth)
    // ==========================================
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    function closeAllModals() {
        // Prevent closing auth modal if user is not logged in
        const authModal = document.getElementById('auth-modal');
        const currentUser = localStorage.getItem('site_current_user');
        
        modals.forEach(m => {
            if (m.id === 'auth-modal' && !currentUser) {
                return; // Keep auth modal open
            }
            m.classList.remove('active');
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    const courseModal = document.getElementById('course-modal');
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
    
    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseCard = e.target.closest('.course-card');
            if (courseCard && proceedCheckoutBtn) {
                // Get course title and create an ID
                const h3 = courseCard.querySelector('h3');
                let courseId = 'content';
                if (h3) {
                    const fullText = h3.innerHTML.replace(/<br>.*$/i, '').trim();
                    courseId = fullText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                }
                const price = courseCard.getAttribute('data-price') || '49';
                proceedCheckoutBtn.href = `checkout.html?course=${courseId}&price=${price}`;
                
                // Analytics Tracking
                if (window.AnalyticsSystem) {
                    window.AnalyticsSystem.trackEvent(courseId === 'tri-therapy-bundle' ? 'bundle_view' : 'course_view', {
                        course: courseId,
                        price: price
                    });
                }
            }
            courseModal.classList.add('active');
        });
    });

    // ==========================================
    // Auth & Login / Sign Up Logic (Local Simulation)
    // ==========================================
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    const authButtonsDiv = document.getElementById('auth-buttons');
    const userProfileDiv = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name-display');
    const logoutBtn = document.getElementById('logout-btn');

    // ==========================================
    // Toast Notification System
    // ==========================================
    function showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'ph-info';
        if (type === 'success') icon = 'ph-check-circle';
        if (type === 'error') icon = 'ph-warning-circle';

        toast.innerHTML = `<i class="ph ${icon}" style="font-size: 1.25rem;"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Export globally if needed by inline scripts
    window.showToast = showToast;

    // ==========================================
    // Backend API & Auth State Management
    // ==========================================
    const API_BASE_URL = 'https://marwabackend.onrender.com';
    
    function updateUIForAuth(user) {
        const mainContent = document.querySelector('main');
        const footer = document.querySelector('.footer');
        const authCloseBtn = authModal ? authModal.querySelector('.close-modal') : null;

        if (user) {
            if (authButtonsDiv) authButtonsDiv.style.display = 'none';
            if (userProfileDiv) userProfileDiv.style.display = 'flex';
            // Show email or name from metadata
            const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
            if (userNameDisplay) userNameDisplay.textContent = 'Welcome, ' + displayName;
            
            if (authModal) authModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            if(mainContent) mainContent.style.filter = 'none';
            if(footer) footer.style.filter = 'none';
            if(authCloseBtn) authCloseBtn.style.display = 'block';
        } else {
            if (authButtonsDiv) authButtonsDiv.style.display = 'block';
            if (userProfileDiv) userProfileDiv.style.display = 'none';
            
            document.body.style.overflow = 'auto';
            if(mainContent) mainContent.style.filter = 'none';
            if(footer) footer.style.filter = 'none';
            if(authCloseBtn) authCloseBtn.style.display = 'block';
        }
    }

    function getSessionUser() {
        try {
            return JSON.parse(localStorage.getItem('site_current_user'));
        } catch { return null; }
    }

    function setSession(session, user) {
        if (user) {
            if (session) localStorage.setItem('site_current_session', JSON.stringify(session));
            localStorage.setItem('site_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('site_current_session');
            localStorage.removeItem('site_current_user');
        }
        updateUIForAuth(user);
    }

    // Check initial auth state on load
    updateUIForAuth(getSessionUser());

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.add('active');
        });
    }

    if (tabLogin && tabSignup) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            tabLogin.style.borderBottomColor = 'var(--primary)';
            tabLogin.style.color = 'var(--primary)';
            tabSignup.style.borderBottomColor = 'transparent';
            tabSignup.style.color = 'var(--muted)';
        });

        tabSignup.addEventListener('click', () => {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
            tabSignup.style.borderBottomColor = 'var(--primary)';
            tabSignup.style.color = 'var(--primary)';
            tabLogin.style.borderBottomColor = 'transparent';
            tabLogin.style.color = 'var(--muted)';
        });
    }

    window.registerUser = async function() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const password = document.getElementById('signup-password').value;

        const submitBtn = document.querySelector('#signup-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to create account');

            closeAllModals();
            showToast(data.message || 'Account created successfully!', 'success');
            document.getElementById('signup-form').reset();
            
            // Log the user in if backend returns session
            if (data.user) {
                setSession(data.session, data.user);
            }

            // Send Email Notification via Web3Forms
            const accessKey = document.querySelector('input[name="access_key"]');
            if (accessKey && accessKey.value && !accessKey.value.includes('YOUR_ACCESS_KEY')) {
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        access_key: accessKey.value,
                        subject: 'New User Registration - Dr. Marwa Portfolio',
                        from_name: 'System Notifications',
                        message: `A new user has registered on your website.\n\nName: ${name}\nEmail: ${email}`
                    })
                }).catch(err => console.error('Email notification failed:', err));
            }
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };

    window.loginUser = async function() {
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging In...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Login failed');

            if (data.session) {
                setSession(data.session, data.session.user);
            }
            
            closeAllModals();
            showToast('Logged in successfully!', 'success');
            document.getElementById('login-form').reset();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            setSession(null, null);
            showToast('Logged out successfully.', 'info');
        });
    }

    // ==========================================
    // Dynamic Sections Logic (Fetching from Backend)
    // ==========================================
    async function fetchSections() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sections`);
            if (!response.ok) return; // Silent fail if backend is not ready
            const sections = await response.json();
            
            sections.forEach(section => {
                const sectionEl = document.getElementById(section.section_key);
                if (sectionEl && section.is_visible === false) {
                    sectionEl.style.display = 'none';
                    return;
                }
                
                const titleEl = document.getElementById(`${section.section_key}-title`);
                const subtitleEl = document.getElementById(`${section.section_key}-subtitle`);
                const contentEl = document.getElementById(`${section.section_key}-content`);
                
                if (titleEl && section.title) titleEl.innerHTML = section.title;
                if (subtitleEl && section.subtitle) subtitleEl.innerHTML = section.subtitle;
                if (contentEl && section.content) contentEl.innerHTML = section.content;
            });
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    }
    fetchSections();

    // ==========================================
    // Dynamic Blog Logic (Fetching from Backend)
    // ==========================================
    const blogPageContainer = document.getElementById('blog-page-posts-container');
    const homeBlogContainer = document.getElementById('blog-posts-container');
    
    if (blogPageContainer || homeBlogContainer) {
        async function fetchBlogPosts() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts`);
                if (!response.ok) throw new Error('Failed to fetch posts');
                const posts = await response.json();
                
                const containers = [];
                if (blogPageContainer) containers.push({ element: blogPageContainer, limit: 100 });
                if (homeBlogContainer) containers.push({ element: homeBlogContainer, limit: 3 });
                
                containers.forEach(({ element, limit }) => {
                    element.innerHTML = ''; // Clear loading state or static content
                    
                    if (!posts || posts.length === 0) {
                        element.innerHTML = '<p class="arabic-text medium text-center" style="grid-column: 1 / -1; color: var(--muted);">لا توجد مقالات حالياً.</p>';
                        return;
                    }
                    
                    posts.slice(0, limit).forEach(post => {
                        const article = document.createElement('article');
                        article.className = 'glass-card blog-card';
                        article.style.padding = '1.5rem';
                        article.style.display = 'flex';
                        article.style.flexDirection = 'column';
                        article.style.gap = '1rem';
                        
                        // Format date elegantly
                        const dateStr = post.date || post.created_at;
                        const dateObj = dateStr ? new Date(dateStr) : new Date();
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        const formattedDate = dateObj.toLocaleDateString('ar-EG', options);

                        // Prepare full content if it exists
                        const fullContentHtml = post.content ? `<div class="post-full-content arabic-text medium" style="display: none; line-height: 1.8; color: var(--text); margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">${post.content}</div>` : '';

                        article.innerHTML = `
                            <h3 class="arabic-text large" style="color: var(--primary);">${post.title || 'بدون عنوان'}</h3>
                            <span style="color: var(--muted); font-size: 0.85rem;">${formattedDate}</span>
                            <div class="post-content-area" style="flex-grow: 1;">
                                <p class="arabic-text medium post-excerpt" style="line-height: 1.8; color: var(--muted); margin: 0;">${post.excerpt || post.content || ''}</p>
                                ${fullContentHtml}
                            </div>
                            ${post.link ? `<a href="${post.link}" class="btn-outline arabic-text medium" style="align-self: flex-start; padding: 0.5rem 1rem; margin-top: auto;">اقرأ المزيد</a>` : 
                            (post.content ? `<button class="btn-outline arabic-text medium" style="align-self: flex-start; padding: 0.5rem 1rem; margin-top: auto; cursor: pointer;" onclick="const excerpt = this.previousElementSibling.querySelector('.post-excerpt'); const full = this.previousElementSibling.querySelector('.post-full-content'); if(full.style.display === 'none') { full.style.display = 'block'; excerpt.style.display = 'none'; this.textContent = 'إخفاء التفاصيل'; } else { full.style.display = 'none'; excerpt.style.display = 'block'; this.textContent = 'اقرأ المزيد'; }">اقرأ المزيد</button>` 
                            : '')}
                        `;
                        element.appendChild(article);
                    });
                });
            } catch (error) {
                console.error('Error fetching blog posts:', error);
                if (blogPageContainer) {
                    blogPageContainer.innerHTML = '<p class="arabic-text medium text-center" style="grid-column: 1 / -1; color: #ef4444;">عفواً، حدث خطأ أثناء جلب المقالات. يرجى المحاولة لاحقاً.</p>';
                }
                if (homeBlogContainer) {
                    homeBlogContainer.innerHTML = '<p class="arabic-text medium text-center" style="grid-column: 1 / -1; color: #ef4444;">عفواً، حدث خطأ أثناء جلب المقالات. يرجى المحاولة لاحقاً.</p>';
                }
            }
        }
        
        fetchBlogPosts();
    }

    // ==========================================
    // Dynamic Home Page Data (Courses & Testimonials)
    // ==========================================
    const homeCoursesContainer = document.getElementById('home-courses-container');
    const homeTestimonialsContainer = document.getElementById('home-testimonials-container');

    if (homeCoursesContainer) {
        async function fetchCourses() {
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses`);
                const courses = await response.json();
                homeCoursesContainer.innerHTML = '';
                
                if(!courses || courses.length === 0) {
                    homeCoursesContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--muted);">No courses available at the moment.</p>';
                    return;
                }
                
                courses.forEach(course => {
                    const card = document.createElement('div');
                    card.className = `course-card ${course.is_bundle ? 'bundle-card' : ''}`;
                    card.setAttribute('data-course-id', course.id);
                    card.setAttribute('data-price', course.price);
                    
                    if (course.is_bundle) {
                        card.style.border = '2px solid var(--primary)';
                        card.style.transform = 'scale(1.02)';
                        card.style.position = 'relative';
                    }

                    card.innerHTML = `
                        <div class="course-thumbnail" ${course.is_bundle ? 'style="overflow: hidden; border-radius: 12px 12px 0 0;"' : ''}>
                            <img src="${course.image_url || 'images/placeholder.jpg'}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="course-info">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                                <h3>${course.title}</h3>
                                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                                    ${course.original_price ? `<span class="strikethrough-price" style="text-decoration: line-through; color: var(--muted); font-size: 0.9rem;">$${course.original_price}</span>` : ''}
                                    <h3 style="color: var(--primary); white-space: nowrap; margin-top: 0;">$${course.price}</h3>
                                    ${course.discount_badge ? `<span class="discount-badge" style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-top: 4px; white-space: nowrap;">${course.discount_badge}</span>` : ''}
                                </div>
                            </div>
                            <p>${course.excerpt}<br><strong>Duration:</strong> ${course.duration || 'N/A'}</p>
                            <button class="${course.is_bundle ? 'btn-primary' : 'btn-outline'} subscribe-btn" ${course.is_bundle ? 'style="width: 100%; margin-top: 1rem;"' : ''}>
                                ${course.is_bundle ? 'Start Your Transformation' : 'Subscribe to Access'}
                            </button>
                        </div>
                    `;
                    homeCoursesContainer.appendChild(card);
                });
            } catch (error) {
                console.error('Error fetching courses:', error);
                homeCoursesContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #ef4444;">Error loading courses.</p>';
            }
        }
        fetchCourses();
    }

    if (homeTestimonialsContainer) {
        async function fetchTestimonials() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/testimonials`);
                const testimonials = await res.json();
                homeTestimonialsContainer.innerHTML = '';
                
                if(!testimonials || testimonials.length === 0) {
                    homeTestimonialsContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--muted);">No testimonials yet.</p>';
                    return;
                }
                
                testimonials.forEach(t => {
                    const card = document.createElement('div');
                    card.className = 'glass-card';
                    card.style.padding = '2rem';
                    card.innerHTML = `
                        <div style="color: #f59e0b; margin-bottom: 1rem; font-size: 1.2rem;">${'★'.repeat(t.rating)}</div>
                        <p style="font-style: italic; margin-bottom: 1rem;">"${t.quote}"</p>
                        <h4 style="color: var(--primary);">- ${t.author}</h4>
                    `;
                    homeTestimonialsContainer.appendChild(card);
                });
            } catch (err) {
                console.error('Error fetching testimonials:', err);
            }
        }
        fetchTestimonials();
    }


    // ==========================================
    // Cookie Consent Banner Logic
    // ==========================================
    const consentBanner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (consentBanner && acceptBtn && declineBtn) {
        const consentStatus = localStorage.getItem('cookie_consent');

        // Show banner if no consent status is found
        if (!consentStatus) {
            consentBanner.style.display = 'flex';
        } else if (consentStatus === 'granted') {
            // Update gtag if previously granted
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
            }
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'granted');
            consentBanner.style.display = 'none';
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'analytics_storage': 'granted'
                });
            }
            showToast('Cookies accepted.', 'success');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'denied');
            consentBanner.style.display = 'none';
            showToast('Cookies declined.', 'info');
        });
    }

});
