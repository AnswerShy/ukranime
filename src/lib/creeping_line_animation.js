const svgNS = "http://www.w3.org/2000/svg";
const rootStyles = getComputedStyle(document.documentElement);
var textColor = rootStyles.getPropertyValue('--textProcentTransp').trim();
var fontSize = 64
var Speed = 7
var isBlock = 'absolute'
let styleSheet;

function setUpBG (speed, fontsize, textcolor, oneline) {
    const style = document.createElement('style');
    document.head.appendChild(style);
    styleSheet = style.sheet;

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

    async createSVG(textContent, index) {
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", svgNS);
        const defs = document.createElement("defs")


        var styleSVG = document.createElement('style');

        defs.appendChild(styleSVG);
        svg.appendChild(defs)
        try {
            styleSVG.textContent = `
                @font-face {
                    font-family: 'Gochi Hand';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url('https://fonts.gstatic.com/s/gochihand/v23/hES06XlsOjtJsgCkx1Pkfon_-w.woff2') format('woff2');
                }
                text {
                    font-size: ${fontSize}px;
                    font-family: 'Gochi Hand';
                    fill: ${textColor};
                }
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

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = function() {
                const result = reader.result
                resolve([result, bbox.width, bbox.height]);
            };
            reader.readAsDataURL(blob);
        })
    }

    async createRow(textContent, index, domElement) {
        const tickerRow = document.createElement('div');
        tickerRow.classList.add('ticker-row');

        const svgInfo = await this.createSVG(textContent, index)

        const animationName = `ticker-${index}`;
        const fromPosition = '0 0';
        const toPosition = index % 2 === 0 ? `-${svgInfo[1]}px 0` : `${svgInfo[1]}px 0`;
        this.createKeyframes(animationName, fromPosition, toPosition);
    
        tickerRow.style.top = `-${(svgInfo[2]*index)/2}px`;
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
