const app = (() => {
    let boxes = {};
    let colorToken = 'red';

    const Token = (colorToken, xPosition, yPosition) => {
        return {
            color: colorToken,
            x: xPosition,
            y: yPosition
        };
    };

    const Box = (idBox, canvasBox, ctx, tenDollarsTokensArray, fiftyDollarsTokensArray,
                 oneHundredDollarsTokensArray, fiveHundredDollarsTokensArray) => {
        return {
            id: idBox,
            canvas: canvasBox,
            context: ctx,
            tenDollarsTokens: tenDollarsTokensArray,
            fiftyDollarsTokens: fiftyDollarsTokensArray,
            oneHundredDollarsTokens: oneHundredDollarsTokensArray,
            fiveHundredDollarsTokens: fiveHundredDollarsTokensArray
        };
    }

    const setTokenSelected = (color) => {
        colorToken = color;
        console.log(colorToken);
    }

    const drawToken = (ctx, token) => {
        ctx.fillStyle = token.color;
        ctx.beginPath();
        ctx.arc(token.x, token.y , 2, 0, 2 * Math.PI);
        ctx.fill();
    };
    
    const addToken = (box, x, y) => {
        let tokenArray = [];
        let color = "";

        switch (colorToken) {
            case 'red':
                tokenArray = box.tenDollarsTokens;
                color = 'red';
                break;
            case 'yellow':
                tokenArray = box.fiftyDollarsTokens;
                color = 'yellow';
                break;
            case 'blue':
                tokenArray = box.oneHundredDollarsTokens;
                color = 'blue';
                break;
            case '#A1EB5B':
                tokenArray = box.fiveHundredDollarsTokens;
                color = '#A1EB5B';
                break;
            default:
                tokenArray = box.tenDollarsTokens;
                color = 'red';
                break;
        }

        let newToken = Token(color, x, y);
        tokenArray.push(newToken);
        drawToken(box.context, tokenArray[tokenArray.length - 1]);
        reduceTokens(box, x, y);
    }

    const reduceTokens = (box, x, y) => {
        let arrays = {
            ten: box.tenDollarsTokens,
            fifty: box.fiftyDollarsTokens,
            oneHundred: box.oneHundredDollarsTokens,
            fiveHundred: box.fiveHundredDollarsTokens
        };

        if (box.tenDollarsTokens.length >= 5) {
            box.fiftyDollarsTokens.push(Token('yellow', x, y));
            box.tenDollarsTokens.length = 0;
            delete arrays.ten;
        }

        if (box.fiftyDollarsTokens.length >= 2) {
            box.oneHundredDollarsTokens.push(Token('blue', x, y));
            box.fiftyDollarsTokens.length = 0;
            delete arrays.fifty;
        }

        if (box.oneHundredDollarsTokens.length >= 5) {
            box.fiveHundredDollarsTokens.push(Token('#A1EB5B', x, y));
            box.oneHundredDollarsTokens.length = 0;
            delete arrays.oneHundred;
        }

        if (Object.keys(arrays).length > 1) {
            box.context.clearRect(0, 0, box.canvas.width, box.canvas.height);

            Object.keys(arrays).forEach((key) => {
                arrays[key].forEach((token) => {
                    drawToken(box.context, token);
                })
            })
        }

        arrays.length = 0;
    }

    const initDraw = () => {
        for (let number = 1; number < 8; number++) {
            let canvas = document.getElementById("canvas" + number);

            boxes[number.toString()] = Box(21 - number + 1,canvas, canvas.getContext("2d"), [],
                [], [], []);
        }

        Object.keys(boxes).forEach((key) => {
            let box = boxes[key];
            let arrays = [];

            box.canvas.addEventListener('click', (event) => {
                const rect = box.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                addToken(box, x, y);
                
                if (box.tenDollarsTokens.length >= 5) {
                    box.context.clearRect(0, 0, box.canvas.width, box.canvas.height);
                    box.tenDollarsTokens.length = 0;

                    box.fiftyDollarsTokens.push(Token('yellow', x, y));
                    arrays.push(box.fiftyDollarsTokens);
                }

                updateBoxTokens(box, arrays);
                
                console.log("Id: " + box.id + ", $10: " + box.tenDollarsTokens.length + ", " +
                    "$50: " + box.fiftyDollarsTokens.length + ", $100: " + box.oneHundredDollarsTokens.length +
                    ", $500: " + box.fiveHundredDollarsTokens.length);
            })
        })

        Object.keys(boxes).forEach((key) => {
            let box = boxes[key];
            box.context.canvas.width = box.canvas.offsetWidth;
            box.context.canvas.height = box.canvas.offsetHeight;
        });
    };

    return {
        draw: initDraw,
        tokenSelected: (color) => {
            setTokenSelected(color);
        }
    };
})();
