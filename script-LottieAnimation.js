// // Load and initialize the Lottie animation
// const lottieHover = lottie.loadAnimation({
//     container: document.getElementById('lottie-hover'),
//     renderer: 'svg',
//     loop: false, // Disable loop to manually control the animation
//     autoplay: false, // Autoplay disabled for manual control
//     path: 'public/Lottie/FlowerAnimation.json' 
//   });
  
//   // Track hover state and animation direction
//   let isHovering = false;
//   let currentDirection = 1; // 1 for forward, -1 for backward
//   const lottieContainer = document.getElementById('lottie-hover');
  
//   // Play forward on hover
//   lottieContainer.addEventListener('mouseenter', () => {
//     isHovering = true;
//     if (currentDirection !== 1) {
//       lottieHover.setDirection(1);
//       currentDirection = 1;
//     }
//     lottieHover.play();
//   });
  
//   // Play backward from current frame on mouse leave
//   lottieContainer.addEventListener('mouseleave', () => {
//     if (lottieHover.currentFrame > 0) { // Ensure it's not already at the start
//       isHovering = false;
//       if (currentDirection !== -1) {
//         lottieHover.setDirection(-1);
//         currentDirection = -1;
//       }
//       lottieHover.play();
//     }
//   });
  
//   // Stop animation at the start when it completes playing backward
//   lottieHover.addEventListener('complete', () => {
//     if (!isHovering && currentDirection === -1) {
//       lottieHover.goToAndStop(0, true); // Stop at the start frame after reversing
//     }
//   });



  // Initialize the Lottie animation without autoplay
const lottieAnimation = lottie.loadAnimation({
    container: document.getElementById('lottie-scroll'),
    renderer: 'svg',
    loop: false, // Set to false to avoid looping unless desired
    autoplay: false, // Animation will start manually
    path: 'public/Lottie/AnimationPreparation3.json' // Replace with your Lottie JSON file path
  });
  
  // Set up the Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lottieAnimation.play(); // Play animation when element is in view
      } else {
        lottieAnimation.stop(); // Optionally stop it when out of view
      }
    });
  }, {
    threshold: 0.5 // Adjust this value for how much of the element should be visible to trigger
  });
  
  // Start observing the target element
  observer.observe(document.getElementById('lottie-scroll'));
  