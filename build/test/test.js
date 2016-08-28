QUnit.module( "Instrument", function(){

  QUnit.test("Instrument array length should equal 1", function( assert ) {
    var n = new Notation(".container");
    n.addInstrument("Guitar 1");
    
    assert.ok( n.instruments.length === 1, "Passed!" );
  });
  
  QUnit.test("Instrument array length should equal 6", function( assert ) {
    var n = new Notation(".container");
    n.addInstrument("Guitar 1");
    n.addInstrument("Guitar 2")
    n.addInstrument("Guitar 3")
    n.addInstrument("Guitar 4")
    n.addInstrument("Guitar 5")
    n.addInstrument("Guitar 6")
    
    assert.ok( n.instruments.length === 6, "Passed!" );
  });
  
  QUnit.test("Instrument id should be correct", function( assert ) {
    var n = new Notation(".container");
    n.addInstrument("Guitar 1");
    n.addInstrument("Guitar 2");
    n.addInstrument("Guitar 3");
    n.addInstrument("Guitar 5");
    n.addInstrument("Guitar 6");
  
    
    assert.ok( n.instruments[0].id === 0, "Passed!" );
    assert.ok( n.instruments[1].id === 1, "Passed!" );
    assert.ok( n.instruments[4].id === 4, "Passed!" );
  
  });
  
  QUnit.test("Newly added instrument id should be one higher than the last, to avoid situations where two instruments both have the same id after an instrument was deleted", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
    var two = n.addInstrument("Guitar 2");
    var three = n.addInstrument("Guitar 3");
  
    assert.ok( one.id === 0, "Passed!" );
    assert.ok( two.id === 1, "Passed!" );
    assert.ok( three.id === 2, "Passed!" );
    
    n.removeInstrument(two);
    var four = n.addInstrument("Guitar 4");
    
    assert.ok( one.id === 0, "Passed!" );
    assert.ok( three.id === 2, "Passed!" );
    assert.ok( four.id === 3, "Passed!" );
    
    n.removeInstrument(four); //removed latest instrument, so the new instrument should have the same id (3)
    var newFour = n.addInstrument("Guitar 4");
    
    assert.ok( newFour.id === 3, "Passed!" );
    assert.ok( $(".instrument-name-container").children().length === 3, "Passed!" ); //three should be present now
  
  });
  
  
  ///DELETING INSTRUMENTS
  QUnit.test("Deleting instruments should work via name, id or object ", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
    var two = n.addInstrument("Guitar 2");
    var three = n.addInstrument("Guitar 3");
  
    assert.ok( $(".instrument-name-container").children().length === 3, "Passed!" ); //all three should be present
    assert.ok( n.instruments.length === 3, "Passed!" );
    
    
    n.removeInstrument("Guitar 1"); //remove via name
    
    assert.ok( $(".instrument-name-container").children().length === 2, "Passed!" ); //all three should be present
    assert.ok( n.instruments.length === 2, "Passed!" );
    
    
    n.removeInstrument(1); //remove via id
    
    assert.ok( $(".instrument-name-container").children().length === 1, "Passed!" ); //all three should be present
    assert.ok( n.instruments.length === 1, "Passed!" );
  
  
    n.removeInstrument(three); //remove via object
    
    assert.ok( $(".instrument-name-container").children().length === 0, "Passed!" ); //all three should be present
    assert.ok( n.instruments.length === 0, "Passed!" );
  
  });
  
  
  QUnit.test("Deleting instruments should remove all the bars", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
    var two = n.addInstrument("Guitar 2");
    var three = n.addInstrument("Guitar 3");
    
    assert.ok( $(".bar-container").children().length === 3, "Passed!" ); 
    assert.ok( $(".instrument-name-container").children().length === 3, "Passed!" ); 
    assert.ok( n.instruments.length === 3, "Passed!" );
    
    n.removeInstrument(three);
  
    
    assert.ok( $(".bar-container").children().length === 2, "Passed!" ); 
    assert.ok( $(".instrument-name-container").children().length === 2, "Passed!" ); 
    assert.ok( n.instruments.length === 2, "Passed!" );
  
  });
});

QUnit.module( "Bar", function(){
  //BARS

  QUnit.test("A Notation class with no instruments should have no bars", function( assert ) {
    
    var n = new Notation(".container");
    assert.ok( $(".bar").length === 0, "Passed!" ); 
  
  });
  
  QUnit.test("A Notation class with no instruments because they were deleted should have no bars or bar containers", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
    var two = n.addInstrument("Guitar 2");
    var three = n.addInstrument("Guitar 3");
    
    n.removeInstrument(one);
    n.removeInstrument(two);
    n.removeInstrument(three);
    
    assert.ok( $(".bar-container").length === 0, "Passed!" ); 
    assert.ok( $(".bar").length === 0, "Passed!" ); 
  
  });
  
  QUnit.test("Instruments should be created with one bar", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
    
    assert.ok( $(".bar-container").length === 1, "Passed!" ); 
  
  
  });
  
  QUnit.test("Newly added instruments should have the same number of bars as the rest of the instruments", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
    n.addBar();
    n.addBar();
    n.addBar();
    
    assert.ok( $(".bar").length === 4, "Passed!" ); //the initial one plus 3
    
    var two = n.addInstrument("Guitar 2");
    
    assert.ok( $(".bar").length === 8, "Passed!" ); 
    
    
  
  
  });
  
  QUnit.test("Each bar should have five lines", function( assert ) {
    var n = new Notation(".container");
    var one = n.addInstrument("Guitar 1");
  
    
    assert.ok( $(".bar > .line-container").length === 5, "Passed!" ); 
    
    
  
  
  });
  
  QUnit.test("instrument.bar(barNumber) should return the right bar", function( assert ) {
    var n = new Notation(".container");
    var instrumentOne = n.addInstrument("Instrument 1");
    
    var defaultBar = instrumentOne.bar(1);
  
    
    assert.ok( defaultBar.id === 0, "Passed!" ); 
    
    n.addBar();
    
    var bar2 = instrumentOne.bar(2);
    
    assert.ok( bar2.id === 1, "Passed!" ); 
    
    
    
  
  
  });
});

QUnit.module( "KeySignature", function(){
  
  QUnit.test("A bar should have no key-signature-container if it's key is C", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Tromboner") //doot doot

    assert.ok( $(".bar").children(".key-signature-container").length === 0, "Passed!" ); //instruments start with C as their key, hence no sharps/flats and no container for them
    
  });
  
  QUnit.test("A bar should have a key-signature-container if it's key is anything other than C", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Tromboner") //doot doot
    i.bar(1).changeKeySignature("sharps", 7);

    assert.ok( $(".bar").children(".key-signature-container").length === 1, "Passed!" ); 
    
  });
  
  QUnit.test("A bar should have the right number of sharps/flats", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Trumpolin") // >-ooo-
    
    i.bar(1).changeKeySignature("sharps", 7);
    
    assert.ok( $(".bar").children(".key-signature-container").length === 1, "Passed!" ); 
    assert.ok( $(".bar").children(".key-signature-container").children().length === 7, "Passed!" ); 
    
    i.bar(1).changeKeySignature("flats", 5);
    assert.ok( $(".bar").children(".key-signature-container").children().length === 5, "Passed!" ); 
    
  });
  
  QUnit.test("Changing the key back to C (0 sharps or flats) should remove the key-signature-container", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Trumpolin") // >-ooo-
    
    i.bar(1).changeKeySignature("sharps", 7);
    
    assert.ok( $(".bar").children(".key-signature-container").length === 1, "Passed!" ); 
    
    
    i.bar(1).changeKeySignature("sharps", 0);
    
    assert.ok( $(".bar").children(".key-signature-container").length === 0, "Passed!" ); 
   
    
  });
  
  
  
});

QUnit.module( "TimeSignature", function(){
  
  QUnit.test("A bar should have a time-signature-container upon creation", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoo") //"I'm first Flumperdoo in the orchestra. I play the flumperdoo, I'm a flumperdooer."

    assert.ok( $(".bar").children(".time-signature-container").length === 1, "Passed!" ); 
    
  });
  
  QUnit.test("A bar should have 4/4 as it's default time signature upon creation", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoodoo") 

    assert.ok( i.bar(1).timeSignature.top === 4, "Passed!" ); //the object should have the right value
    assert.ok( i.bar(1).timeSignature.bottom === 4, "Passed!" ); 
    
    //fuck if i know why the [i] method works and no the .eq. MAybe cause it's a double .children() call?
    assert.ok( $(".bar").children(".time-signature-container").children()[0].innerHTML === "4", "Passed!" ); //and the DOM 
    assert.ok( $(".bar").children(".time-signature-container").children()[1].innerHTML === "4", "Passed!" ); 

    
  });
  
  QUnit.test("A bar should be able to have its time signature changed", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoodoo") 
    
    i.bar(1).changeTimeSignature(5,8)

    assert.ok( i.bar(1).timeSignature.top === 5, "Passed!" ); //the object should have the right value
    assert.ok( i.bar(1).timeSignature.bottom === 8, "Passed!" ); 
    
    //fuck if i know why the [i] method works and no the .eq. MAybe cause it's a double .children() call?
    assert.ok( $(".bar").children(".time-signature-container").children()[0].innerHTML === "5", "Passed!" ); //and the DOM 
    assert.ok( $(".bar").children(".time-signature-container").children()[1].innerHTML === "8", "Passed!" ); 

    
  });
  
   QUnit.test("An added bar should have no time-signature-container by default", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoo") //"I'm first Flumperdoo in the orchestra. I play the flumperdoo, I'm a flumperdooer."
    
    n.addBar();
    

    assert.ok( i.bar(2).timeSignature === undefined, "Passed!" ); //no time signature in the object
    assert.ok( $(".bar").eq(1).children(".time-signature-container").length === 0, "Passed!" ); //and no container in the DOM
    
    assert.ok( $(".bar").eq(0).children(".time-signature-container").length === 1, "Passed!" ); //first bar should still have a time-signature-container doe
    
  });
  
  QUnit.test("A newly added bar should be able to have a new time signature added", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoodoo") 

    n.addBar();
    
    i.bar(2).changeTimeSignature(7,8);
    
    assert.ok( i.bar(2).timeSignature.top === 7, "Passed!" ); //the object should have the right value
    assert.ok( i.bar(2).timeSignature.bottom === 8, "Passed!" ); 
    
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[0].innerHTML === "7", "Passed!" ); //and the DOM 
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[1].innerHTML === "8", "Passed!" ); 

    assert.ok( $(".bar").eq(1).children(".time-signature-container").length === 1, "Passed!" ); //second bar should now have a container

    
  });
  
  QUnit.test("A newly added bar should be able to have a new time signature added and then changed", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoodoo") 

    n.addBar();
    
    i.bar(2).changeTimeSignature(7,8);
    
    assert.ok( i.bar(2).timeSignature.top === 7, "Passed!" ); //the object should have the right value
    assert.ok( i.bar(2).timeSignature.bottom === 8, "Passed!" ); 
    
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[0].innerHTML === "7", "Passed!" ); //and the DOM 
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[1].innerHTML === "8", "Passed!" ); 

    assert.ok( $(".bar").eq(1).children(".time-signature-container").length === 1, "Passed!" ); //second bar should now have a container
    
    i.bar(2).changeTimeSignature(15,16);
    
    assert.ok( i.bar(2).timeSignature.top === 15, "Passed!" ); //the object should have the right value
    assert.ok( i.bar(2).timeSignature.bottom === 16, "Passed!" ); 
    
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[0].innerHTML === "15", "Passed!" ); //and the DOM 
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[1].innerHTML === "16", "Passed!" ); 

    assert.ok( $(".bar").eq(1).children(".time-signature-container").length === 1, "Passed!" ); //second bar should now have a container

    
  });
  
  QUnit.test("A newly added bar should be able to have a new time signature added and then removed", function( assert ) {
  
    var n = new Notation(".container");
    var i = n.addInstrument("Flumperdoodoo") 

    n.addBar();
    
    i.bar(2).changeTimeSignature(7,8);
    
    assert.ok( i.bar(2).timeSignature.top === 7, "Passed!" ); //the object should have the right value
    assert.ok( i.bar(2).timeSignature.bottom === 8, "Passed!" ); 
    
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[0].innerHTML === "7", "Passed!" ); //and the DOM 
    assert.ok( $(".bar").eq(1).children(".time-signature-container").children()[1].innerHTML === "8", "Passed!" ); 

    assert.ok( $(".bar").eq(1).children(".time-signature-container").length === 1, "Passed!" ); //second bar should have a container
    
    i.bar(2).removeTimeSignature();
    
    assert.ok( $(".bar").eq(1).children(".time-signature-container").length === 0, "Passed!" ); //second bar should no longer have a container

    
  });
  



});







