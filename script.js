class OptimizedSmoothScroll {
    constructor() {
        this.scrollTimeout = null;
        this.lastScrollTop = 0;
        this.currentActive = null;
        this.scrollTopBtn = null;
        this.scrollThreshold = 300;
        this.sections = [];
        this.init();
    }

    init() {
        this.initScrollTopButton();
        this.getSections();
        this.initScrollSpy();

        // Event delegation for links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                this.handleLinkClick(link);
            }

            // Handle scroll top button click
            if (e.target.closest('.scrolltop-wrap a')) {
                e.preventDefault();
                this.scrollToTop();
            }
        });

        // Active section 
        setTimeout(() => {
            this.updateActiveSection();
        }, 100);
    }

    getSections() {
        const sectionIds = ['home', 'about', 'location', 'utilities', 'design', 'progress', 'contact'];
        this.sections = [];

        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                this.sections.push({
                    id: id,
                    element: section,
                    top: section.offsetTop,
                    bottom: section.offsetTop + section.offsetHeight
                });
            }
        });

        this.sections.sort((a, b) => a.top - b.top);
    }

    initScrollTopButton() {
        this.scrollTopBtn = document.querySelector('.scrolltop-wrap');
        if (!this.scrollTopBtn) {
            console.warn('Scroll top button not found');
            return;
        }

        window.addEventListener('scroll', () => {
            this.toggleScrollTopButton();
        }, { passive: true });
    }

    toggleScrollTopButton() {
        if (!this.scrollTopBtn) return;

        const scrollY = window.scrollY;

        if (scrollY > this.scrollThreshold) {
            this.scrollTopBtn.classList.add('show');
        } else {
            this.scrollTopBtn.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    handleLinkClick(link) {
        const targetId = link.getAttribute('href');
        this.scrollToTarget(targetId);
        this.setActiveMenu(link);
        this.closeMobileMenu();
    }

    scrollToTarget(targetId) {
        const targetElement = document.querySelector(targetId);
        const header = document.querySelector('#header');

        if (!targetElement || !header) {
            console.warn('Target element or header not found:', targetId);
            return;
        }

        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        if (history.replaceState) {
            history.replaceState(null, null, targetId);
        }
    }

    setActiveMenu(activeLink) {
        if (!activeLink) return;

        document.querySelectorAll('#menu a[href^="#"], .primary-menu a[href^="#"]').forEach(link => {
            link.classList.remove('active');
        });

        activeLink.classList.add('active');
        this.currentActive = activeLink;
    }

    initScrollSpy() {
        window.addEventListener('scroll', () => {
            if (this.scrollTimeout) {
                window.cancelAnimationFrame(this.scrollTimeout);
            }

            this.scrollTimeout = window.requestAnimationFrame(() => {
                this.updateActiveSection();
                this.toggleScrollTopButton();
            });
        }, { passive: true });
    }

    updateActiveSection() {
        const scrollPosition = window.scrollY + 100; // Offset for header

        let currentSection = null;

        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];

            if (scrollPosition >= section.top - 100) {
                currentSection = section;
                break;
            }
        }

        if (!currentSection && this.sections.length > 0) {
            currentSection = this.sections[0];
        }

        if (currentSection) {
            const activeLink = document.querySelector(`#menu a[href="#${currentSection.id}"], .primary-menu a[href="#${currentSection.id}"]`);
            if (activeLink && activeLink !== this.currentActive) {
                this.setActiveMenu(activeLink);
            }
        }
    }

    closeMobileMenu() {
        if (window.innerWidth > 768) return;

        const mobileMenu = document.querySelector('.slicknav_nav, [class*="mobile-menu"]');
        if (mobileMenu && mobileMenu.style.display === 'block') {
            mobileMenu.style.display = 'none';
        }

        if (typeof jQuery !== 'undefined' && jQuery('.slicknav_open').length) {
            jQuery('.slicknav_btn').trigger('click');
        }
    }
}

// FormHandler
class OptimizedFormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
        this.setupForms();
    }

    injectStyles() {
        if (document.querySelector('#newtown-styles')) return;

        const style = document.createElement('style');
        style.id = 'newtown-styles';
        style.textContent = this.getStyles();
        document.head.appendChild(style);
    }

    getStyles() {
        return `
        .newtown-notification {
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 10000;
            min-width: 350px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border-left: 5px solid #0a344d;
            animation: slideInRight 0.4s ease;
            font-family: 'Quicksand', sans-serif;
        }
        .newtown-notification.success {
            border-left-color: #28a745;
        }
        .newtown-notification.error {
            border-left-color: #dc3545;
        }
        .notification-content {
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
        }
        .success .notification-icon {
            background: #28a745;
            color: white;
        }
        .error .notification-icon {
            background: #dc3545;
            color: white;
        }
        .notification-text {
            flex: 1;
        }
        .notification-title {
            font-weight: 700;
            color: #0a344d;
            margin-bottom: 5px;
            font-size: 16px;
        }
        .notification-message {
            color: #666;
            font-size: 14px;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 5px;
        }
        
        .wpcf7-form-control-wrap.error input {
            border: 2px solid #dc3545 !important;
            background-color: #fff5f5;
        }
        .error-message {
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        `;
    }

    setupForms() {
        const forms = document.querySelectorAll('form.wpcf7-form');
        forms.forEach(form => this.setupForm(form));
    }

    setupForm(form) {
        this.addRealTimeValidation(form);
        this.handleFormSubmit(form);
    }

    validateForm(form) {
        let isValid = true;

        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.wpcf7-form-control-wrap').forEach(wrap => {
            wrap.classList.remove('error');
        });

        const nameInput = form.querySelector('input[name="your-name"]');
        if (!nameInput || nameInput.value.trim().length < 2) {
            this.showFieldError(nameInput, 'Vui lòng nhập họ tên (ít nhất 2 ký tự)');
            isValid = false;
        }

        const phoneInput = form.querySelector('input[name="your-tel"]');
        if (!phoneInput || !this.isValidPhone(phoneInput.value)) {
            this.showFieldError(phoneInput, 'Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
            isValid = false;
        }

        return isValid;
    }

    isValidPhone(phone) {
        const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    showFieldError(input, message) {
        if (!input) return;

        const wrap = input.closest('.wpcf7-form-control-wrap');
        if (wrap) {
            wrap.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            wrap.appendChild(errorEl);
        }
    }

    addRealTimeValidation(form) {
        let validationTimeout;

        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => {
                clearTimeout(validationTimeout);
                validationTimeout = setTimeout(() => {
                    this.validateField(input);
                }, 300);
            });

            input.addEventListener('input', () => {
                const wrap = input.closest('.wpcf7-form-control-wrap');
                if (wrap && wrap.classList.contains('error')) {
                    wrap.classList.remove('error');
                    wrap.querySelector('.error-message')?.remove();
                }
            });
        });
    }

    validateField(field) {
        if (field.name === 'your-name' && field.value.trim().length < 2) {
            this.showFieldError(field, 'Vui lòng nhập họ tên (ít nhất 2 ký tự)');
        } else if (field.name === 'your-tel' && field.value && !this.isValidPhone(field.value)) {
            this.showFieldError(field, 'Số điện thoại không hợp lệ');
        }
    }

    showNotification(type, title, message) {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        const notification = document.createElement('div');
        notification.className = `newtown-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${type === 'success' ? '✓' : '✗'}</div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }, 400);
    }

    handleFormSubmit(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!this.validateForm(form)) {
                this.showNotification(
                    'error',
                    'THÔNG TIN CHƯA HỢP LỆ',
                    'Vui lòng kiểm tra lại các trường thông tin được đánh dấu.'
                );
                return;
            }

            const submitBtn = form.querySelector('input[type="submit"]');
            const originalText = submitBtn.value;

            submitBtn.value = '🔄 ĐANG XỬ LÝ...';
            submitBtn.disabled = true;

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: new URLSearchParams({
                    'your-name': formData.get('your-name') || '',
                    'your-tel': formData.get('your-tel') || '',
                    'your-email': formData.get('your-email') || ''
                })
            })
                .then(response => response.text())
                .then(result => {
                    if (result === 'success') {
                        this.showNotification(
                            'success',
                            'THÀNH CÔNG!',
                            'Yêu cầu của Quý khách đã được gửi thành công. Đội ngũ Newtown Diamond sẽ liên hệ trong thời gian sớm nhất.'
                        );
                        form.reset();

                        const popup = document.querySelector('.pum-overlay');
                        if (popup) popup.style.display = 'none';
                    } else {
                        throw new Error('Server response not success');
                    }
                })
                .catch(error => {
                    this.showNotification(
                        'error',
                        'LỖI KẾT NỐI',
                        'Không thể kết nối đến hệ thống. Vui lòng kiểm tra kết nối internet và thử lại.'
                    );
                })
                .finally(() => {
                    submitBtn.value = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        new OptimizedSmoothScroll();
        new OptimizedFormHandler();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});