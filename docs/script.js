	document.addEventListener('DOMContentLoaded', () => {
		const imgs = Array.from(document.querySelectorAll('img:not(.brand-logo):not(nav img)'));
		// Select broad set of textual elements but exclude anything inside nav/.top-nav
		const textElements = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,p,span,blockquote,button,a,li'));
		const textTargets = textElements.filter(el => {
			if (el.closest('nav') || el.closest('.top-nav') || el.closest('footer')) return false;
			// skip empty elements
			if (!el.textContent || el.textContent.trim().length === 0) return false;
			return true;
		});

		// Add base classes so CSS styles apply
		imgs.forEach(img => img.classList.add('slide-in'));
		textTargets.forEach(el => el.classList.add('slide-in-left'));

		const productCards = Array.from(document.querySelectorAll('.product-card'));

		productCards.forEach(card => {
			const slides = Array.from(card.querySelectorAll('.product-slide'));
			const dots = Array.from(card.querySelectorAll('.product-dot'));
			const prevBtn = card.querySelector('.product-slider-btn.prev');
			const nextBtn = card.querySelector('.product-slider-btn.next');
			let currentIndex = 0;
			let autoplayId;

			const updateSlides = (index) => {
				if (!slides.length) return;
				currentIndex = (index + slides.length) % slides.length;
				slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === currentIndex));
				dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentIndex));
			};

			const startAutoplay = () => {
				if (autoplayId) window.clearInterval(autoplayId);
				autoplayId = window.setInterval(() => updateSlides(currentIndex + 1), 3500);
			};

			if (slides.length) {
				updateSlides(0);
				prevBtn?.addEventListener('click', () => updateSlides(currentIndex - 1));
				nextBtn?.addEventListener('click', () => updateSlides(currentIndex + 1));
				dots.forEach(dot => dot.addEventListener('click', () => updateSlides(Number(dot.dataset.index))));
				card.addEventListener('mouseenter', () => window.clearInterval(autoplayId));
				card.addEventListener('mouseleave', startAutoplay);
				startAutoplay();
			}
		});

		const observerOptions = {
			root: null,
			rootMargin: '0px 0px -10% 0px',
			threshold: 0.12
		};

		const onIntersect = (entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					obs.unobserve(entry.target);
				}
			});
		};

		const allTargets = [...imgs, ...textTargets];

		if ('IntersectionObserver' in window) {
			const observer = new IntersectionObserver(onIntersect, observerOptions);
			allTargets.forEach(t => observer.observe(t));
		} else {
			// Fallback: reveal all targets immediately
			allTargets.forEach(t => t.classList.add('in-view'));
		}
	});

