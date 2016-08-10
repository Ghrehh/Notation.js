$(document).ready(function(){
  var n = new Notation(".container");
  var i =  n.addInstrument("Guitar 1");
  var i3 =  n.addInstrument("Guitar 1");
  var i2 =  n.addInstrument("");
  var i2 =  n.addInstrument("Guitar 1");
  
  
  n.addBar();
  n.addBar();
  n.addBar();
  n.addBar();
  
  i.bar(1).addNote();
  i.bar(1).addNote();
  i.bar(1).addNote();
  i3.bar(3).addNote();

  var n2 =  new Notation(".container2");
  
  n2.addInstrument("shit");

})

