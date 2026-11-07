// Project page navigation: highlights the button of the section currently in view.

const navLinks = document.querySelectorAll('.ContainterNavigationButtons .buttonNav[href^="#"]');

const linkBySection = new Map();
navLinks.forEach(link => {
  const section = document.querySelector(link.getAttribute('href'));
  if (section) linkBySection.set(section, link);
});

function setActive(link) {
  navLinks.forEach(l => {
    const isActive = l === link;
    l.classList.toggle('active', isActive);
    if (isActive) l.setAttribute('aria-current', 'true');
    else l.removeAttribute('aria-current');
  });
}

// A section counts as "in view" when it crosses a band around the upper-middle of the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(linkBySection.get(entry.target));
  });
}, { rootMargin: '-35% 0px -60% 0px' });

linkBySection.forEach((_, section) => observer.observe(section));

// Initial state before any scrolling
if (navLinks.length) setActive(navLinks[0]);
