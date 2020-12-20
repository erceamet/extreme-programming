class ShapeMaker {
    static makeStar(offset) {
        const RADIUS = 6;
        const STAR_POINTS = 5;

        let star = new Konva.Group({
            x: 0,
            y: 0
        });

        for (let degreesSpun = 0; degreesSpun <= 360; degreesSpun += 360 / STAR_POINTS) {
            let radAngle = ShapeMaker.degreesToRadians(degreesSpun);
            star.add(
                new Konva.Line({
                    points: [
                        STICKY_SIZE + offset,
                        0,
                        STICKY_SIZE + offset + RADIUS * Math.sin(radAngle),
                        0 + RADIUS * Math.cos(radAngle),
                    ],
                    stroke: starColour,
                    strokeWidth: 4,
                    lineCap: "square",
                    lineJoin: "square",
                })
            );
        }

        return star;
    }

    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}
