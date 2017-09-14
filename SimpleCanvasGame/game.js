// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
//canvas.width = 512;
//canvas.height = 480;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
heroReady = true;
};
heroImage.src = "images/fah.jpg";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Bullet image
var bulletReady = false;
var bulletImage = new Image();
bulletImage.onload = function () {
bulletReady = true;
};
bulletImage.src = "images/db.png";

//background music and sound effect
var bgm = new Audio ('audios/aliez.mp3')
var soundEffect = new Audio ('audios/sf.mp3')

// Game objects
var hero = {};
var monster = {
speed: 256 // movement in pixels per second
};
function Bullet(dx ,dy) {
this.x = 0;
this.y = canvas.height/2;
this.dx = dx;
this.dy = dy;
this.speed = 512; // movement in pixels per second
};
var bulletList = [];
var checkCatch = window.localStorage.getItem("catch");
var checkEscape = window.localStorage.getItem("escape");
if (checkCatch == null){
window.localStorage.setItem("catch", 0);
}
if (checkEscape == null){
window.localStorage.setItem("escape", 0);
}
// Handle keyboard controls
//var onMouseDown = {};

//addEventListener("keydown", function (e) {
// keysDown[e.keyCode] = true;
//}, false);

//addEventListener("keyup", function (e) {
// delete keysDown[e.keyCode];
//}, false);

//onmousedown
//addEventListener("onmousedown", function (e) {
// onMouseDown[e.button] = true;
//}, false);
function handleMouseDown(e){
var dx, dy, measureX, measureY, speedScale;
measureX = e.clientX - 0;
measureY = e.clientY - canvas.height/2;
speedScale = 512/Math.sqrt(measureX*measureX + measureY*measureY);
dx = speedScale*measureX;
dy = speedScale*measureY;
var newBullet = new Bullet(dx,dy);
bulletList.push(newBullet);
};

// Reset the game when the player catches a monster
var reset = function () {
//
hero.x = 0;
hero.y = canvas.height / 2;

// Throw the monster somewhere on the right edge of the screen randomly
monster.x = canvas.width;
monster.y = canvas.height/15 + (Math.random() * (canvas.height * 13/15));
};

// Update game objects
var update = function (modifier) {
var lCatch = window.localStorage.getItem("catch");
var lEscape = window.localStorage.getItem("escape");
for (var n = bulletList.length-1; n > -1; n--){
 bulletList[n].x += bulletList[n].dx * modifier;
 bulletList[n].y += bulletList[n].dy * modifier;
}
monster.x -= monster.speed * modifier;

// if (1 in onMouseDown) { //Player shoot
//  var measureX, measureY, speedScale;
//  var newBullet = new Bullet;
//  measureX = e.clientX - hero.x;
//  measureY = e.clientY - hero.y;
//  speedScale = newBullet.speed/sqrt(measureX^2 + measureY ^2)
//  newBullet.dx = speedScale*measureX;
//  newBullet.dy = speedScale*measureY;
//  bulletList.push(newBullet)
// }

// Are they touching?
if (
 hero.x <= (monster.x + 32)
 && monster.x <= (hero.x + 32)
 && hero.y <= (monster.y + 32)
 && monster.y <= (hero.y + 32)
) {
 //++monstersCaught;
 ++lCatch;
 soundEffect.play();
 reset();
}
for (var n = bulletList.length-1; n > -1; n--){
 var checkBullet = bulletList[n];
 if(
  checkBullet.x <= (monster.x + 32)
  && monster.x <= (checkBullet.x + 32)
  && checkBullet.y <= (monster.y + 32)
  && monster.y <= (checkBullet.y + 32)
 ) {
  bulletList.splice(n,1);
  //++monstersCaught;
  ++lCatch;
  soundEffect.play();
  reset();
 }if (checkBullet.x > canvas.width || checkBullet.y < 0 || checkBullet.y > canvas.height){
  bulletList.splice(n,1);
 }
}
if( monster.x <= 0 ) {
 //++monstersEscaped;
 ++lEscape;
 reset();
}
window.localStorage.setItem("catch",lCatch);
window.localStorage.setItem("escape",lEscape);
};

// Draw everything
var render = function () {
var lCatch = window.localStorage.getItem("catch");
var lEscape = window.localStorage.getItem("esape");
if (bgReady) {
 //ctx.drawImage(bgImage, 0, 0);
 ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

if (heroReady) {
 ctx.drawImage(heroImage, hero.x, hero.y);
}

if (monsterReady) {
 ctx.drawImage(monsterImage, monster.x, monster.y);
}

if (bulletReady) {
 for (var n = 0; n < bulletList.length; n++){
  ctx.drawImage(bulletImage, bulletList[n].x,bulletList[n].y);
 }
}

// Score
ctx.fillStyle = "rgb(250, 250, 250)";
ctx.font = "24px Helvetica";
ctx.textAlign = "left";
ctx.textBaseline = "top";
ctx.fillText("Goblins caught: " + lCatch, 32, 32);
ctx.fillText("Goblins escaped: " + lEscape, 32, 64);
ctx.fillText("Bullet List: " + bulletList.length, 32, 96);
};

// The main game loop
var main = function () {
var now = Date.now();
var delta = now - then;

window.onmousedown = handleMouseDown;

update(delta / 1000);
render();

then = now;

// Request to do this again ASAP
requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
bgm.play();
main();
