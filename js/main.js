/**
 * 张量无垠 - AI公司网站
 * 交互式JavaScript功能
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initDynamicBackground();
    initNavigation();
    initScrollAnimations();
    initCountUpAnimation();
    initSolutionTabs();
    initCasesCarousel();
    initContactForm();
    initParticles();
});

/**
 * 动态背景Canvas动画
 */
function initDynamicBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    // 初始化粒子
    function initParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? '#f0d060' : '#c9a030'
            });
        }
    }

    // 绘制粒子
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制连接线
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        // 绘制粒子
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // 更新位置
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // 边界检测
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        animationId = requestAnimationFrame(drawParticles);
    }

    // 启动动画
    resizeCanvas();
    drawParticles();

    // 监听窗口调整
    window.addEventListener('resize', resizeCanvas);
}

/**
 * 导航栏功能
 */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 更新活动导航链接
        updateActiveNavLink();
    });

    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');

            // 切换图标
            const spans = navToggle.querySelectorAll('span');
            if (navList.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // 点击导航链接
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // 关闭移动端菜单
                    if (navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        const spans = navToggle.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
            }
        });
    });

    // 更新活动导航链接
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/**
 * 滚动动画
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll(
        '.section-header, .product-card, .case-card, .news-card, .feature-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 添加动画类
    document.addEventListener('scroll', () => {
        document.querySelectorAll('.animate-in').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });

    // 触发一次检查
    setTimeout(() => {
        document.querySelectorAll('.animate-in').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
}

/**
 * 数字计数动画
 */
function initCountUpAnimation() {
    const stats = document.querySelectorAll('.stat-item');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;

        const heroSection = document.querySelector('.hero');
        const rect = heroSection.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.8) {
            hasAnimated = true;

            stats.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                const numberEl = stat.querySelector('.stat-number');
                const suffix = numberEl.textContent.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 60;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    numberEl.textContent = Math.floor(current) + suffix;
                }, 30);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();
}

/**
 * 解决方案标签页
 */
function initSolutionTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const solutionPanels = document.querySelectorAll('.solution-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // 移除所有active类
            tabBtns.forEach(b => b.classList.remove('active'));
            solutionPanels.forEach(p => p.classList.remove('active'));

            // 添加active类到当前
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/**
 * 应用案例轮播
 */
function initCasesCarousel() {
    const track = document.querySelector('.cases-track');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const dots = document.querySelectorAll('.dot');

    if (!track) return;

    let currentIndex = 0;
    const cardWidth = document.querySelector('.case-card')?.offsetWidth || 350;
    const gap = 32;
    const totalCards = document.querySelectorAll('.case-card').length;
    const visibleCards = window.innerWidth > 1200 ? 4 : window.innerWidth > 768 ? 2 : 1;
    const maxIndex = Math.max(0, totalCards - visibleCards);

    function updateCarousel() {
        const offset = -currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(${offset}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }

    // 窗口大小改变时重新计算
    window.addEventListener('resize', () => {
        const newVisibleCards = window.innerWidth > 1200 ? 4 : window.innerWidth > 768 ? 2 : 1;
        const newMaxIndex = Math.max(0, totalCards - newVisibleCards);
        if (currentIndex > newMaxIndex) {
            currentIndex = newMaxIndex;
        }
        updateCarousel();
    });
}

/**
 * 联系表单
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 获取表单数据
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 验证
        if (!data.name || !data.email || !data.message) {
            alert('请填写所有必填字段');
            return;
        }

        // 模拟提交
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        submitBtn.disabled = true;

        // 模拟API调用
        setTimeout(() => {
            alert('感谢您的留言！我们会尽快与您联系。');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    // 输入验证
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value) {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });

        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });
}

/**
 * 粒子效果
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    // 创建浮动粒子
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? '#00d4ff' : '#7c3aed'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.2};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }

    // 添加浮动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(50px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 平滑滚动修复
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = 80;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navList = document.querySelector('.nav-list');
        const navToggle = document.getElementById('navToggle');

        if (navList?.classList.contains('active')) {
            navList.classList.remove('active');
            const spans = navToggle?.querySelectorAll('span');
            spans?.forEach(s => {
                s.style.transform = 'none';
                if (s === spans[1]) s.style.opacity = '1';
            });
        }
    }
});

// 性能优化：节流滚动事件
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = requestAnimationFrame(() => {
        // 滚动时执行的代码
    });
});

// 预加载关键资源
window.addEventListener('load', () => {
    // 添加已加载类
    document.body.classList.add('loaded');

    // 延迟动画开始
    setTimeout(() => {
        document.querySelectorAll('.hero-badge, .hero-title, .hero-desc, .hero-stats, .hero-btns').forEach(el => {
            el.style.opacity = '1';
        });
    }, 100);
});
