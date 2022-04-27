const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

// Cargar los sonidos 
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sonidos/hit.mp3";
wall.src = "sonidos/wall.mp3";
comScore.src = "sonidos/comScore.mp3";
userScore.src = "sonidos/userScore.mp3";
// PELOTA OBJETO
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// USUARIO BARRA
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// COMPUTADORA BARRA
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

// RED
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// dibuja un rectángulo, se usará para dibujar las barras
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// dibujar círculo, se usará para dibujar la pelota
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// movimiento mediante el raton 
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// Cuando COM o USER anotan, reiniciamos la pelota.
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// mostrar red 
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// mostrar texto
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// detección de colisiones

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}


function update(){
    
// cambia la puntuación de los jugadores, si la pelota va a la izquierda, "pelota.x<0" gana la computadora, de lo contrario, si "pelota.x > canvas.width" gana el usuario
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    

    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // cuando la pelota choca con las paredes de la barra inferior y superior, invertimos la velocidad y.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    
   // comprobamos si la paleta golpeó al usuario o la paleta computadora 

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    if(collision(ball,player)){
        // play sound
        hit.play();
        //  comprobamos donde la pelota golpea la barra
        let collidePoint = (ball.y - (player.y + player.height/2));

        // normaliza el valor de CollidePoint, necesitamos obtener números entre -1 y 1.
        // -jugador.altura/2 <Punto de colisión <jugador.altura/
        collidePoint = collidePoint / (player.height/2);
        
        // cuando la pelota golpea la parte superior de una paleta, queremos que la pelota tome un ángulo de -45 grados
        // cuando la pelota golpea el centro de la paleta queremos que la pelota tome un ángulo de 0 grados
        // cuando la pelota toca el fondo de la paleta queremos que la pelota tome un giro de 45 grados
        // Math.PI/4 = 45grados
        let angleRad = (Math.PI/4) * collidePoint;
        
        //cambiar la dirección de pelota  X e Y
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // // acelera la pelota cada vez que una barra la golpea.
        ball.speed += 0.1;
    }
}


function render(){
    
    // LIMPIAR TODO
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // dinujar puntaje del jugador 
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    // dibujar puntaje de la computadora
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // dibujar red 
    drawNet();
    
    // dibujar barra del jugador 
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // dibujar barra de la computadora 
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // dibujar pelota 
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}
// FPS DEL JUEGO
let framePerSecond = 50;

//llamar a la función del juego 50 veces cada 1 segundo

let loop = setInterval(game,1000/framePerSecond);


