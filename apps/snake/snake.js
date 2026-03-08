const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;

let snake = [{x:160,y:160}];
let dx = grid;
let dy = 0;

let apple = {x:320,y:320};

function loop(){

requestAnimationFrame(loop);

ctx.clearRect(0,0,400,400);

let head = {
x:snake[0].x + dx,
y:snake[0].y + dy
};

snake.unshift(head);

if(head.x === apple.x && head.y === apple.y){

apple.x = Math.floor(Math.random()*20)*grid;
apple.y = Math.floor(Math.random()*20)*grid;

}else{
snake.pop();
}

ctx.fillStyle="red";
ctx.fillRect(apple.x,apple.y,grid,grid);

ctx.fillStyle="lime";

snake.forEach(part=>{
ctx.fillRect(part.x,part.y,grid,grid);
});

}

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft"){dx=-grid;dy=0;}
if(e.key==="ArrowRight"){dx=grid;dy=0;}
if(e.key==="ArrowUp"){dy=-grid;dx=0;}
if(e.key==="ArrowDown"){dy=grid;dx=0;}

});

loop();
