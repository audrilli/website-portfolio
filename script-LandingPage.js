

console.log("gugus");

  //Logo Animation final
let transformScale;
transformScale = 1.1;

  const petals = [
    { petal: 'logo_petal00', path: 'path00', transform: 'scale(1.1) translate(-2px, 4px)' },
    { petal: 'logo_petal01', path: 'path01', transform: 'scale(1.1) translate(-5px, 0)' },
    { petal: 'logo_petal03', path: 'path03', transform: 'scale(1.1) translate(-5px, -3px)' },
    { petal: 'logo_petal04', path: 'path04', transform: 'scale(1.1) translate(-3px, -5px)' },
    { petal: 'logo_petal05', path: 'path05', transform: 'scale(1.1) translate(-1px, -5px)' },
    { petal: 'logo_petal06', path: 'path06', transform: 'scale(1.1) translate(5px, -5px)' },
    { petal: 'logo_petal07', path: 'path07', transform: 'scale(1.1) translate(3px, -3px)' },
    { petal: 'logo_petal08', path: 'path08', transform: 'scale(1.1) translate(2px, 3px)' }
  ];
  
  petals.forEach(({ petal, path, transform }) => {
    const petalElement = document.querySelector(`.${petal}`);
    const pathElement = document.querySelector(`.${path}`);
  
    petalElement.addEventListener('mouseover', () => {
      pathElement.style.transition = 'all 0.8s';
      pathElement.style.transform = transform;
      // pathElement.setAttribute('fill', '#bfff36');
      pathElement.setAttribute('fill', '#ff00aa');
      pathElement.setAttribute('stroke','#ff00aa')
      
    });
  
    petalElement.addEventListener('mouseout', () => {
      pathElement.style.transform = 'scale(1)';
      pathElement.setAttribute('fill', '#000000');
      pathElement.setAttribute('stroke','#000000')
    });
  });

  //Link Hoverstates
  
  const links = document.querySelectorAll('.link');
  const background = document.getElementById('background');
  
  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      const image = link.getAttribute('data-bg');
      background.style.backgroundImage = `url(${image})`;
      background.classList.add('visible');
    });
  
    link.addEventListener('mouseout', () => {
      background.classList.remove('visible');
      
    });
  });

  const content = document.querySelector('.content');
  console.log(content);


 //Scrollbehaviour ContactButton

 document.getElementById('btnContact').addEventListener('click',() => {
  document.getElementById('scrolltoContact').scrollIntoView({
    behavior:'smooth'});
    });

    //Back to top Button

 

    const backToTopButton = document.getElementById("btnUpTop");
    const backToTopButtonContainer = document.getElementById("containerBtnUpTop")

    // Smooth scroll to top on button click
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
    
    // Toggle button visibility on scroll
    window.addEventListener("scroll", () => {  // Corrected typo here
      if (window.scrollY >= 500) {  // Adjusted threshold to 500px as per comment
        backToTopButtonContainer.classList.add("visible");  // Show button when scrolled 500px
      } else {
        backToTopButtonContainer.classList.remove("visible"); // Hide button if scrolled less
      }
    });
      
