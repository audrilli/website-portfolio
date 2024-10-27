document.addEventListener("DOMContentLoaded", () => {
    // const progressBar = document.getElementById("progress");
  
    const sections = document.querySelectorAll(".trigger-section");
    
    const observerOptions = {
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const circleId = sectionId.split('-')[0];
            const activeCircle = document.getElementById(circleId); // Match circle by prefix
            
            if (activeCircle) {
                if (entry.isIntersecting) {
                    // When section enters the viewport
                    activeCircle.classList.add("active");
                } else {
                    // When section exits the viewport
                    activeCircle.classList.remove("active");
                }

                // Update the progress bar width after each change
                // updateProgressBar();
            }
        });
    }, observerOptions);

    // Start observing each section
    sections.forEach(section => observer.observe(section));
});

//Scrollto sections

const offset = 200;

const briefingButton = document.getElementById("briefing")
const briefingSection = document.getElementById("briefing-section")
const briefingSectionTarget = briefingSection.getBoundingClientRect().top + window.scrollY - offset

const ideeButton = document.getElementById("idee")
const ideeSection = document.getElementById("idee-section")
const ideeSectionTarget = ideeSection.getBoundingClientRect().top + window.scrollY - offset

const prototypeButton = document.getElementById("prototype")
const prototypeSection = document.getElementById("prototype-section")
const prototypeSectionTarget = prototypeSection.getBoundingClientRect().top + window.scrollY - offset

const EntwicklungButton = document.getElementById("development")
const EntwicklungSection = document.getElementById("development-section")
const EntwicklungSectionTarget = EntwicklungSection.getBoundingClientRect().top + window.scrollY - offset

const NextStepsButton = document.getElementById("nextsteps")
const NextStepsSection = document.getElementById("nextsteps-section")
const NextStepsSectionTarget = NextStepsSection.getBoundingClientRect().top + window.scrollY - offset


// Smooth scroll to top on button click
briefingButton.addEventListener("click", () => {
    
    window.scrollTo({
        top: briefingSectionTarget,
        behavior: "smooth"
    })
  });

  ideeButton.addEventListener("click", () => {
    
    window.scrollTo({
        top: ideeSectionTarget,
        behavior: "smooth"
    })
  });

  prototypeButton.addEventListener("click", () => {
    
    window.scrollTo({
        top: prototypeSectionTarget,
        behavior: "smooth"
    })
  });


 EntwicklungButton.addEventListener("click", () => {
    
    window.scrollTo({
        top: EntwicklungSectionTarget,
        behavior: "smooth"
    })
  });


  NextStepsButton.addEventListener("click", () => {
    
    window.scrollTo({
        top: NextStepsSectionTarget,
        behavior: "smooth"
    })
  });
