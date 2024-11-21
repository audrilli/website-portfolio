document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("scroll-video");

    video.addEventListener("loadedmetadata", () => {
        const videoDuration = video.duration;

        window.addEventListener("scroll", () => {
            // Get the current scroll position
            const scrollTop = window.scrollY;

            // Playback starts after the user scrolls 250px
            const startScrollOffset = 300;
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
