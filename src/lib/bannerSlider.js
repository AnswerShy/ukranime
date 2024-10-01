export default function selectSlide(slide) {
    try {
        const curSection = document.querySelector(".here") ? document.querySelector(".here") : document.querySelector(".Banner").classList.add("here");
        const nextSection = curSection.nextElementSibling ? curSection.nextElementSibling : document.querySelector(".Banner");

        if (nextSection && curSection) {
            setTimeout(() => {
                curSection.classList.remove("here");
                nextSection.classList.add("here");
                selectSlide();
            }, 5000);
        }
    } catch (e) {
        console.log(e);
    }
}