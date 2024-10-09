export default function selectSlide() {
    if(document.querySelectorAll(".Banner").length > 1){
        try {
            const curSection = document.querySelector(".here") || document.querySelector(".Banner");
            const nextSection = curSection.nextElementSibling || document.querySelector(".Banner");

            if (curSection && nextSection) {
                curSection.classList.remove("here");
                nextSection.classList.add("here");
            }

            setTimeout(selectSlide, 2500);

        } catch (e) {
            console.log(e);
        }
    }
    else {
        console.error("banners dont load");
        return;
    }
}
