QUnit.test("Instrument array length should equal 0", function( assert ) {
  var n = new Notation(".container");
  
  assert.ok( n.instruments.length === 0, "Passed!" );
});


QUnit.test("Instrument array length should equal 1", function( assert ) {
  var n = new Notation(".container");
  n.newInstrument("Guitar 1");
  
  assert.ok( n.instruments.length === 1, "Passed!" );
});

QUnit.test("Instrument array length should equal 6", function( assert ) {
  var n = new Notation(".container");
  n.newInstrument("Guitar 1");
  n.newInstrument("Guitar 2")
  n.newInstrument("Guitar 3")
  n.newInstrument("Guitar 4")
  n.newInstrument("Guitar 5")
  n.newInstrument("Guitar 6")
  
  assert.ok( n.instruments.length === 6, "Passed!" );
});

QUnit.test("Instrument id should be correct", function( assert ) {
  var n = new Notation(".container");
  n.newInstrument("Guitar 1");
  n.newInstrument("Guitar 2");
  n.newInstrument("Guitar 3");
  n.newInstrument("Guitar 5");
  n.newInstrument("Guitar 6");

  
  assert.ok( n.instruments[0].id === 0, "Passed!" );
  assert.ok( n.instruments[1].id === 1, "Passed!" );
  assert.ok( n.instruments[4].id === 4, "Passed!" );

});

QUnit.test("Newly added instrument id should be one higher than the last, to avoid situations where two instruments both have the same id after an instrument was deleted", function( assert ) {
  var n = new Notation(".container");
  var one = n.newInstrument("Guitar 1");
  var two = n.newInstrument("Guitar 2");
  var three = n.newInstrument("Guitar 3");

  assert.ok( one.id === 0, "Passed!" );
  assert.ok( two.id === 1, "Passed!" );
  assert.ok( three.id === 2, "Passed!" );
  
  n.removeInstrument(two);
  var four = n.newInstrument("Guitar 4");
  
  assert.ok( one.id === 0, "Passed!" );
  assert.ok( three.id === 2, "Passed!" );
  assert.ok( four.id === 3, "Passed!" );
  
  n.removeInstrument(four); //removed latest instrument, so the new instrument should have the same id (3)
  var newFour = n.newInstrument("Guitar 4");
  
  assert.ok( newFour.id === 3, "Passed!" );
  assert.ok( $(".instrument-name-container").children().length === 3, "Passed!" ); //three should be present now

});

QUnit.test("Deleting instruments should work via name, id or object ", function( assert ) {
  var n = new Notation(".container");
  var one = n.newInstrument("Guitar 1");
  var two = n.newInstrument("Guitar 2");
  var three = n.newInstrument("Guitar 3");

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


  


