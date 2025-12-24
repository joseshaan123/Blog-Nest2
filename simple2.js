let currentIndex = 0;
const cards = document.querySelector(".cards");
const totalCards = document.querySelectorAll(".card").length;

document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= totalCards) {
        currentIndex = 0; // restart loop
    }

    const offset = currentIndex * -420; // card height
    cards.style.transform = `translateY(${offset}px)`;
});
