$(document).ready(function(){
  var n = new Notation(".container");
  var i =  n.addInstrument("Guitar 1", "bass");
  var i3 =  n.addInstrument("Guitar 1");
  var i2 =  n.addInstrument("");
  var i2 =  n.addInstrument("Guitar 1");
  
  
  n.addBar();
  n.addBar();
  n.addBar();
  n.addBar();
  
  i.bar(1).addNote("E");
  i.bar(1).addNote("G");
  i.bar(1).addNote("C");
  i3.bar(3).addNote("F");
  
  i3.bar(3).addKeySignature("flats", 7);

  var n2 =  new Notation(".container2");
  
  n2.addInstrument("shit");

})

