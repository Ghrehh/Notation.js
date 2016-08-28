$(document).ready(function(){
  var n = new Notation(".container");
  
  var i =  n.addInstrument("Guitar 1", "bass");
  var i3 =  n.addInstrument("Guitar 1");
  var i2 =  n.addInstrument("");
  var i4 =  n.addInstrument("Guitar 1");
  
  
  n.addBar();
  n.addBar();
  n.addBar();
  n.addBar();
  i.bar(1).addNote("B3", "whole-note");
  i.bar(1).addNote("C4", "half-note");
  i.bar(1).addNote("D4");
  i.bar(1).addNote("E4");
  i.bar(1).addNote("F4");
  i.bar(1).addNote("G4");
  i.bar(1).addNote("A4");
  i.bar(1).addNote("B4");
  
  i.bar(1).addNote("C5");
  i.bar(1).addNote("D5");
  i.bar(1).addNote("E5");
  i.bar(1).addNote("F5");
  i.bar(1).addNote("G5");
  i.bar(1).addNote("A5");
  i.bar(1).addNote("B5");
  i.bar(1).addNote("C6");
  
  i3.bar(1).addNote("B3");
  i3.bar(1).addNote("C4");
  i3.bar(1).addNote("D4");
  i3.bar(1).addNote("E4");
  i3.bar(1).addNote("F4");
  i3.bar(1).addNote("G4");
  i3.bar(1).addNote("A4");
  i3.bar(1).addNote("B4");
  
  i3.bar(1).addNote("C5");
  i3.bar(1).addNote("D5");
  i3.bar(1).addNote("E5");
  i3.bar(1).addNote("F5");
  i3.bar(1).addNote("G5");
  i3.bar(1).addNote("A5");
  i3.bar(1).addNote("B5");
  i3.bar(1).addNote("C6");
  
  i2.bar(1).addNote("B3", "whole-note")
  
  i2.bar(1).addNote("B3", "half-note")
  i2.bar(1).addNote("B3", "half-note")
  
  i2.bar(1).addNote("B3", "quarter-note")
  i2.bar(1).addNote("B3", "quarter-note")
  i2.bar(1).addNote("B3", "quarter-note")
  i2.bar(1).addNote("B3", "quarter-note")
  
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  i2.bar(1).addNote("B3", "eighth-note")
  
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  i2.bar(1).addNote("B3", "sixteenth-note")
  
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")
  i2.bar(1).addNote("B3", "thirty-second-note")


  
  let bar = i.addBar();
  let note = bar.addNote("C5");
  
  bar.addNote("E5", bar.note(1));
  
  
  i3.bar(3).addNote("F4");
  
  i.bar(3).changeTimeSignature(7, 8)
  i3.bar(3).changeTimeSignature(7, 8)
  
  i3.bar(3).changeKeySignature("flats", 7);
  i3.bar(3).changeKeySignature("sharps", 3);
  
  
  
  i4.bar(3).changeKeySignature("flats", 7);
  i4.bar(3).changeTimeSignature(7, 8)
  i4.bar(3).changeTimeSignature(9, 8)
  

  var n2 =  new Notation(".container2");
  
  n2.addInstrument("shit");

})

