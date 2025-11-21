class SimpleSmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                this.handleLinkClick(link);
            }
        });

        this.initScrollSpy();
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

        if (!targetElement || !header) return;

        const headerHeight = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
    }

    setActiveMenu(activeLink) {
        document.querySelectorAll('a[href^="#"].active').forEach(link => {
            link.classList.remove('active');
        });

        activeLink.classList.add('active');
    }

    initScrollSpy() {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sections = document.querySelectorAll('#home, #about, #location, #utilities, #design, #progress');

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const currentSection = '#' + section.id;

                    document.querySelectorAll('a[href^="#"].active').forEach(link => {
                        link.classList.remove('active');
                    });

                    const activeLink = document.querySelector(`a[href="${currentSection}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        });
    }

    closeMobileMenu() {
        if (window.innerWidth <= 768) {
            const toggleBtn = document.querySelector('.slicknav_btn.slicknav_open');
            if (toggleBtn) {
                toggleBtn.click();
                return;
            }
            const mobileMenu = document.querySelector('.slicknav_nav');
            if (mobileMenu && mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            }
            if (typeof jQuery !== 'undefined' && jQuery('.slicknav_menu').length) {
                jQuery('.slicknav_menu').slicknav('close');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimpleSmoothScroll();
});

// Processing email form
document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('form.wpcf7-form');

    // CSS notification and validation
    const style = document.createElement('style');
    style.textContent = `
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
        
        /* Validation Styles */
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
        .field-required::after {
            content: " *";
            color: #dc3545;
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
    document.head.appendChild(style);

    // Func validate
    function validateForm(form) {
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.wpcf7-form-control-wrap').forEach(wrap => {
            wrap.classList.remove('error');
        });

        // Validate Name
        const nameInput = form.querySelector('input[name="your-name"]');
        if (!nameInput || nameInput.value.trim().length < 2) {
            showFieldError(nameInput, 'Vui lòng nhập họ tên (ít nhất 2 ký tự)');
            isValid = false;
        }

        // Validate Phone
        const phoneInput = form.querySelector('input[name="your-tel"]');
        if (!phoneInput || !isValidPhone(phoneInput.value)) {
            showFieldError(phoneInput, 'Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
            isValid = false;
        }

        return isValid;
    }

    function isValidPhone(phone) {
        const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function showFieldError(input, message) {
        const wrap = input.closest('.wpcf7-form-control-wrap');
        if (wrap) {
            wrap.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            wrap.appendChild(errorEl);
        }
    }

    // Notification
    function showNotification(type, title, message) {
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

        // Auto hidden 5s
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

    // Send mail to form
    forms.forEach(form => {
        // Add  real-time validation
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', function () {
                if (this.name === 'your-name' && this.value.trim().length < 2) {
                    showFieldError(this, 'Vui lòng nhập họ tên (ít nhất 2 ký tự)');
                } else if (this.name === 'your-tel' && this.value && !isValidPhone(this.value)) {
                    showFieldError(this, 'Số điện thoại không hợp lệ');
                } else {
                    const wrap = this.closest('.wpcf7-form-control-wrap');
                    if (wrap) {
                        wrap.classList.remove('error');
                        wrap.querySelector('.error-message')?.remove();
                    }
                }
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate
            if (!validateForm(this)) {
                showNotification(
                    'error',
                    'THÔNG TIN CHƯA HỢP LỆ',
                    'Vui lòng kiểm tra lại các trường thông tin được đánh dấu.'
                );
                return;
            }

            const submitBtn = this.querySelector('input[type="submit"]');
            const originalText = submitBtn.value;

            // Display loading
            submitBtn.value = '🔄 ĐANG XỬ LÝ...';
            submitBtn.disabled = true;

            // New form data
            const formData = new FormData(this);

            // Send request
            fetch(this.action, {
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
                        showNotification(
                            'success',
                            'THÀNH CÔNG!',
                            'Yêu cầu của Quý khách đã được gửi thành công. Đội ngũ Newtown Diamond sẽ liên hệ trong thời gian sớm nhất.'
                        );
                        this.reset();

                        const popup = document.querySelector('.pum-overlay');
                        if (popup) popup.style.display = 'none';
                    } else {
                        showNotification(
                            'error',
                            'THẤT BẠI',
                            'Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại sau hoặc liên hệ hotline 0979 807 547.'
                        );
                    }
                })
                .catch(error => {
                    showNotification(
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
    });
});