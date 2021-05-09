var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth=1;

canvas.width=400
canvas.height=400

let dim = Math.min(window.innerWidth, window.innerHeight)
dim -= dim/4
canvas.style.width=  dim + "px"
canvas.style.height= dim + "px"

// document.getElementById("brs").style.width = dim + "px"

const SHIFT = 2;
const L = 40;
const H = 40;
const CHAR_L = 10;
const CHAR_H = 10;
const A = -0.3
const STROKE_COLOR = "black"
const TILE_COLOR="green"
const STROKE_COMPARISON = [0, 0, 0, 255]
const TILE_COMPARISON = [0, 128, 0,  255]
const BACKGROUND_COLOR = "blue";

var Y;
var tile_list;
var char_y;
var char_x;
var vi;
var collide;
var stop;
var once;
var tiles_pos;
var tiles_heights;
var score;
var startTime;
var anim;

function init(){
    char_y = 400/2
    Y = 400 - H;
    tile_list = [];
    char_x = 60;
    vi = 0
    collide = true
    stop = false
    once = false;
    tiles_pos = []
    tiles_heights = []
    score = 0
    startTime = new Date();
    console.log(startTime)
}

// init()
console.log(400/L)

function jump(){
    if(is_collision()){
        char_y -= 10
    }
    
    vi = 3
    draw_character()
}

function compare_arrs(arr1, arr2){
    for(let i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i]){
            return false
        }
    }
    return true
}

function is_collision() {
    ctx.beginPath()
    ctx.fillStyle="orange"
    let val = [char_x + (CHAR_H/2), char_y + (CHAR_L+1)]
    let imgdata = ctx.getImageData(...val, 1,1)
    return compare_arrs(imgdata.data, TILE_COMPARISON) || compare_arrs(imgdata.data, STROKE_COMPARISON)
}

function is_collision_x(){
    ctx.beginPath()
    ctx.fillStyle="orange"
    let val = [char_x + (CHAR_H+1), char_y + (CHAR_L/2)]
    let imgdata = ctx.getImageData(...val, 1,1)
    return compare_arrs(imgdata.data, TILE_COMPARISON) || compare_arrs(imgdata.data, STROKE_COMPARISON)    
}

function rect(x, y, w, h, fillStyle){
    ctx.beginPath()
    ctx.fillStyle=fillStyle
    ctx.strokeStyle = STROKE_COLOR;
    ctx.rect(x, y, w, h)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
}

function draw_tiles_refined(){

    if(tiles_pos.length === 0){
        for(let i = 0; i <= 400; i += L){
            tiles_pos.push(i)

            i < 300 ? tiles_heights.push(-2) : tiles_heights.push(Math.random() * 4)
        }
    }


    if(tiles_pos[0] < -L){
        tiles_pos.shift()
        tiles_heights.shift()
        tiles_pos.push(400-2 * SHIFT)
        tiles_heights.push(Math.random() * 4)
    }


    for(let i = 0; i<tiles_pos.length; i++){
        let save_Y = Y
        for(let j=0; j<tiles_heights[i]; j++){
            rect(tiles_pos[i], Y, L, H, TILE_COLOR)
            Y -= H
        }

        for(let j=0; j<tiles_heights[i]/2 + 2; j++){
            Y -= H
        }
        rect(tiles_pos[i], Y, L, H, TILE_COLOR)
        Y = save_Y
        tiles_pos[i] -= SHIFT
    }
}

function draw_character(){
    collide = is_collision()

   
    !collide ? vi += vi * 0.001 - Math.pow(A, 2) : vi=0
    char_y -= vi
    rect(char_x, char_y, CHAR_L, CHAR_H, "red")
}

function stopstart(){
    tiles_pos = []
    tiles_heights = []

    // stop=false 
    // char_y = 400/2
    // char_x = 60;
    // vi = 0
    init()
    // document.getElementById("test").innerText = "-"

    if (anim) {
        window.cancelAnimationFrame(anim);
        anim = undefined;
     }

    anim = window.requestAnimationFrame(game_loop)
}

function drawStroked(text, x, y, font=80) {
    ctx.font = `${font}px Sans-serif`;
    ctx.strokeStyle = 'black';
    ctx.textAlign="center"
    ctx.lineWidth = 8;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'red';
    ctx.fillText(text, x, y);
    ctx.lineWidth=1
}


function mstop(){
    stop = true
    drawStroked("you lost", 200, 200, 70)
    drawStroked("Happy mothers' day!", 200, 250, 30)
    drawStroked("You're the best mom in the world!", 200, 300, 20)
    window.cancelAnimationFrame(anim)
}

function drawElapsedTime() {
    // console.log(startTime)
    var elapsed = parseInt((new Date() - startTime) / 1000);
    drawStroked(`Score: ${elapsed}`, 50, 50, 20)
}


function game_loop() {
    if(stop){
        return;
    }
    // console.log("SOMEHOW STOP IS TRUE")
    anim = window.requestAnimationFrame(game_loop)
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    rect(0, 0, canvas.width, canvas.height, BACKGROUND_COLOR)
    draw_tiles_refined()
    draw_character()
    while(is_collision()){
        char_y -= 1
    }
    if(is_collision_x() || char_y < 0){
        // document.getElementById('test').innerText = "You lost, good game!"
        // console.log("LOST")
        mstop()
        // console.log(stop)
    }
    drawElapsedTime()

    
}

document.body.onkeydown = function(e){
    if(e.keyCode == 32){
        jump()
        // console.log(vi)
    }
}

canvas.addEventListener('click', function() { jump() }, false);

// var anim = window.requestAnimationFrame(game_loop)
