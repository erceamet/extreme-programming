class LineHandler {
    constructor(lineColour) {
        this.lineLayer = new Konva.Layer();
        this.LINE_COLOUR = lineColour;
    }

    static getPoints(stickyOne, stickyTwo) {
        const midPointBuffer = STICKY_SIZE / 2;
        return [
            stickyOne.x() + midPointBuffer,
            stickyOne.y() + midPointBuffer,
            stickyTwo.x() + midPointBuffer,
            stickyTwo.y() + midPointBuffer,
        ];
    }

    makeLinesConnectingStickies(stickys) {
        let r = this;
        r.lineLayer.find("Line").destroy();

        stickys.forEach((sticky) => {
            sticky.off("dragmove");
        });

        stickys.forEach((firstSticky) => {
            stickys.forEach((secondSticky) => {
                firstSticky.ticketData.relatedTo.forEach((relatedTo) => {
                    if (relatedTo == secondSticky.ticketData.id) {
                        let line = new Konva.Line({
                            points: LineHandler.getPoints(firstSticky, secondSticky),
                            stroke: r.LINE_COLOUR,
                            strokeWidth: 10,
                            lineCap: "square",
                            lineJoin: "square",
                            dash: [2, 20],
                        });

                        let drawLine = (line) => {
                            line.points(LineHandler.getPoints(firstSticky, secondSticky));
                            r.lineLayer.batchDraw();
                        };

                        firstSticky.on("dragmove", () => drawLine(line));
                        secondSticky.on("dragmove", () => drawLine(line));

                        r.lineLayer.add(line);
                        r.lineLayer.batchDraw();
                    }
                });
            });
        });
    }
}
