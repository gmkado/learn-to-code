var globe;
var lossySlider;
var gravitySlider;
function setup() {
  createCanvas(600, 600);
  globe = new Globe(width/3);
  let shakeButton = createButton("Shake").mousePressed(()=>globe.shake());
  let clearButton = createButton("Clear").mousePressed(()=>globe.clear());
  lossySlider = createSlider(0, 1, .8, 0);     
  gravitySlider = createSlider(0, 0.3, 0.1, 0);
  randomnessSlider = createSlider(0, 0.5, 0, 0);

  lossySlider.position(20, 20); 
  gravitySlider.position(20, 60);   
  randomnessSlider.position(20, 100);   

  shakeButton.position(20,140)
  clearButton.position(100,140)
}

function draw() {
  background(255);
  fill(0);
  text(`Collision efficiency ${lossySlider.value().toFixed(2)}`, 20, 10)  
  text(`Gravity ${gravitySlider.value().toFixed(2)}`, 20, 50)  
  text(`Randomness ${randomnessSlider.value().toFixed(2)}`, 20, 90)  

  translate(width/2, height/2) 
  globe.update();
  globe.draw();
}

function mousePressed() {
    globe.addParticle(createVector(mouseX-width/2, mouseY-width/2));
}
