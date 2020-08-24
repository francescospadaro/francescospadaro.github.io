var num;
var range;
var delta;

var x=[];
var yp=[];
var ym=[];
var p=[];
var dx;
var dz;
var dw;
var s;
var t;
var count;
var record;

function setup() {
  num=2000;
  range=2;
  delta=1;
  createCanvas(1000, 500);
  frameRate(20);
  count=0;
  s=1;
  t=1;
  record=false;
  //x=new float[1];
  //yp=new float[1];
  //ym=new float[1];
  //p=new float[1];
  //x[0]=width/2;
  //z[0]=width/2;
  //yp[0]=height/2;
  //ym[0]=height/2;
  //p[0]=height/2;
  x[0]=0;
  yp[0]=0;
  ym[0]=0;
  p[0]=0;
}

function draw()
{
  background(51);
  count = count+1;
  dx=x[x.length-1]+delta;
  //dz=x[x.length-1]-delta;
  x=append(x, dx);
  dw=range*sqrt(x[x.length-2]);
  p=append(p, dw);
  var dyp=yp[yp.length-1]+random(-range, range);
  yp=append(yp, dyp);
  var dym=ym[ym.length-1]+random(-range, range);
  ym=append(ym, dym);
  stroke(256, 0, 0);
  //line(x[x.length-2], y[y.length-2], x[x.length-1], y[y.length-1]);
  //// Draw a line connecting the points
  if (record) {
    s=width/x[x.length-1];
    t=height/sqrt(x[x.length-1])/4;
    translate(0, height/2);
    scale(s, t);
    translate(0, -height/2);
  }
  for (var i=1; i<x.length-1; i++) {
    stroke(256, 0, 0);
    line(x[i-1], yp[i-1]+height/2, x[i], yp[i]+height/2);
    //line(-x[i-1]+width/2, ym[i-1]+height/2, -x[i]+width/2, ym[i]+height/2);
    stroke(256, 256, 0);
    line(x[i-1], p[i-1]+height/2, x[i], p[i]+height/2);
    line(x[i-1], -p[i-1]+height/2, x[i], -p[i]+height/2);
    //line(-x[i-1]+width/2, p[i-1]+height/2, -x[i]+width/2, p[i]+height/2);
    //line(-x[i-1]+width/2, -p[i-1]+height/2, -x[i]+width/2, -p[i]+height/2);
  }
  if (count>0) {
    record=true;
  }
}