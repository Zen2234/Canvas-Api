
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

const rocketImg = document.getElementById("rocket");
const planetImgs = [
  document.getElementById("planet"),
  document.getElementById("planet2"),
  document.getElementById("planet3")
];

const startButton = document.getElementById("startButton");
const timerDisplay = document.getElementById("ajastin");

let gameStarted = false;
let GameTime = 45;
let timerInterval;
let score = 0;
const targetScore = 100;


// Raketti
const rocket = {
  x: 50,
  y: 200,
  width: 95,
  height: 95
};

//planeetat
const planets = [
  { x: canvas.width,       y: 50,  speed: 10.0, img: planetImgs[0] },
  { x: canvas.width + 200, y: 170, speed: 12.0, img: planetImgs[1] },
  { x: canvas.width + 400, y: 100, speed: 14.0, img: planetImgs[2] }
];

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);

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

      // Törmäys
      if (checkCollision(rocket, p)) {
        score++;
        p.x = canvas.width + Math.random() * 200;
        p.y = 50 + Math.random() * (canvas.height - 150);
      }
    });
  }

  // Pisteet
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Pisteet: ${score}`, canvas.width - 160, 30);

  requestAnimationFrame(drawScene);
}

// Törmäyksen tarkistus
function checkCollision(a, b) {
  return a.x < b.x + 80 &&
         a.x + a.width > b.x &&
         a.y < b.y + 80 &&
         a.y + a.height > b.y;
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, duration);
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

            if (score >= targetScore) {
                gameStarted = false;
                clearInterval(timerInterval);
                winSound.play();
                showToast(`Saavutit ${score} pistettä! Voitit ennen ajan loppua!`);
                startButton.disabled = false;
                GameTime = 45;
                score = 0;
                timerDisplay.textContent = `Aika: ${GameTime}`;
            } else if (GameTime <= 0) {
                gameStarted = false;
                clearInterval(timerInterval);
                loseSound.play();
                showToast("Aika loppui ja hävisit pelin");
                startButton.disabled = false;
                GameTime = 45;
                score = 0;
                timerDisplay.textContent = `Aika: ${GameTime}`;
            }
        }, 1000);
    }
});

// Raketin ohjaus hiirellä
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;

  rocket.y = mouseY - rocket.height / 2;
  if (rocket.y < 0) rocket.y = 0;
  if (rocket.y + rocket.height > canvas.height) rocket.y = canvas.height - rocket.height;
});

// Varmistetaan että kuvat ovat varmasti ladattu
const allImages = [rocketImg, ...planetImgs];
Promise.all(allImages.map(img => img.complete ? Promise.resolve() :
  new Promise(resolve => img.onload = resolve)
)).then(drawScene);
