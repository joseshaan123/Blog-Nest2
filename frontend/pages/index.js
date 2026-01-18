  function displaysideContainer(){
      const sideContainer=document.querySelector(".sideContainer")
      sideContainer.style.display='flex'
    }

    function sideContainerHidden(){
       const sideContainer=document.querySelector(".sideContainer")
      sideContainer.style.display='none' 
    }


   const reasonBox = [
    {
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        heading: "Edit Anytime",
        text: "Your blogs are always under your control. Made a typo? Changed your mind? No problem! BlogNest lets you revisit, update, or even delete your blogs anytime you wish. With full editing freedom, you can keep your content fresh, relevant, and exactly how you want it to be. Every word remains yours to refine until it perfectly captures your unique vision."
    },
    {
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        heading: "Engage With Others",
        text: "Build a community around your ideas. Connect with readers through comments and shares. BlogNest makes it easy to spark conversations and receive feedback from a global audience who shares your passions. Engagement isn't just about numbers; it's about the meaningful connections and discussions that happen after you hit the publish button."
    },
    {
        image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg", 
        heading: "Explore & Connect",
        text: "Networking is at the heart of BlogNest. Our powerful search functionality allows you to discover talented writers and thought leaders from across the globe with just a few keystrokes. By visiting user profiles, you can dive deep into their entire catalog of work, gain inspiration from different perspectives, and follow the journeys of creators who resonate with you."
    }
];

let indexBlog = 0;
const nextBtn = document.getElementById('next-btn');
const slotImg = document.getElementById('slot-img');
const slotH = document.getElementById('slot-heading');
const slotText = document.getElementById('slot-text');

nextBtn.addEventListener('click', () => {
    // Exit animations
    slotImg.classList.add('nav-up');
    setTimeout(() => slotH.classList.add('nav-up'), 100);
    setTimeout(() => slotText.classList.add('nav-up'), 200);

    setTimeout(() => {
        indexBlog = (indexBlog + 1) % reasonBox.length;
        
        // Update content
        slotImg.src = reasonBox[indexBlog].image;
        slotH.innerText = reasonBox[indexBlog].heading;
        slotText.innerText = reasonBox[indexBlog].text;

        // Entry animations
        slotImg.classList.replace('nav-up', 'nav-down-up');
        setTimeout(() => slotH.classList.replace('nav-up', 'nav-down-up'), 100);
        setTimeout(() => slotText.classList.replace('nav-up', 'nav-down-up'), 200);

        // Cleanup
        setTimeout(() => {
            slotImg.classList.remove('nav-down-up');
            slotH.classList.remove('nav-down-up');
            slotText.classList.remove('nav-down-up');
        }, 600);
    }, 500);
});