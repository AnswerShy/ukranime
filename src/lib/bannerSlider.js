export default function selectSlide(slide) {
    try {
        var curSection = document.querySelector(".here") ? document.querySelector(".here") : document.querySelector(".Banner");
        if(curSection && !curSection.classList.contains("here")) {
            curSection.classList.add("here")
        }
        var nextSection = curSection.nextElementSibling ? curSection.nextElementSibling : document.querySelector(".Banner");

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