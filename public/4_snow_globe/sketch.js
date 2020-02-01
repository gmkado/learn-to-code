var globe;

function setup() {
  createCanvas(600, 600);
  globe = new Globe(width/2);
  let button = createButton("Shake");
  button.mousePressed(()=>globe.shake());
}

function draw() {    
    translate(width/2, height/2) 
    background(255);
  globe.update();
  globe.draw();
}

function mousePressed() {
    globe.addParticle(createVector(mouseX-width/2, mouseY-width/2));
}
