document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress");
    const circles = document.querySelectorAll(".circle");
    const sections = document.querySelectorAll(".trigger-section");
    
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const activeCircle = document.getElementById(sectionId.split('-')[0]); // Match circle by prefix
                activeCircle.classList.add("active"); // Add active class to the circle
                
                // Calculate progress bar width based on active circles
                const activeCirclesCount = document.querySelectorAll(".circle.active").length;
                const progressWidth = ((activeCirclesCount - 1) / (circles.length - 1)) * 100;
                progressBar.style.width = `${progressWidth}%`;

                // Optionally, stop observing the element once it's triggered
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
