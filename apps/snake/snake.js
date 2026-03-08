const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
let frame = 0;

let state = "start";

let baseSpeed = 14;
let speed = baseSpeed;

let score = 0;
let highScore = localStorage.getItem("snakeHigh") || 0;

let snake = {
x:200,
y:200,
dx:grid,
dy:0,
cells:[],
maxCells:4
};

let apple = {
x: randomPos(),
y: randomPos()
};

let particles = [];

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

particles = [];

apple.x = randomPos();
apple.y = randomPos();

state = "playing";

}

function drawText(text,size,y){

ctx.fillStyle="white";
ctx.font=size+"px monospace";
ctx.textAlign="center";
ctx.fillText(text,canvas.width/2,y);

}

function drawRetroBackground(){

let pixel = 20;

for(let x=0;x<canvas.width;x+=pixel){
for(let y=0;y<canvas.height;y+=pixel){

let noise = Math.sin((x+y+Date.now()*0.05)*0.02);

let c = 15 + noise*20;

ctx.fillStyle = `rgb(${c},${c+20},${c+40})`;

ctx.fillRect(x,y,pixel,pixel);

}
}

}

function drawScanlines(){

ctx.fillStyle="rgba(0,0,0,0.15)";

for(let y=0;y<canvas.height;y+=4){
ctx.fillRect(0,y,canvas.width,1);
}

}

function spawnParticles(x,y){

for(let i=0;i<18;i++){

particles.push({
x:x+10,
y:y+10,
vx:(Math.random()-0.5)*4,
vy:(Math.random()-0.5)*4,
life:30
});

}

}

function updateParticles(){

particles.forEach(p=>{

p.x += p.vx;
p.y += p.vy;
p.life--;

});

particles = particles.filter(p=>p.life>0);

}

function drawParticles(){

ctx.fillStyle="orange";

particles.forEach(p=>{

ctx.globalAlpha = p.life/30;
ctx.fillRect(p.x,p.y,4,4);

});

ctx.globalAlpha=1;

}

function loop(){

requestAnimationFrame(loop);

drawRetroBackground();
drawScanlines();

if(state==="start"){

drawText("SNAKE",50,170);
drawText("Press Arrow Key",20,210);
drawText("High Score: "+highScore,18,250);

return;

}

if(state==="gameover"){

drawText("GAME OVER",40,180);
drawText("Score: "+score,22,220);
drawText("Press SPACE",18,260);

}

if(++frame < speed) return;
frame=0;

snake.x += snake.dx;
snake.y += snake.dy;

if(snake.x<0) snake.x=canvas.width-grid;
if(snake.x>=canvas.width) snake.x=0;

if(snake.y<0) snake.y=canvas.height-grid;
if(snake.y>=canvas.height) snake.y=0;

snake.cells.unshift({x:snake.x,y:snake.y});

if(snake.cells.length>Math.floor(snake.maxCells)){
snake.cells.pop();
}

ctx.shadowBlur=15;
ctx.shadowColor="#00ff9d";

ctx.fillStyle="#00ff9d";

snake.cells.forEach((cell,index)=>{

ctx.fillRect(cell.x,cell.y,grid-2,grid-2);

if(cell.x===apple.x && cell.y===apple.y){

spawnParticles(apple.x,apple.y);

score++;

snake.maxCells += 0.7;

speed = Math.max(5, speed-0.25);

apple.x=randomPos();
apple.y=randomPos();

}

for(let i=index+1;i<snake.cells.length;i++){

if(cell.x===snake.cells[i].x && cell.y===snake.cells[i].y){

state="gameover";

if(score>highScore){
highScore=score;
localStorage.setItem("snakeHigh",score);
}

}

}

});

ctx.shadowBlur=20;
ctx.shadowColor="red";

ctx.fillStyle="red";
ctx.fillRect(apple.x,apple.y,grid-2,grid-2);

ctx.shadowBlur=0;

updateParticles();
drawParticles();

ctx.fillStyle="white";
ctx.font="16px monospace";
ctx.textAlign="left";
ctx.fillText("Score: "+score,10,20);

}

document.addEventListener("keydown",(e)=>{

if(state==="start"){
resetGame();
}

if(e.code==="Space" && state==="gameover"){
resetGame();
}

if(e.key==="ArrowLeft" && snake.dx===0){
snake.dx=-grid;
snake.dy=0;
}

else if(e.key==="ArrowRight" && snake.dx===0){
snake.dx=grid;
snake.dy=0;
}

else if(e.key==="ArrowUp" && snake.dy===0){
snake.dy=-grid;
snake.dx=0;
}

else if(e.key==="ArrowDown" && snake.dy===0){
snake.dy=grid;
snake.dx=0;
}

});

let touchStartX=0;
let touchStartY=0;

canvas.addEventListener("touchstart",e=>{

touchStartX=e.touches[0].clientX;
touchStartY=e.touches[0].clientY;

});

canvas.addEventListener("touchend",e=>{

let dx=e.changedTouches[0].clientX-touchStartX;
let dy=e.changedTouches[0].clientY-touchStartY;

if(Math.abs(dx)>Math.abs(dy)){

if(dx>0 && snake.dx===0){
snake.dx=grid;
snake.dy=0;
}

else if(dx<0 && snake.dx===0){
snake.dx=-grid;
snake.dy=0;
}

}else{

if(dy>0 && snake.dy===0){
snake.dy=grid;
snake.dx=0;
}

else if(dy<0 && snake.dy===0){
snake.dy=-grid;
snake.dx=0;
}

}

});

requestAnimationFrame(loop);
