
const animation = lottie.loadAnimation({
    container: document.getElementById('lottie-scroll'), // Specify the container
    renderer: 'svg',
    loop: true,   // Set to false because scroll controls playback
    autoplay:true, // Autoplay set to false; controlled by scroll
    path: 'public/Lottie/AnimationPreparation3.json' // Replace with your JSON file path
  });

  // Initialize Lottie interactivity

    LottieInteractivity.create({
      player: animation, // Use the animation instance
      mode: "scroll",
      actions: [
        {
          visibility: [0, 1.0], // Visibility range from start to end of scroll
          type: "seek",
          frames: [0, 72], // Frame range of the animation
        },
      ]
    });



    const lottieProjectdone = lottie.loadAnimation({
      container: document.getElementById('lottie-project-done'),
      renderer: 'svg',
      loop: true, // Set to true for looping
      autoplay: false, // Start manually when in view
      path: 'public/Lottie/AnimationPreparationProjectDone 2.json' // Replace with your Lottie JSON file path
    });
    
    // Set up the Intersection Observer to trigger when element is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lottieProjectdone.play(); // Play and loop the animation when in view
        } else {
          lottieProjectdone.stop(); // Optionally stop it when out of view
        }
      });
    }, {
      threshold: 0.5 // Adjust as needed (e.g., 0.5 for 50% visibility to trigger)
    });
    
    // Start observing the target element
    observer.observe(document.getElementById('lottie-project-done'));
