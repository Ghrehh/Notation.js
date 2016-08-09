$(document).ready(function(){
  var n = new Notation(".container");
  var i =  n.newInstrument("Guitar 1");
  var i2 = n.newInstrument("Guitar 2");
  
  n.addBar();
  n.addBar();

  var i3 = n.newInstrument("Guitar 3");
  
  n.addBar();
})

