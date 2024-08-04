console.log("gugus");

//Mouse in all

document.querySelector('.logo_petal00').addEventListener('mouseover', () => {
  
    document.querySelector('.path00').style.transition = 'all 0.5s';
    document.querySelector('.path00').style.transform = 'scale(1.1) translate(-2px, 4px)';
});

document.querySelector('.logo_petal01').addEventListener('mouseover', () => {
    document.querySelector('.path01').style.transition = 'all 0.5s';
    document.querySelector('.path01').style.transform = 'scale(1.1) translate(-5px, 0)';
    
});

document.querySelector('.logo_petal03').addEventListener('mouseover', () => {
    document.querySelector('.path03').style.transition = 'all 0.5s';
    document.querySelector('.path03').style.transform = 'scale(1.1) translate(-5px, -3px)';
    
});

document.querySelector('.logo_petal04').addEventListener('mouseover', () => {
    document.querySelector('.path04').style.transition = 'all 0.5s';
    document.querySelector('.path04').style.transform = 'scale(1.1) translate(-3px, -5px)';
    
});

document.querySelector('.logo_petal05').addEventListener('mouseover', () => {
    document.querySelector('.path05').style.transition = 'all 0.5s';
    document.querySelector('.path05').style.transform = 'scale(1.1) translate(-1px, -5px)';
});

document.querySelector('.logo_petal06').addEventListener('mouseover', () => {
    document.querySelector('.path06').style.transition = 'all 0.5s';
    document.querySelector('.path06').style.transform = 'scale(1.1) translate(5px, -5px)';
});

document.querySelector('.logo_petal07').addEventListener('mouseover', () => {
    document.querySelector('.path07').style.transition = 'all 0.5s';
    document.querySelector('.path07').style.transform = 'scale(1.1) translate( 3px, -3px)';
});

document.querySelector('.logo_petal08').addEventListener('mouseover', () => {
    document.querySelector('.path08').style.transition = 'all 0.5s';
    document.querySelector('.path08').style.transform = 'scale(1.1) translate( 2px, 3px)';
});



//Mouseout all
  document.querySelector('.logo_petal01').addEventListener('mouseout', () => {
    document.querySelector('.path01').style.transform = 'scale(1)';

    
  });
  document.querySelector('.logo_petal00').addEventListener('mouseout', () => {
    document.querySelector('.path00').style.transform = 'scale(1)';
    
  });

  document.querySelector('.logo_petal03').addEventListener('mouseout', () => {
    document.querySelector('.path03').style.transform = 'scale(1)';
    
  });

  document.querySelector('.logo_petal04').addEventListener('mouseout', () => {
    document.querySelector('.path04').style.transform = 'scale(1)';
    
  });

  document.querySelector('.logo_petal05').addEventListener('mouseout', () => {
    document.querySelector('.path05').style.transform = 'scale(1)';
    
  });

  document.querySelector('.logo_petal06').addEventListener('mouseout', () => {
    document.querySelector('.path06').style.transform = 'scale(1)';
    
  });

  document.querySelector('.logo_petal07').addEventListener('mouseout', () => {
    document.querySelector('.path07').style.transform = 'scale(1)';
    
  });

  document.querySelector('.logo_petal08').addEventListener('mouseout', () => {
    document.querySelector('.path08').style.transform = 'scale(1)';
    
  });