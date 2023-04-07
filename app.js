const app = (() => {
    const boxes = {};

    const Token = (colorToken, xPosition, yPosition) => {
        return {
            color: colorToken,
            x: xPosition,
            y: yPosition
        };
    };

    const Box = (idBox, canvasBox, ctx, tenDollarsTokensArray, fiftyDollarsTokensArray) => {
        return {
            id: idBox,
            canvas: canvasBox,
            context: ctx,
            tenDollarsTokens: tenDollarsTokensArray,
            fiftyDollarsTokens: fiftyDollarsTokensArray
        };
    }

    const drawToken = (ctx, token) => {
        ctx.fillStyle = token.color;
        ctx.beginPath();
        ctx.arc(token.x, token.y , 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    const initDraw = () => {
        for (let number = 1; number < 8; number++) {
            let canvas = document.getElementById("canvas" + number);

            boxes[number.toString()] = Box(21 - number + 1,canvas, canvas.getContext("2d"), [],
                []);
        }

        Object.keys(boxes).forEach((key) => {
            let box = boxes[key];

            box.canvas.addEventListener('click', (event) => {
                const rect = box.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                box.tenDollarsTokens.push(Token('red', x, y));
                drawToken(box.context, box.tenDollarsTokens[box.tenDollarsTokens.length - 1]);

                if (box.tenDollarsTokens.length >= 5) {
                    box.context.clearRect(0, 0, box.canvas.width, box.canvas.height);
                    box.tenDollarsTokens.length = 0;

                    box.fiftyDollarsTokens.push(Token('yellow', x, y));
                    box.fiftyDollarsTokens.forEach((token) => {
                        drawToken(box.context, token);
                    })
                }

                console.log("Id: " + box.id + ", Ten$: " + box.tenDollarsTokens.length);
                console.log("Id: " + box.id + ", Fifty$: " + box.fiftyDollarsTokens.length);
            })
        })

        Object.keys(boxes).forEach((key) => {
            let box = boxes[key];
            box.context.canvas.width = box.canvas.offsetWidth;
            box.context.canvas.height = box.canvas.offsetHeight;
        });
    };

    return {
        draw: initDraw
    };
})();