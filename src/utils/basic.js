export { default as createBackground} from '../lib/creeping_line_animation.js'
export { default as fontBase64}  from "../fonts/gochiHandBase64.js"
export const bgTextColor = getComputedStyle(document.documentElement).getPropertyValue('--textProcentTransp').trim();

export default function scrollBG() {
    document.addEventListener("scroll", () => {
        try {
            const element = document.querySelector(".Banner");

            const rect = element.getBoundingClientRect().top;
            const window_height = window.innerHeight;

            element.style.opacity = 1 - Math.min(1, Math.abs(rect) / window_height);
        }
        catch (e) {
            console.error(e);
        }
    })
}