document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("scroll-video");
    const videoContainer = document.querySelector(".videoContainer");

    // Ensure video is loaded and ready
    video.addEventListener("loadedmetadata", () => {
        const videoDuration = video.duration;

        window.addEventListener("scroll", () => {
            const containerTop = videoContainer.getBoundingClientRect().top;
            const containerHeight = videoContainer.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calculate how much of the container is in view
            const startScroll = windowHeight;
            const endScroll = containerHeight + windowHeight;

            const scrollProgress = Math.min(
                Math.max(
                    (startScroll - containerTop) / (endScroll - startScroll),
                    0
                ),
                1
            );

            // Map scroll progress to video playback
            video.currentTime = scrollProgress * videoDuration;
        });
    });
});
