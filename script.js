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