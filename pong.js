const canvavs = document.getElementById("pong");
const canvatx = canvavs.getContext("2d");


function dibujarfondo(x,y,w,h,color){
    canvatx.fillStyle = color;
    canvatx.fillRect(x,y,w,h);
}

dibujarfondo(0, 0, canvavs.width, canvavs.height, "BLACK"); 


function dibujarcirculo(x,y,r,color) {
    canvatx.fillStyle = color;
    canvatx.beginPath();
    canvatx.arc(x,y,r,0,Math.PI*2,false);
    canvatx.closePath();
    canvatx.fill();
}

dibujarcirculo(100,100,50, "RED")
