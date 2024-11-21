document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("scroll-video");

    video.addEventListener("loadedmetadata", () => {
        const videoDuration = video.duration;

        window.addEventListener("scroll", () => {
            // Get the current scroll position
            const scrollTop = window.scrollY;

            // Playback starts after the user scrolls 250px
            const startScrollOffset = 500;
            const scrollRange = 1000; // Range of scroll in pixels to complete playback

            if (scrollTop >= startScrollOffset) {
                // Calculate the scroll progress relative to the range
                const adjustedScroll = scrollTop - startScrollOffset;
                const scrollProgress = Math.min(adjustedScroll / scrollRange, 1);

                // Map scroll progress to the video's playback
                video.currentTime = scrollProgress * videoDuration;
            }
        });
    });
});


//Overlay Controls Projects
document.addEventListener("DOMContentLoaded", () => {
    const imageContainers = document.querySelectorAll(".gridcontainerOverviewItem");
    const overlay = document.getElementById("overlay");
    const fullscreenImage = document.getElementById("fullscreen-image");
    const imageDescription = document.getElementById("image-description");
    const closeBtn = document.getElementById("close-btn");

    imageContainers.forEach(container => {
        container.addEventListener("click", () => {
            // Get the image and description
            const img = container.querySelector("img");
            const description = container.getAttribute("data-description");

            // Set the overlay content
            fullscreenImage.src = img.src;
            imageDescription.textContent = description;

            // Show the overlay
            overlay.style.display = "flex";
        });
    });

    // Close overlay on clicking the "X" button
    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    // Close overlay when clicking anywhere outside the image
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target === fullscreenImage) {
            overlay.style.display = "none";
        }
    });
});
