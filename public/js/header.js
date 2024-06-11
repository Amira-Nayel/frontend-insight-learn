const dots = document.querySelectorAll('.dot');
const images = document.querySelectorAll('.image-container img');

dots.forEach((dot, index) => {
	dot.addEventListener('click', () => {
		dots.forEach(dot => dot.classList.remove('active'));
		dot.classList.add('active');
		images.forEach(image => image.style.display = 'none');
		images[index].style.display = 'block';
	});
});

dots[0].click();