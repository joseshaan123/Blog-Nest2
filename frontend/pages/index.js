  function showSidebar(){
      const sidebar=document.querySelector(".sidebar")
      sidebar.style.display='flex'
    }

    function hideSidebar(){
       const sidebar=document.querySelector(".sidebar")
      sidebar.style.display='none' 
    }


   const blogFeatures = [
    {
        img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        head: "Edit Anytime",
        para: "Your blogs are always under your control. Made a typo? Changed your mind? No problem! BlogNest lets you revisit, update, or even delete your blogs anytime you wish. With full editing freedom, you can keep your content fresh, relevant, and exactly how you want it to be. Every word remains yours to refine until it perfectly captures your unique vision."
    },
    {
        img: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        head: "Engage With Others",
        para: "Build a community around your ideas. Connect with readers through comments and shares. BlogNest makes it easy to spark conversations and receive feedback from a global audience who shares your passions. Engagement isn't just about numbers; it's about the meaningful connections and discussions that happen after you hit the publish button."
    },
    {
        img: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg", 
        head: "Explore & Connect",
        para: "Networking is at the heart of BlogNest. Our powerful search functionality allows you to discover talented writers and thought leaders from across the globe with just a few keystrokes. By visiting user profiles, you can dive deep into their entire catalog of work, gain inspiration from different perspectives, and follow the journeys of creators who resonate with you."
    }
];

let blogIndex = 0;
const blogBtn = document.getElementById('next-blog');
const bImg = document.getElementById('blog-img');
const bHead = document.getElementById('blog-head');
const bPara = document.getElementById('blog-para');

blogBtn.addEventListener('click', () => {
    // Exit animations
    bImg.classList.add('slide-up-out');
    setTimeout(() => bHead.classList.add('slide-up-out'), 100);
    setTimeout(() => bPara.classList.add('slide-up-out'), 200);

    setTimeout(() => {
        blogIndex = (blogIndex + 1) % blogFeatures.length;
        
        // Update content
        bImg.src = blogFeatures[blogIndex].img;
        bHead.innerText = blogFeatures[blogIndex].head;
        bPara.innerText = blogFeatures[blogIndex].para;

        // Entry animations
        bImg.classList.replace('slide-up-out', 'slide-up-in');
        setTimeout(() => bHead.classList.replace('slide-up-out', 'slide-up-in'), 100);
        setTimeout(() => bPara.classList.replace('slide-up-out', 'slide-up-in'), 200);

        // Cleanup
        setTimeout(() => {
            bImg.classList.remove('slide-up-in');
            bHead.classList.remove('slide-up-in');
            bPara.classList.remove('slide-up-in');
        }, 600);
    }, 500);
});