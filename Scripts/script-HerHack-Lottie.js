// Load the Lottie animation
const animation = lottie.loadAnimation({
    container: document.getElementById('lottieAnimationCompass'), // The HTML container element
    renderer: 'svg', // Render as SVG
    loop: true,      // Set to true if you want the animation to loop
    autoplay: true,  // Automatically start the animation
    path: '../public/05-smallProjects/HerHack/Lottie/Compass_prepared.json' // URL to your animation JSON file
  });