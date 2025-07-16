let p5Canvas;
let stars = [];
const NUM_STARS = 100;
let animationStarted = false;

function setup() {
    const visualContainer = select('#visual-container');
    p5Canvas = createCanvas(visualContainer.width, visualContainer.height);
    p5Canvas.parent('p5-container');

    for (let i = 0; i < NUM_STARS; i++) {
        stars.push(createVector(random(width), random(height), random(5)));
    }
    background(0);
}

function draw() {
    if (animationStarted) {
        background(0, 0, 0, 20);
        
        for (let i = 0; i < stars.length; i++) {
            stroke(255, 255, 255, stars[i].z * 50);
            strokeWeight(stars[i].z);
            point(stars[i].x, stars[i].y);

            stars[i].x += (mouseX - width / 2) * 0.005;
            stars[i].y += (mouseY - height / 2) * 0.005;

            if (stars[i].x < 0 || stars[i].x > width || stars[i].y < 0 || stars[i].y > height) {
                stars[i].x = random(width);
                stars[i].y = random(height);
            }
        }

        if (mouseIsPressed) {
            noStroke();
            fill(random(50, 150), random(100, 200), random(200, 255), 100);
            ellipse(mouseX, mouseY, random(20, 80), random(20, 80));
        }
    } else {
        background(0);
    }
}

function windowResized() {
    const visualContainer = select('#visual-container');
    resizeCanvas(visualContainer.width, visualContainer.height);
    for (let i = 0; i < stars.length; i++) {
        stars[i].x = random(width);
        stars[i].y = random(height);
    }

    if (processingInstance) {
        processingInstance.size(visualContainer.width, visualContainer.height);
    }
}

var sketchProc = function(processing) {
    let planetSize = 100;
    let planetColor;
    let growing = true;

    processing.setup = function() {
        const visualContainer = document.getElementById("visual-container");
        processing.size(visualContainer.offsetWidth, visualContainer.offsetHeight);
        processing.background(0, 0);
        processing.frameRate(30);
    };

    processing.draw = function() {
        if (animationStarted) {
            processing.background(0, 0);
            
            if (growing) {
                planetSize += 0.5;
                if (planetSize > 150) growing = false;
            } else {
                planetSize -= 0.5;
                if (planetSize < 80) growing = true;
            }

            let r = processing.map(processing.sin(processing.frameCount * 0.05), -1, 1, 100, 255);
            let g = processing.map(processing.sin(processing.frameCount * 0.03), -1, 1, 50, 200);
            let b = processing.map(processing.sin(processing.frameCount * 0.07), -1, 1, 0, 150);
            planetColor = processing.color(r, g, b, 200);

            processing.noStroke();
            processing.fill(planetColor);
            processing.ellipse(processing.width / 2, processing.height / 2, planetSize, planetSize);
        } else {
            processing.background(0, 0);
        }
    };
};

var processingInstance;
document.addEventListener('DOMContentLoaded', (event) => {
    var processingCanvasElement = document.getElementById("processing-canvas");
    processingInstance = new Processing(processingCanvasElement, sketchProc);
});

document.getElementById("start-button").addEventListener("click", function () {
    animationStarted = !animationStarted;
    if (animationStarted) {
        alert("¡Explorando la Galaxia! Mueve el mouse para ver las nebulosas y observa el planeta pulsante.");
        this.textContent = "Detener Exploración";
    } else {
        alert("Exploración pausada.");
        this.textContent = "Explorar Galaxia";
        background(0);
    }
});