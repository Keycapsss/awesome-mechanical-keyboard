const SCROLL_THRESHOLD = 300;

export function initScrollToTop(): void {
  const button = document.getElementById('scroll-to-top');

  if (!button) return;

  // Show/hide button based on scroll position
  let scrollTimeout: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }, 10);
  });

  // Smooth scroll to top on click
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Keyboard support (Space, Enter)
  button.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      button.click();
    }
  });
}
