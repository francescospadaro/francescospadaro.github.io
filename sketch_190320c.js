//noprotect
var w;
var h;
var beta;
var q;
var spins = [];
var sampleIsPlaying;

function setup() {
  w=500;
  sampleIsPlaying=true;
  h=w;
    for(var i=0; i<w; i++) {
    spins[i] = [];
}
  beta=log(1+sqrt(2))/2;
  q=500/w;
      createCanvas(500, 500);
  for (var x =0; x < w; x++) for (var y =0; y < h; y++) { 
    if (random(1.0) < 0.5) spins[x][y]=1; 
    else spins[x][y]=-1;
  }
}

function draw() {
  background(3);
  noStroke();
//  if (mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 400)   {sampleIsPlaying = !sampleIsPlaying; }
  for (var x = 0; x < w; x++) for (var y = 0; y < h; y++) {
    if (spins[x][y] == 1) fill(0);
    if (spins[x][y] == -1) fill(255);
    rect(x * q, y * q, q, q);
  }
  if(sampleIsPlaying){
  dyn();
  }
  fill(255); 
 // text("beta=" + beta, 410, 30);
}

function keyPressed() {
  if (keyCode == UP_ARROW) beta = beta*1.1;
  if (keyCode == DOWN_ARROW) beta = beta/1.1;
}

function dyn() {
  for (var i = 0; i < 20000; i++) mc_move();
}

function mc_move() {
  var x = floor(random()*(w-1)); 
  var y = floor(random()*(h-1)); // just take random integer coords to pick a random loc
  var delta = diff_energy(x+1, y+1); 
  var p = exp(-beta * delta);
  if (delta <= 0) spins[x+1][y+1] *= -1; 
  if (delta > 0) if (random(1.0) < p) spins[x+1][y+1] *= -1;
}

function spin(x, y) {
  if (x >= 0 && y >= 0 && x < w && y < h) return spins[x][y];
  else return 0;
}  

// what would be the energy of H[sigma_tilde] - H[sigma] if sigma_tilde is sigma flipped at (x,y)
function diff_energy(x, y) {
  var s = spin(x, y); 
  var energy = - s * (spin(x - 1, y) + spin(x + 1, y) + spin(x, y - 1) + spin(x, y + 1)); // current energy
  var flipped_energy = -energy;
  return flipped_energy -energy;
}

function mousePressed() {
  sampleIsPlaying = !sampleIsPlaying;
}