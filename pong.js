const canvavs = document.getElementById("pong");
const canvatx = canvavs.getContext("2d");


function dibujarfondo(x,y,w,h,color){
    canvatx.fillStyle = color;
    canvatx.fillRect(x,y,w,h);
}

dibujarfondo(0, 0, canvavs.width, canvavs.height, "BLACK"); 