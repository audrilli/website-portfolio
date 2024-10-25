document.addEventListener('scroll', function(){
    const text = document.querySelector('.callToAction');
    const textPosition = text.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if(textPosition < windowHeight - 50){
        text.classList.add('show');
        
    }else{
        text.classList.remove('show');
    }
});
