

//Automatic video play
function InViewport(element){
const rect = element.getBoundingClientRect();

return ( 
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
);
}

const video = document.getElementById("video1");
const btnAudio = document.getElementById("btnAudio");

 // Debounce function to limit how often checkVideoVisibility is called
 function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }


function videoInViewport(){
    if(InViewport(video)){

        video.muted = true;
        video.play();
        // console.log('inview')
        
    }else{
        // console.log('not in view')
    }
}

    // Apply debounce to scroll event listener
    const debouncedCheck = debounce(videoInViewport, 400);

    // Listen for scroll event
    window.addEventListener('scroll', debouncedCheck);


window.addEventListener('scroll',videoInViewport);

videoInViewport()

//Unmute Button functionality
btnAudio.addEventListener('click',() => {
    if(video.muted){
        video.muted = false;
        btnAudio.textContent = 'Mute';

    }else{
        video.muted = true;
        btnAudio.textContent = 'Unmute';
    }
});