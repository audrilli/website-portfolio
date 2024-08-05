console.log("gugus");


//LogoAnimation
//Mouse in all

document.querySelector('.logo_petal00').addEventListener('mouseover', () => {
  
    document.querySelector('.path00').style.transition = 'all 0.5s';
    document.querySelector('.path00').style.transform = 'scale(1.1) translate(-2px, 4px)';

    const path00 = document.querySelector('.path00');
    path00.setAttribute('fill', '#bfff36');

});

document.querySelector('.logo_petal01').addEventListener('mouseover', () => {
    document.querySelector('.path01').style.transition = 'all 0.5s';
    document.querySelector('.path01').style.transform = 'scale(1.1) translate(-5px, 0)';

    const path01 = document.querySelector('.path01');
    path01.setAttribute('fill', '#bfff36');
    
});

document.querySelector('.logo_petal03').addEventListener('mouseover', () => {
    document.querySelector('.path03').style.transition = 'all 0.5s';
    document.querySelector('.path03').style.transform = 'scale(1.1) translate(-5px, -3px)';
    
    const path03 = document.querySelector('.path03');
    path03.setAttribute('fill', '#bfff36');
});

document.querySelector('.logo_petal04').addEventListener('mouseover', () => {
    document.querySelector('.path04').style.transition = 'all 0.5s';
    document.querySelector('.path04').style.transform = 'scale(1.1) translate(-3px, -5px)';
    
    const path04 = document.querySelector('.path04');
    path04.setAttribute('fill', '#bfff36');
});

document.querySelector('.logo_petal05').addEventListener('mouseover', () => {
    document.querySelector('.path05').style.transition = 'all 0.5s';
    document.querySelector('.path05').style.transform = 'scale(1.1) translate(-1px, -5px)';

    const path05 = document.querySelector('.path05');
    path05.setAttribute('fill', '#bfff36');
});

document.querySelector('.logo_petal06').addEventListener('mouseover', () => {
    document.querySelector('.path06').style.transition = 'all 0.5s';
    document.querySelector('.path06').style.transform = 'scale(1.1) translate(5px, -5px)';

    const path06 = document.querySelector('.path06');
    path06.setAttribute('fill', '#bfff36');
});

document.querySelector('.logo_petal07').addEventListener('mouseover', () => {
    document.querySelector('.path07').style.transition = 'all 0.5s';
    document.querySelector('.path07').style.transform = 'scale(1.1) translate( 3px, -3px)';

    const path07 = document.querySelector('.path07');
    path07.setAttribute('fill', '#bfff36');
});

document.querySelector('.logo_petal08').addEventListener('mouseover', () => {
    document.querySelector('.path08').style.transition = 'all 0.5s';
    document.querySelector('.path08').style.transform = 'scale(1.1) translate( 2px, 3px)';

    const path08 = document.querySelector('.path08');
    path08.setAttribute('fill', '#bfff36');
});



//Mouseout all
  document.querySelector('.logo_petal01').addEventListener('mouseout', () => {
    document.querySelector('.path01').style.transform = 'scale(1)';

    const path01 = document.querySelector('.path01');
    path01.setAttribute('fill', '#ffffff');

    
  });
  document.querySelector('.logo_petal00').addEventListener('mouseout', () => {
    document.querySelector('.path00').style.transform = 'scale(1)';
    
    const path00 = document.querySelector('.path00');
    path00.setAttribute('fill', '#ffffff');

  });

  document.querySelector('.logo_petal03').addEventListener('mouseout', () => {
    document.querySelector('.path03').style.transform = 'scale(1)';

    const path03 = document.querySelector('.path03');
    path03.setAttribute('fill', '#ffffff');
    
  });

  document.querySelector('.logo_petal04').addEventListener('mouseout', () => {
    document.querySelector('.path04').style.transform = 'scale(1)';

    const path04 = document.querySelector('.path04');
    path04.setAttribute('fill', '#ffffff');
    
  });

  document.querySelector('.logo_petal05').addEventListener('mouseout', () => {
    document.querySelector('.path05').style.transform = 'scale(1)';
    
    const path05 = document.querySelector('.path05');
    path05.setAttribute('fill', '#ffffff');

  });

  document.querySelector('.logo_petal06').addEventListener('mouseout', () => {
    document.querySelector('.path06').style.transform = 'scale(1)';

    const path06 = document.querySelector('.path06');
    path06.setAttribute('fill', '#ffffff');
    
  });

  document.querySelector('.logo_petal07').addEventListener('mouseout', () => {
    document.querySelector('.path07').style.transform = 'scale(1)';
    
    const path07 = document.querySelector('.path07');
    path07.setAttribute('fill', '#ffffff');
  });

  document.querySelector('.logo_petal08').addEventListener('mouseout', () => {
    document.querySelector('.path08').style.transform = 'scale(1)';
    
    const path08 = document.querySelector('.path08');
    path08.setAttribute('fill', '#ffffff');

  });

  //Logo Animation final