// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    // Footer quick links navigation
    document.querySelectorAll('.footer-nav a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                // Use the same navigation logic as main nav
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
                    targetSection.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Update nav active state
                    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                    const navLink = document.querySelector('.nav-link[href="' + href + '"]');
                    if (navLink) navLink.classList.add('active');
                }
            }
        });
    });

    // Function to show a section
    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show the target section
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        navMenu.classList.remove('active');
    }

    // Handle main navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle hash links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                showSection(href);
                this.classList.add('active');
            }
        });
    });

    // Handle dropdown menu clicks
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            showSection(href);
        });
    });

    // Handle analysis card clicks (from all-analyses page)
    document.querySelectorAll('.analysis-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            showSection(href);
        });
    });

    // Handle back button clicks
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            showSection(href);
        });
    });

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Handle dropdown on mobile
    const dropdown = document.querySelector('.dropdown > .nav-link');
    if (dropdown) {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash || '#home';
        showSection(hash);
    });

    // Initialize with the correct section on page load
    const initialHash = window.location.hash || '#home';
    showSection(initialHash);

    // Add smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
            }
        });
    });

    // Add fade-in effect on scroll for content boxes
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all content boxes
    document.querySelectorAll('.content-box').forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(box);
    });

    // Add active state to nav based on scroll position (alternative navigation method)
    let isNavigating = false;
    
    window.addEventListener('scroll', function() {
        if (isNavigating) return;
        
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (correspondingLink && !section.classList.contains('active')) {
                    // Don't auto-switch sections on scroll, just update active nav link
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
});