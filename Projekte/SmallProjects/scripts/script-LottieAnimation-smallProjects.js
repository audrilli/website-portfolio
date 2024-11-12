


    const lottieProjectdone = lottie.loadAnimation({
      container: document.getElementById('lottie-project-done'),
      renderer: 'svg',
      loop: true, // Set to true for looping
      autoplay: false, // Start manually when in view
      path: 'AnimationPreparationProjectDone-smallProjects.json'
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
console.log("connectedLottiesmallProjects")