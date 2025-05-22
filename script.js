// Animasi saat elemen muncul di viewport
document.addEventListener('DOMContentLoaded', function() {
	const animateElements = document.querySelectorAll('.animate__animated');
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const animation = entry.target.getAttribute('data-animate');
				entry.target.classList.add(animation);
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1
	});
	
	animateElements.forEach(element => {
		observer.observe(element);
	});
	
	// Smooth scroll untuk anchor links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
			});
		});
	});
});