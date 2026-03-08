function drawRetroBackground(){

const pixel = 20;

for(let x = 0; x < canvas.width; x += pixel){
for(let y = 0; y < canvas.height; y += pixel){

let noise = Math.sin((x+y+Date.now()*0.05)*0.02);

let brightness = 20 + noise * 20;

ctx.fillStyle = `rgb(${brightness},${brightness+20},${brightness+40})`;

ctx.fillRect(x,y,pixel,pixel);

}
}

}
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
let count = 0;

let baseSpeed = 14;
let speed = baseSpeed;

let state = "start";

let score = 0;
let highScore = localStorage.getItem("snakeHigh") || 0;

let snake = {
x: 200,
y: 200,
dx: grid,
dy: 0,
cells: [],
maxCells: 4
};

let apple = {
x: 300,
y: 300
};

function randomPos(){
return Math.floor(Math.random()*20)*grid;
}

function resetGame(){

snake.x = 200;
snake.y = 200;
snake.cells = [];
snake.maxCells = 4;
snake.dx = grid;
snake.dy = 0;

score = 0;
speed = baseSpeed;

apple.x = randomPos();
apple.y = randomPos();

state = "playing";

}

function drawText(text,size,y){
ctx.fillStyle = "white";
ctx.font = size + "px monospace";
ctx.textAlign = "center";
ctx.fillText(text, canvas.width/2, y);
}

function gameLoop(){

requestAnimationFrame(gameLoop);

if(state !== "playing"){
ctx.clearRect(0,0,canvas.width,canvas.height);

drawText("SNAKE",50,150);
drawText("Press Arrow Key To Start",20,200);
drawText("High Score: " + highScore,18,240);

return;
}

if(++count < speed){
return;
}

count = 0;

ctx.clearRect(0,0,canvas.width,canvas.height);

snake.x += snake.dx;
snake.y += snake.dy;

if(snake.x < 0) snake.x = canvas.width-grid;
if(snake.x >= canvas.width) snake.x = 0;

if(snake.y < 0) snake.y = canvas.height-grid;
if(snake.y >= canvas.height) snake.y = 0;

snake.cells.unshift({x:snake.x,y:snake.y});

if(snake.cells.length > Math.floor(snake.maxCells)){
snake.cells.pop();
}

ctx.shadowBlur = 15;
ctx.shadowColor = "#00ff9d";

ctx.fillStyle = "#00ff9d";

snake.cells.forEach((cell,index)=>{

ctx.fillRect(cell.x,cell.y,grid-2,grid-2);

if(cell.x === apple.x && cell.y === apple.y){

score++;

snake.maxCells += 0.7;

speed = Math.max(5, speed - 0.3);

apple.x = randomPos();
apple.y = randomPos();

}

for(let i=index+1;i<snake.cells.length;i++){

if(cell.x === snake.cells[i].x && cell.y === snake.cells[i].y){

state = "gameover";

if(score > highScore){
highScore = score;
localStorage.setItem("snakeHigh",score);
}

}

}

});

ctx.shadowBlur = 20;
ctx.shadowColor = "red";
ctx.fillStyle = "red";

ctx.fillRect(apple.x,apple.y,grid-2,grid-2);

ctx.shadowBlur = 0;

ctx.fillStyle = "white";
ctx.font = "16px monospace";
ctx.fillText("Score: " + score,10,20);

if(state === "gameover"){

ctx.fillStyle = "rgba(0,0,0,0.6)";
ctx.fillRect(0,0,canvas.width,canvas.height);

drawText("GAME OVER",40,180);
drawText("Score: " + score,22,220);
drawText("Press SPACE to restart",18,260);

}

}

document.addEventListener("keydown",(e)=>{

if(state === "start"){
resetGame();
}

if(e.code === "Space" && state === "gameover"){
resetGame();
}

if(e.key === "ArrowLeft" && snake.dx === 0){
snake.dx = -grid;
snake.dy = 0;
}

else if(e.key === "ArrowRight" && snake.dx === 0){
snake.dx = grid;
snake.dy = 0;
}

else if(e.key === "ArrowUp" && snake.dy === 0){
snake.dy = -grid;
snake.dx = 0;
}

else if(e.key === "ArrowDown" && snake.dy === 0){
snake.dy = grid;
snake.dx = 0;
}

});

requestAnimationFrame(gameLoop);
