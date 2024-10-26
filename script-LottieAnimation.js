// Load and initialize the Lottie animation
const lottieHover = lottie.loadAnimation({
    container: document.getElementById('lottie-hover'),
    renderer: 'svg',
    loop: false, // Set to false so it stops when hover ends
    autoplay: false, // Don't autoplay on load
    path: 'public/Lottie/FlowerAnimation.json' 
  });
  
  // Add hover event listeners
  const lottieContainer = document.getElementById('lottie-hover');
  
  lottieContainer.addEventListener('mouseenter', () => {
    lottieHover.play();
  });
  
  lottieContainer.addEventListener('mouseleave', () => {
    lottieHover.stop();
  });
  