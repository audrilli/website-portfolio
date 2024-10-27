document.addEventListener("DOMContentLoaded", () => {
    // const progressBar = document.getElementById("progress");
    const circles = document.querySelectorAll(".circle");
    const sections = document.querySelectorAll(".trigger-section");
    
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const circleId = sectionId.split('-')[0];
            const activeCircle = document.getElementById(circleId); // Match circle by prefix
            
            if (activeCircle) {
                if (entry.isIntersecting) {
                    // When section enters the viewport
                    activeCircle.classList.add("active");
                } else {
                    // When section exits the viewport
                    activeCircle.classList.remove("active");
                }

                // Update the progress bar width after each change
                // updateProgressBar();
            }
        });
    }, observerOptions);

    // function updateProgressBar() {
    //     // Calculate the width of the progress bar based on the active circles
    //     const activeCircles = document.querySelectorAll(".circle.active").length;
    //     const progressWidth = ((activeCircles - 1) / (circles.length - 1)) * 100;
    //     progressBar.style.width = `${progressWidth}%`;
    // }

    // Start observing each section
    sections.forEach(section => observer.observe(section));
});
