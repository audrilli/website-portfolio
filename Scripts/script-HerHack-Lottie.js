// Load the Lottie animation
const animation = lottie.loadAnimation({
    container: document.getElementById('lottieAnimationCompass'),
    renderer: 'svg', // Render as SVG
    loop: true,      // Set to true if you want the animation to loop
    autoplay: true,  // Automatically start the animation
    path: '../../media/05-smallProjects/HerHack/Lottie/CompassBuild1.json' // URL to your animation JSON file
  });

  const animationData = lottie.loadAnimation({
    container: document.getElementById('lottieAnimationData'), 
    loop: true,      // Set to true if you want the animation to loop
    autoplay: true,  // Automatically start the animation
    path: '../../media/05-smallProjects/HerHack/Lottie/DataAnimation_prepared.json' // URL to your animation JSON file
  });