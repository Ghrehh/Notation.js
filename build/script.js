$(document).ready(function(){
  /*var n = new Notation(".container");
  
  var i =  n.addInstrument("Guitar 1", "bass");
  var i3 =  n.addInstrument("Guitar 2");
  var i2 =  n.addInstrument("Poland");
  var i4 =  n.addInstrument("Camel");
  
  
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
  
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  i4.bar(1).addNote("B3", "sixteenth-note")
  
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  i4.bar(1).addNote("B3", "thirty-second-note")
  

  
  let bar = i.addBar();
  let note = bar.addNote("C5");
  
  bar.addNote("E5", "half-note", bar.note(1));
  
  
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
  n2.addInstrument("shi2t");
  
  $(window).resize(function(){
    n2.rtwo();
    n2.setBarsContainerCSS();
    
    n.rtwo();
    n.setBarsContainerCSS();
  })
  
  n2.rtwo();
  n2.setBarsContainerCSS();
  
  
  setTimeout(function(){
      n.rtwo();
  n.setBarsContainerCSS();
    
  }, 1000);

  
  n2.addBar()
  
  n.setTitle("Test Title")
  n.setTempo("120 BPM")*/
  
  var n = new Notation(".container");
  
  var i =  n.addInstrument("Guitar 1", "bass");
  var i3 =  n.addInstrument("Guitar 2");
  var i2 =  n.addInstrument("Poland");
  var i4 =  n.addInstrument("Camel");
  
  n.setTitle("Test Title")
  n.setTempo("120 BPM")
  
  n.addBar();
  n.addBar();
  n.addBar();
  n.addBar();
  var note1 = i.bar(1).addNote("F4", "eighth-note");
  i.bar(1).addNote("F4", "eighth-note")
  i.bar(1).addNote("G4", "eighth-note")
  i.bar(1).addNote("G4", "eighth-note")
  i.bar(1).addNote("G4", "eighth-note")
  i.bar(1).addNote("G4", "eighth-note")
  var note2 = i.bar(1).addNote("F4", "eighth-note");
  
  //note1.beam.beamTo(note2);
  
  var note1 = i.bar(1).addNote("C5", "eighth-note");
  i.bar(1).addNote("G5", "eighth-note")
  i.bar(1).addNote("G5", "eighth-note")
  i.bar(1).addNote("G5", "eighth-note")

  var note2 = i.bar(1).addNote("F5", "eighth-note");
  
  //note1.beam.beamTo(note2);
  
 
  



})

