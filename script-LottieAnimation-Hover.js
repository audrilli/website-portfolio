// Lottie Animation on hover (works)
console.log("lottieConected")
// Load and initialize the Lottie animation
const lottieHover = lottie.loadAnimation({
    container: document.getElementById('contact'),
    renderer: 'svg',
    loop: false, // Disable loop to manually control the animation
    autoplay: false, // Autoplay disabled for manual control
    path: 'public/Lottie/AnimationPreparation-allLayers.json' 
  });
  
  // Track hover state and animation direction
  let isHovering = false;
  let currentDirection = 1; // 1 for forward, -1 for backward
  const lottieContainer = document.getElementById('contact');
  
  // Play forward on hover
  lottieContainer.addEventListener('mouseenter', () => {
    isHovering = true;
    if (currentDirection !== 1) {
      lottieHover.setDirection(1);
      currentDirection = 1;
    }
    lottieHover.play();
  });
  
  // Play backward from current frame on mouse leave
  lottieContainer.addEventListener('mouseleave', () => {
    if (lottieHover.currentFrame > 0) { // Ensure it's not already at the start
      isHovering = false;
      if (currentDirection !== -1) {
        lottieHover.setDirection(-1);
        currentDirection = -1;
      }
      lottieHover.play();
    }
  });
  
  // Stop animation at the start when it completes playing backward
  lottieHover.addEventListener('complete', () => {
    if (!isHovering && currentDirection === -1) {
      lottieHover.goToAndStop(0, true); // Stop at the start frame after reversing
    }
  });