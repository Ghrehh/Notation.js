QUnit.test("Instrument array length should equal 0", function( assert ) {
  var n = new Notation(".container");
  
  assert.ok( n.instruments.length === 0, "Passed!" );
});


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










