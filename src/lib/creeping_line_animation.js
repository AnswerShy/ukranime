const svgNS = "http://www.w3.org/2000/svg";
const rootStyles = getComputedStyle(document.documentElement);
var textColor = rootStyles.getPropertyValue('--textProcentTransp').trim();
var fontSize = 64
var Speed = 7
var isBlock = 'absolute'
let styleSheet;

function setUpBG (speed, fontsize, textcolor, oneline) {
    if (document.styleSheets.length === 0) {
        const style = document.createElement('style');
        document.head.appendChild(style);
        styleSheet = style.sheet;
    } 
    else {
      styleSheet = document.styleSheets[0];
    }
    isBlock = oneline ? 'block' : 'absolute'
    fontSize = fontsize ? fontsize : 64
    Speed = speed ? speed : 7
    textColor = textcolor ? textcolor : rootStyles.getPropertyValue('--textProcentTransp').trim();
    try {
        styleSheet.insertRule(`.ticker-row {z-index: -1; background-repeat: repeat; animation-duration: ${Speed}s; animation-timing-function: linear; animation-iteration-count: infinite; position: ${isBlock}; height: 100%; width: 100%; transition: 1s ease; }`, styleSheet.cssRules.length);
        styleSheet.insertRule('.ticker-row:nth-child(2n) { animation-name: ticker-left; }', styleSheet.cssRules.length);
        styleSheet.insertRule('.ticker-row:nth-child(odd) { animation-name: ticker-right; }', styleSheet.cssRules.length);
    } 
    catch (e) {
      console.error(e);
    }
}

export default class createBackground {
    constructor (textContent, domElement, speed, fontsize, textcolor) {
        this.textContent = textContent;
        this.domElement = domElement;
        this.speed = speed;
        this.fontsize = fontsize;
        this.textcolor = textcolor;
    }

    createKeyframes(name, from, to) {
        const keyframes = `
            @keyframes ${name} {
                from {
                    background-position: ${from};
                }
                to {
                    background-position: ${to};
                }
            }
        `;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }

    createSVG(textContent, index) {
        const svg = document.createElementNS(svgNS, "svg");

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("font-size", fontSize);
        text.setAttribute("font-family", `"Gochi Hand", cursive`)
        text.setAttribute("fill", textColor);
        text.textContent = textContent;

        svg.appendChild(text);

        document.body.appendChild(svg);
        const bbox = text.getBBox();
        document.body.removeChild(svg);

        var widthOfPos = bbox.width + bbox.width/5

        svg.setAttribute("width", widthOfPos);
        svg.setAttribute("height", bbox.height + 50); 

        text.setAttribute("x", "10");
        text.setAttribute("y", bbox.height + 10);

        const svgString = new XMLSerializer().serializeToString(svg);
        const svgBase64 = `data:image/svg+xml;base64,${btoa(svgString)}`;

        return [svgBase64, widthOfPos, bbox.height + 50];
    }

    createRow(textContent, index, domElement) {
        const tickerRow = document.createElement('div');
        tickerRow.classList.add('ticker-row');

        var svgInfo = this.createSVG(textContent, index)

        const animationName = `ticker-${index}`;
        const fromPosition = '0 0';
        const toPosition = index % 2 === 0 ? `-${svgInfo[1]}px 0` : `${svgInfo[1]}px 0`;
        this.createKeyframes(animationName, fromPosition, toPosition);


        tickerRow.style.top = `-${(svgInfo[2]*index)/2}px`;
        // console.log(`${(svgInfo[2]*index)/2}px`)
        tickerRow.style.backgroundImage = `url('${svgInfo[0]}')`;
        tickerRow.style.animationName = animationName;

        try {
            domElement.appendChild(tickerRow)
        }
        catch (e) {
            console.log(e)
        }
    }

    start(textContent, domElement, speed, fontsize, textcolor, oneline){
        if(document.querySelectorAll(".ticker-row")) {
            document.querySelectorAll(".ticker-row").forEach(e => e.remove())
        }
        setUpBG(speed, fontsize, textcolor, oneline)
        if(oneline) {
            this.createRow(textContent, 0, domElement)
        }
        else {
            for(var i = 0; i < 2; i++){
                this.createRow(textContent, i, domElement)
            }
        }
        
    }
}
