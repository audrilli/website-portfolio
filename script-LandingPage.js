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
      pathElement.setAttribute('fill', '#bfff36');
    });
  
    petalElement.addEventListener('mouseout', () => {
      pathElement.style.transform = 'scale(1)';
      pathElement.setAttribute('fill', '#ffffff');
    });
  });

  //Link Hoverstates
  
  const links = document.querySelectorAll('.link');
  const background = document.getElementById('background');
  
  links.forEach(link => {
    link.addEventListener('mouseover', () => {
      const image = link.getAttribute('data-bg');
      background.style.backgroundImage = `url(${image})`;
    });
  
    link.addEventListener('mouseout', () => {
      background.style.backgroundImage = '';
    });
  });

