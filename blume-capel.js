// setup
var gpx_size = 0;
var frame_size = 512;
var image;
var imagedata;

function toFixed(value, precision, negspace) {
    negspace = typeof negspace !== 'undefined' ? negspace : '';
    var precision = precision || 0;
    var sneg = (value < 0) ? "-" : negspace;
    var neg = value < 0;
    var power = Math.pow(10, precision);
    var value = Math.round(value * power);
    var integral = String(Math.abs((neg ? Math.ceil : Math.floor)(value/power)));
    var fraction = String((neg ? -value : value) % power);
    var padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
    return sneg + (precision ? integral + '.' +  padding + fraction : integral);
}

//metropolis algorithm for blume-capel
var spins = null;
var lattice_size = 512;
var temp = .610; //temperature
var h = 1.9655; //fugacity
var boundary = "free"; //kind of boundary

function init_board(N, bc){
    spins = [];
    lattice_size = N;
        for (var i=0; i<lattice_size*lattice_size+1; i++){
            spins[i] = Math.floor(Math.random()*3.) - 1;
    }
    //The boundary of the board is given by the pixels spins[i] with indices i=x+y*lattice_size, with x,y being either 0 or lattice_size-1.
    if(bc == "homogeneous"){
      for (var i=0; i<lattice_size; i++){
        upmargin = i;
        leftmargin = i*lattice_size;
        downmargin = i + lattice_size*(lattice_size-1);
        rightmargin = lattice_size-1+i*lattice_size;
        spins[upmargin] = 1;
        spins[leftmargin] = 1;
        spins[downmargin] = 1;
        spins[rightmargin] = 1;
    }
  }
    if(bc == "dobrushinplusfree"){
    for (var i=0; i<lattice_size; i++){
      upmargin = i;
      leftmargin = i*lattice_size;
      // downmargin = i + lattice_size*(lattice_size-1);
      // rightmargin = lattice_size-1+i*lattice_size;
      spins[upmargin] = 1;
      spins[leftmargin] = 1;
      // spins[downmargin] = 1;
      // spins[rightmargin] = 1;
  }
}
    if(bc == "dobrushinplusminus"){
  for (var i=0; i<lattice_size; i++){
    upmargin = i;
    leftmargin = i*lattice_size;
    downmargin = i + lattice_size*(lattice_size-1);
    rightmargin = lattice_size-1+i*lattice_size;
    spins[upmargin] = 1;
    spins[leftmargin] = 1;
    spins[downmargin] = -1;
    spins[rightmargin] = -1;
}
}
    gpx_size = frame_size/lattice_size;
    display_board(lattice_size, spins);
    draw_all();
}

function update(){
  //Here I control the boundary conditions: in case of free boundary conditions, I do not care if I flip spins on the boundary. In case homogeneous and dobrushinplusminus I want to avoid changing any point on the boundary. In case of free/plus boundary conditions I want not to change (the plus side) the left and up boundaries of the grid.
  if(boundary == "free"){
    var x = Math.floor(Math.random()*lattice_size);
    var y = Math.floor(Math.random()*lattice_size);
  }
  if(boundary == "homogeneous" || boundary == "dobrushinplusminus"){
    var x = Math.floor(Math.random()*(lattice_size-2)+1);
    var y = Math.floor(Math.random()*(lattice_size-2)+1);
  }
  if(boundary == "dobrushinplusfree"){
    var x = Math.floor(Math.random()*(lattice_size-1)+1);
    var y = Math.floor(Math.random()*(lattice_size-1)+1);
}
//Now I proceed with metropolis algorithm.
  var ind = x + y*lattice_size;
  var s = Math.floor(Math.random()*3.) - 1;
  var de = (spins[ind]-s)*(spins[x + ((y+1).mod(lattice_size))*lattice_size] +  spins[x + ((y-1).mod(lattice_size))*lattice_size] + spins[(x+1).mod(lattice_size) + y*lattice_size] + spins[(x-1).mod(lattice_size) + y*lattice_size])-h*(spins[x+y*lattice_size]*spins[x+y*lattice_size]-s*s);
  if (de <= 0 || Math.random() < Math.exp(-de /temp)){
      spins[ind] = s;
      if (!onefill)
          put_pixel(x, y, gpx_size, spins[lattice_size*lattice_size] * spins[x+y*lattice_size]);
  }
}

// display variables
var c, c2;
var ctx;
var ctxgraph;
var empty;
var lag = 1;
var onefill = 0;
var drawnow = true;
var voidcolor= [40,44,51,255]; //light black
var pluscolor= [122,192,192,255]; //light aquamarine
//var pluscolor= [93,160,214,255]; //light blue
//var minuscolor= [183,95,104,255]; //light red
var minuscolor= [255,255,255,255]; //white

function display_board(N, board){
    for (var i=0; i<N; i++){
        for (var j=0; j<N; j++){
            put_pixel(i, j, gpx_size, board[N*N] * board[i+j*N]);
        }
    }
}

function put_pixel(x, y, size, color){
    var xoff = x*size;
    var yoff = y*size;
    for (var i=0; i<size; i++){
        for (var j=0; j<size; j++){
            var ind = ((yoff+j)*lattice_size*size + xoff+ i)*4;
            if (color==0){//rgba model
              imagedata[ind+0] = voidcolor[0];
              imagedata[ind+1] = voidcolor[1];
              imagedata[ind+2] = voidcolor[2];
              imagedata[ind+3] = voidcolor[3];
            }
            if (color==1){
              imagedata[ind+0] = pluscolor[0];
              imagedata[ind+1] = pluscolor[1];
              imagedata[ind+2] = pluscolor[2];
              imagedata[ind+3] = pluscolor[3];
            }
            if (color==-1){
              imagedata[ind+0] = minuscolor[0];
              imagedata[ind+1] = minuscolor[1];
              imagedata[ind+2] = minuscolor[2];
              imagedata[ind+3] = minuscolor[3];
            }
            // var c = (color+1)/2 * 255;
            // imagedata[ind+0] = c;
            // imagedata[ind+1] = c;
            // imagedata[ind+2] = c;
            // imagedata[ind+3] = 255;
        }
    }
}

function update_measurements_labels(){
    lblt = document.getElementById('label_time');
    lble = document.getElementById('label_energy');
    lblm = document.getElementById('label_mag');
}

function draw_all(){
    if (onefill)
        display_board(lattice_size, spins);
    image.data = imagedata;
    ctx.putImageData(image, 0, 0);
    update_measurements_labels();
  }

/*======================================================================
  the javascript interface stuff
======================================================================*/
function showCoords(event) {
  var x = event.offsetX;
  var y = event.offsetY;
  var coords = "X coords: " + x + ", Y coords: " + y;
  temp=93./(x-13.);
  h=(338.-y)/58.*temp;
  var values = "Temperature: \(T\)=" + toFixed(temp,4) + ", Fugacity: \(\Delta\)=" + toFixed(h/temp,4) ;
  //document.getElementById("demo").innerHTML = coords;
  document.getElementById("value-temp").innerHTML = toFixed(temp,4);
  document.getElementById("value-h").innerHTML = toFixed(h/temp,4);
}

function dotextbox(id){
    idt = id+"_input";
    document.getElementById(id).style.display = 'none';
    document.getElementById(idt).style.display = 'inline';
    document.getElementById(idt).value = document.getElementById(id).innerHTML;
    document.getElementById(idt).focus();
}

function undotextbox(id){
    idt = id.replace("_input", "");
    document.getElementById(idt).style.display = 'inline';
    document.getElementById(id).style.display = 'none';
}

function update_temp(){
    min = document.getElementById('temp').min;
    gTval = parseFloat(document.getElementById('temp').value);
    if (gTval <= min)
        temp = 0;
    else
        temp = Math.pow(10, gTval);
    document.getElementById('label_temp').innerHTML = toFixed(temp,4);
}
function update_field(){
    var val = parseFloat(document.getElementById('field').value);
    h = val*temp;
    document.getElementById('label_field').innerHTML = toFixed(h,4);
}
function update_frames(){
    frameval = parseFloat(document.getElementById('frames').value);
    lag = Math.pow(10, frameval);
    onefill = lag > 2*lattice_size*lattice_size ? 1 : 0;
    document.getElementById('label_frames').innerHTML = toFixed(lag,4);
}

function update_display(){
    document.getElementById('label_temp').innerHTML = toFixed(temp,4);
    document.getElementById('label_field').innerHTML = toFixed(h,4);
    document.getElementById('label_frames').innerHTML = toFixed(lag,4);
}

function update_pause(){
    if (drawnow == true){
        document.getElementById('pause').value = 'Start';
        drawnow = false;
    } else {
        document.getElementById('pause').value = 'Pause';
        requestAnimationFrame(tick, c);
        drawnow = true;
    }
}

function update_restart(){
    init_board(lattice_size,boundary);
}

function update_step(){
    if (drawnow)
        update_pause();
        for (var i=0; i<lattice_size*lattice_size; i++)
            update();
    draw_all();
}

/*===============================================================================
    initialization and drawing
===============================================================================*/
function clear(){
    ctx.fillStyle = 'rgba(200,200,200,0.2)';
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillRect(0,0,c.width,c.height);
}

function cleargraph(){
    ctxgraph.fillStyle = 'rgba(200,200,200,0.2)';
    ctxgraph.clearRect(0, 0, c2.width, c2.height);
    ctxgraph.fillRect(0,0,c2.width,c2.height);
}

var tick = function(T) {
    var skip = lag;
    skip = skip*lattice_size*lattice_size;
    if (drawnow == true) {
        for (var i=0; i<skip; i++){
            update();
        }
        draw_all();
        requestAnimationFrame(tick, c);
    }
};

function change_num(){
    lattice_size = parseInt(document.getElementById('changenum').value);
    init_board(lattice_size, boundary);
}

function change_boundary(){
    boundary = document.getElementById('changeboundary').value;
    init_board(lattice_size, boundary);
}

var init = function() {
    // create the canvas element
    empty = document.createElement('canvas');
    empty.height = empty.width = 1;
    c = document.getElementById('canvas');
    c.style.cursor = 'url('+empty.toDataURL()+')';
    ctx = c.getContext('2d');
    c2 = document.getElementById('canvas-graph');
    c2.style.cursor = 'url('+empty.toDataURL()+')';
    ctxgraph = c2.getContext('2d');
    image = ctx.getImageData(0, 0, frame_size, frame_size);
    imagedata = image.data;

    Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
    }

    document.getElementById('label_temp_input').addEventListener("keydown", function(e) {
        if (e.keyCode == 13){
            e.preventDefault();
            step = document.getElementById('temp').step;
            min = document.getElementById('temp').min;
            tval = parseFloat(document.getElementById('label_temp_input').value);

            if (tval <= Math.pow(10, min))
                logval = min - 2*step;
            else
                logval = log10Math.log(tval) / Math.LN10;

            document.getElementById('temp').value = logval;
            update_temp();
            undotextbox('label_temp_input');
        }
    }, false);

    document.getElementById('label_field_input').addEventListener("keydown", function(e) {
        if (e.keyCode == 13){
            e.preventDefault();
            document.getElementById('field').value = document.getElementById('label_field_input').value;
            update_field();
            undotextbox('label_field_input');
        }
    }, false);

    document.getElementById('label_frames_input').addEventListener("keydown", function(e) {
        if (e.keyCode == 13){
            e.preventDefault();
            tval = parseFloat(document.getElementById('label_frames_input').value);
            document.getElementById('frames').value = log10Math.log(tval) / Math.LN10;
            update_frames();
            undotextbox('label_frames_input');
        }
    }, false);

    clear();
    cleargraph();
    init_board(lattice_size, boundary);
    update_display();

    document.body.addEventListener('keyup', function(ev) {
        if (ev.keyCode == 32){ ev.preventDefault(); update_pause(); } //space is pause
    }, false);

    document.body.addEventListener('keydown', function(ev) {
    }, false);

    registerAnimationRequest();
    requestAnimationFrame(tick, c);
};
window.onload = init;

// Provides requestAnimationFrame in a cross browser way.
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
function registerAnimationRequest() {
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
      return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps)
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
              window.setTimeout( callback, 1 ); /*1000 / 60 );*/
      };
    } )();
}
}
