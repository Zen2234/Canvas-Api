
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const rocketImg = document.getElementById("rocket");
const planetImgs = [
  document.getElementById("planet"),
  document.getElementById("planet2")
];

const startButton = document.getElementById("startButton");
const timerDisplay = document.getElementById("ajastin");

let gameStarted = false;
let GameTime = 45;
let timerInterval;

//planeetat
const planets = [
  { x: canvas.width,       y: 50,  speed: 10.0, img: planetImgs[0] },
  { x: canvas.width + 200, y: 170, speed: 12.0, img: planetImgs[1] },
];



function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(rocketImg, 0, canvas.height - 95, 95, 95);

//raketti kulmaan
  const rocketWidth = 95;
  const rocketHeight = 95;
  const rocketX = 0;
  const rocketY = canvas.height - rocketHeight;
  ctx.drawImage(rocketImg, rocketX, rocketY, rocketWidth, rocketHeight);

//planeetat vain jos peli käynnissä

if (gameStarted) {
    planets.forEach((p, i) => {
        //vaakasuora liike
        p.x -= p.speed;

        //aaltoileva liike
        p.y += Math.sin(Date.now() / 500 + i) * 0.5;

        ctx.drawImage(p.img, p.x, p.y, 100, 100);

        //jos planeetta katoaa vasemmalle niin se tulee taas oikeelta
        if (p.x + 100 < 0) {
            p.x = canvas.width + Math.random() * 200;
            p.y = 50 + Math.random() * (canvas.height - 150);
        }
    });
}

    requestAnimationFrame(drawScene);
}

//aloitusnappi
startButton.addEventListener("click", () => {
    if(!gameStarted) {
        gameStarted = true;
        startButton.disabled = true;

        timerDisplay.textContent = `Aika: ${GameTime}`;
        timerInterval = setInterval(() => {
            GameTime--;
            timerDisplay.textContent = `Aika: ${GameTime}`;

            if (GameTime <= 0) {
                gameStarted = false;
                alert("Aika loppui ja hävisit pelin");
                startButton.disabled = false;
                GameTime = 45;
                timerDisplay.textContent = `Aika: ${GameTime}`;
            }

        } ,1000)
    }
})


// Varmistetaan että kuvat ovat varmasti ladattu
const allImages = [rocketImg, ...planetImgs];
Promise.all(allImages.map(img => img.complete ? Promise.resolve() :
  new Promise(resolve => img.onload = resolve)
)).then(drawScene);
