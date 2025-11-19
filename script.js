class SmoothScroll {
    constructor() {
        this.menuLinks = document.querySelectorAll('.primary-menu a[href^="#"]');
        this.header = document.querySelector('.primary-menu');
        this.init();
    }

    init() {
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        this.scrollToTarget(targetId);
    }

    scrollToTarget(targetId) {
        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        // Tính toán chính xác hơn
        const headerHeight = this.header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Update URL không làm reload page
        history.pushState(null, null, targetId);
    }
}

// Khởi tạo
new SmoothScroll();