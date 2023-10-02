// Creating two class gameRoad that defines the dimensions of the road of the game.
class gameRoad {
  constructor(height, width) {
      this.height = height;
      this.width = width;
  }
}
// For Road
let Road = new gameRoad(690, 400);
let context;
let gameOver = false;
let score = 0;

// For player Car
let playercarHeight = 60;
let playercarWidth = 60;
let playercarPositionX = Road.width / 2;
let playercarPositionY = Road.height - 130;
let playercarImage;

// For enemy Car
let enemycarArr = [];
let enemycarWidth = 60;
let enemycarHeight = 100;
let enemycarPositionX = Road.width/8;
let enemycarPositionY = Road.height/2;
let enemycarImage = [
    'img/blueenemycar.png',
    'img/purpleenemycar.png',
    'img/yellowenemycar.png',
    'img/joker.png'
  ];

// To move the car vertically downward
let downMove = 3;
// To move the car left and right
let xMove = 0;

// Creating a Car object
let car = {
  height: playercarHeight,
  width: playercarWidth,
  positionX: playercarPositionX,
  positionY: playercarPositionY  
};

// This function is responsible to render everything on the screen
window.onload = function() {
  loadRoad = document.getElementById("gameRoad");
  loadRoad.height = Road.height;
  loadRoad.width = Road.width;

  // Renders in 2d
  context = loadRoad.getContext("2d");

  // load player car image
  playercarImage = new Image(); // Create the new instance of the car
  playercarImage.src = 'img/playercar.png';
  // Now Loading the car image
  playercarImage.onload = function() {
    context.drawImage(playercarImage, car.positionX, car.positionY, car.width, car.height);
  };

  // To refresh the frame
  requestAnimationFrame(renderFrames);

  // Cars are generated every 1 seconds
  setInterval(setEnemy, 1500);

  // Making the car move in left and right direction
  document.addEventListener("keydown", moveCar);
};

// Function to update the frames of the canvas
function renderFrames() {
  requestAnimationFrame(renderFrames);

  // Reset the frame when the game is over
  if(gameOver)
    return;

  // CLearing the frame
  context.clearRect(0, 0, Road.width, Road.height);
  
  // For middle dashed lines
  // Sets the dashed line pattern(50 on and 20 off)
  context.setLineDash([50,20])
  // context.beginPath();
  context.lineWidth = 4;
  // Defining new shape or line
  context.beginPath();
  // Place the line in the center
  context.moveTo(Road.width / 2, 0);
  // Defining the ending of the line
  context.lineTo(Road.width / 2, Road.height);
  // Sets the color of the lines
  context.strokeStyle = "yellow";
  // Draws the middle dashed line in the road
  context.stroke()
  
  // For player car
  // For left and right movement update
  car.positionX = Math.max(Math.min(car.positionX + xMove, Road.width - car.width), 0);
  context.drawImage(playercarImage, car.positionX, car.positionY, car.width, car.height);

  // For enemy car
  for (let i = 0; i < enemycarArr.length; i++) {
    let enemyCar = enemycarArr[i];
    enemyCar.positionY += downMove;
    context.drawImage(enemyCar.img, enemyCar.positionX, enemyCar.positionY,enemyCar.width, enemyCar.height)

    // Updating the points
    if(!enemyCar.isPassed && car.positionY< enemyCar.positionY - car.height ){
      score+=1;
      enemyCar.isPassed = true;
    }

    // Detecting the collision 
    if(detectCollision(car,enemyCar))
      gameOver = true
  }

  // For score
  // Loading batman face logo as a score image
  let scoreImage = new Image();
  scoreImage.src = ("img/score.png")
  context.fillStyle = "red";
  context.font = "35px Monospace";
  context.fillText(score, 50, 40);
  context.drawImage(scoreImage,10,10,35,35);

  // When gameover 
  if(gameOver){
    // Loading gameover image
    // let gameoverImage = new Image();
    // gameoverImage.src = ("img/gameover.png");
    // context.drawImage(gameverImage,20,20,80,390);
    context.fillStyle = "Red"
    context.fillText("GAME OVER", 5,90);
    context.fillText("Press space", 80,400);
    context.fillText("to continue", 80,430);
  };

}

// Function to set enemy car
function setEnemy() {
  if (gameOver)
    return;
  // Random x position within the road width
  let randomcarPositionX = Math.random() * (Road.width - enemycarWidth); 
  // To generate random enemy car image
  let randomCarImage = enemycarImage[Math.floor(Math.random() * enemycarImage.length)]; 
  let enCar = {
    img: new Image(),
    height: enemycarHeight,
    width: enemycarWidth,
    positionX: randomcarPositionX,
    // Starting from the top of the game road
    positionY: -enemycarHeight,
    isPassed: false
  };

  enCar.img.src = randomCarImage;
  enemycarArr.push(enCar);
}
  
// For the movement of the car
function moveCar(e){
    if(e.code == "KeyA"){
        xMove = -3;
    }
    else if(e.code == "KeyD"){
        xMove = 3;
    }
    else if(e.code == "Space"){
        if(gameOver){
            car.positionY = playercarPositionY;
            enemycarArr = [];
            score = 0;
            gameOver = false
        }
    }
}

// For collision detection
function detectCollision(car1, car2) {
    return (
      car1.positionX < car2.positionX + car2.width &&
      car1.positionX + car1.width > car2.positionX &&
      car1.positionY < car2.positionY + car2.height &&
      car1.positionY + car1.height > car2.positionY
    );
  }