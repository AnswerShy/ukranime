const svgNS = "http://www.w3.org/2000/svg";
const rootStyles = getComputedStyle(document.documentElement);
var textColor = rootStyles.getPropertyValue('--textProcentTransp').trim();
var fontSize = 64
var Speed = 7
var isBlock = 'fixed'
let styleSheet;

function setUpBG (speed, fontsize, textcolor, oneline) {
    const style = document.createElement('style');
    document.head.appendChild(style);
    styleSheet = style.sheet;

    isBlock = oneline ? 'block' : 'fixed'
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
    constructor (textContent, domElement, speed, fontsize, textcolor, fontBase) {
        this.textContent = textContent;
        this.domElement = domElement;
        this.speed = speed;
        this.fontsize = fontsize;
        this.textcolor = textcolor;
        this.fontBase = fontBase
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

    createSVG(textContent, fontBase) {
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", svgNS);
        const defs = document.createElement("defs")


        var styleSVG = document.createElement('style');

        defs.appendChild(styleSVG);
        svg.appendChild(defs)
        try {
            styleSVG.textContent = `
                text {
                    font-size: ${fontSize}px;
                    font-family: 'Gochi Hand';
                    fill: ${textColor};
                }
                ${fontBase}

            `;
        } catch (e) {
            console.log(e);
        }

        const text = document.createElementNS(svgNS, "text");
        text.textContent = textContent;

        svg.appendChild(text);

        document.body.appendChild(svg);
        const bbox = text.getBBox();
        document.body.removeChild(svg);


        svg.setAttribute("width", bbox.width);
        svg.setAttribute("height", bbox.height); 

        text.setAttribute("x", "0");
        text.setAttribute("y", bbox.height/2);

        const svgString = new XMLSerializer().serializeToString(svg);

        const result = `data:image/svg+xml;utf8, ${svgString.toString().replace(/"/g, "'").replace(/\n/g, '').replace(/\t/g, '').replace(/\s{2,}/g, ' ')}`
        console.log(result)
        return ([result, bbox.width, bbox.height]);
    }

    async createRow(textContent, index, domElement, fontBase) {
        const tickerRow = document.createElement('div');
        tickerRow.classList.add('ticker-row');

        const svgInfo = await this.createSVG(textContent, fontBase)

        const animationName = `ticker-${index}`;
        const fromPosition = '0 0';
        const toPosition = index % 2 === 0 ? `-${svgInfo[1]}px 0` : `${svgInfo[1]}px 0`;
        this.createKeyframes(animationName, fromPosition, toPosition);
        
        tickerRow.style.top = `${(svgInfo[2]*index)/2}px`;
        tickerRow.style.backgroundImage = `url("${svgInfo[0]}")`;
        tickerRow.style.animationName = animationName;
    
        try {
            domElement.appendChild(tickerRow)
        }
        catch (e) {
            console.log(e)
        }

    }

    start(textContent, domElement, speed, fontsize, textcolor, oneline, fontBase){
        if(document.querySelectorAll(".ticker-row")) {
            document.querySelectorAll(".ticker-row").forEach(e => e.remove())
        }
        setUpBG(speed, fontsize, textcolor, oneline)
        if(oneline) {
            this.createRow(textContent, 0, domElement, fontBase)
        }
        else {
            for(var i = 0; i < 2; i++){
            this.createRow(textContent, i, domElement, fontBase)
            }
        }
        
    }
}
