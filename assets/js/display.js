function display() { // lcdの描画
    background(255);
    strokeWeight(2);

    sizeRate = gameWidth / 1100;

    // Vertical lines
    for (let i = 0; i <= WIDTH; i++) {
        line((50 + 50 * i) * sizeRate, 50 * sizeRate, (50 + 50 * i) * sizeRate, (450) * sizeRate);
    }

    // Horizontal lines
    for (let i = 0; i <= HEIGHT; i++) {
        line(50 * sizeRate, (50 + 100 * i) * sizeRate, 1050 * sizeRate, (50 + 100 * i) * sizeRate);
    }

    textAlign(CENTER, CENTER);
    textSize(60 * sizeRate);
    fill(0);

    // Display the lcd array content
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            text(lcd[i][j], (75 + 50 * i) * sizeRate, (90 + 100 * j) * sizeRate);
        }
    }
}
