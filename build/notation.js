(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _note = require("./note");

var _note2 = _interopRequireDefault(_note);

var Bar = (function () {
  function Bar(instrument, id) {
    _classCallCheck(this, Bar);

    this.instrument = instrument;
    this.notation = this.instrument.notation;
    this.id = id;
    this.notes = [];
    this.reference;

    this.containerClassName = "bar-container";
    this.className = "bar";

    this.barContainerHTML = '<div class="' + this.containerClassName + '" id="' + String(this.id) + '"></div>'; //container to be appended if it doesn't already exist
    this.barHTML = '<div class="' + this.className + '" id="' + String(this.instrument.id) + '">' + '</div>';

    this.heightOfLines = 1;
    this.widthOfBarLines = 1;
  }

  //need to make this a public method and run it from the instrument class creating it, pushBar is counting the number of bars in the bars array on the isntrument, so it need sto push before it starts

  Bar.prototype.initialize = function initialize() {
    this.checkIfBarContainerExists(); //checks if the bar container exists, before adding the bar
    this.printBar();
  };

  Bar.prototype.addNote = function addNote(n, addNoteToNote) {
    //{ pitch = "A", accidental = "sharp/flat/natural", octave = 3, duration = 4 }
    var note = new _note2["default"](this);
    note.pitch = "A";
    note.octave = 3;
    note.initialize();

    this.notes.push([note]);

    var note2 = new _note2["default"](this, note);
    note2.initialize();
  };

  Bar.prototype.printBar = function printBar() {
    var currentBarContainers = $(this.notation.container + " > ." + this.containerClassName); //all bars
    var targetBarContainer = currentBarContainers.eq(this.id); //bar you will be appending to

    targetBarContainer.append(this.barHTML); //append the bar to the bar container

    //now loop through the bar container to get your new bar you just added by the instrument id
    var newBar = undefined; //where the bar will be stored

    for (var i = 0; i < targetBarContainer.children().length; i++) {
      var targetBar = targetBarContainer.children()[i];

      if (targetBar.id == this.instrument.id) {
        newBar = targetBar;
      }
    }

    this.reference = newBar; //jquery object for the bar, pass it to a this variable so i can use it later in the note

    $(newBar).css(this.getBarCSS()); //sets the bars css
    this.createLines(newBar); //adds lines to it
  };

  //chcecks if a bar container already exists, so multiples do not get added

  Bar.prototype.checkIfBarContainerExists = function checkIfBarContainerExists() {
    var barFound = false;
    var currentBars = $(this.notation.container + " > ." + this.containerClassName);

    for (var i = 0; i < currentBars.length; i++) {
      if (currentBars[i].id == this.id) {
        barFound = true;
      }
    }

    //if the barcontainer cannot be found, add it to the DOM
    if (barFound === false) {
      this.addBarContainer();
    }
  };

  Bar.prototype.addBarContainer = function addBarContainer() {
    //this uses the id of the current bar, so should append the bar container correctly
    $(this.notation.container).append(this.barContainerHTML);
    $("." + this.containerClassName).css(this.getBarContainerCSS()); //probably quicker just to set all the bars css than to loop through them all and find the right one?
  };

  Bar.prototype.removeBarsFromContainer = function removeBarsFromContainer(target) {
    target.html("");
  };

  Bar.prototype.getBarCSS = function getBarCSS() {
    return { "height": this.notation.barHeight + "px", //the "height" the stave lines will be
      "margin": this.notation.marginAboveBar + "px -" + this.widthOfBarLines + "px " + this.notation.marginUnderBar + "px 0px", //notice the negative symbol, negative margin to overlap the end line and start line of two bars
      "padding": "0px", //also on line above, marginUnderBar which is set in the notation class, sets the bottom margin of instrument name and bars
      "border": "0px solid black",
      "border-width": "0px " + this.widthOfBarLines + "px", //the "width the bar linse will be"
      "vertical-align": "top"
    };
  };

  Bar.prototype.getBarContainerCSS = function getBarContainerCSS() {
    return { "display": "inline-block",
      "vertical-align": "top",
      "margin-bottom": String(this.notation.marginUnderBarContainer) + "px" //padding under bar container and instrument name container

    };
  };

  Bar.prototype.createLines = function createLines(bar) {
    var height = parseInt($(bar).height() - this.heightOfLines); //for some reason this needs to be called with a $ selector, maybe cause it was passed from another function
    //^ need to subtract the height of the line, otherwise bar height + line height puts the last line a line height out of the div
    var subDivisions = 4; //number of times to divide by, number of spaces basically

    for (var i = 0; i < subDivisions + 1; i++) {
      //number of sub divisions plus 1, as the first line's top value gets multipled by 0 and doesn't do anything

      var topOffset = height / subDivisions * i;

      var lineStyle = "height: " + this.heightOfLines + "; background-color: black; position: relative;  top: " + topOffset + ";";
      var lineHTML = '<div class="line" style="' + lineStyle + '"></div>';

      var lineContainerStyle = "height: 0; padding: 0px; margin: 0px";
      var lineContainerHTML = '<div class="line-container" style="' + lineContainerStyle + '">' + lineHTML + '</div';

      $(bar).append(lineContainerHTML);
    }
  };

  return Bar;
})();

exports["default"] = Bar;
module.exports = exports["default"];

},{"./note":4}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bar = require('./bar');

var _bar2 = _interopRequireDefault(_bar);

var Instrument = (function () {
  function Instrument(notation, name) {
    _classCallCheck(this, Instrument);

    this.notation = notation;
    this.name = this.initName(name);
    this.id = this.setId();
    this.bars = [];

    this.className = "instrument-name"; //name has to be written without the period as when concaterated in a html class it won't work with it
    this.instrumentNameHTML = '<div class="' + this.className + '" id="' + String(this.id) + '">' + this.name + '</div>';

    this.initialize();
  }

  Instrument.prototype.newBar = function newBar() {
    var bar = new _bar2['default'](this, this.currentNumberOfBars());
    this.bars.push(bar);
    bar.initialize();
  };

  Instrument.prototype.bar = function bar(barNumber) {
    if (typeof barNumber === "number") {

      if (barNumber < 1) {
        //catch numbers lower than 1
        throw "the parameter passed to instrument.bar() must be a number greater than 0 (index starts at 1)";
      }

      //minus one because its 0indexed, whereas I'm making a user enter in 1 for the first entry.
      return this.bars[barNumber - 1]; //not sure if this method will cause problems
    } else {
        throw "the parameter passed to instrument.bar() must be a number";
      }
  };

  //loops through each container, like name container and bar container, finds the instruments id and deletes all instances of it

  Instrument.prototype.removeFromPage = function removeFromPage() {
    var containerChildren = $(this.notation.container).children(); //gets all the bar and name containers

    for (var i = 0; i < containerChildren.length; i++) {
      //loops through the name and bar containers
      for (var i2 = 0; i2 < containerChildren[i].childNodes.length; i2++) {
        //containerchildren[i] or whatever simply returns the raw html, not an object for some reason.
        var element = containerChildren[i].childNodes[i2];

        if (this.id == element.id) {
          //double equals sign because the element.id is a string, saves a little bit of code
          console.log("match");
          element.remove();
        }
      }
    }
  };

  Instrument.prototype.initialize = function initialize() {
    this.createName();
  };

  Instrument.prototype.setId = function setId() {
    var nameContainerChildren = $(this.notation.container + " > .instrument-name-container").children();

    if (nameContainerChildren.length === 0) {
      //if the arrays empty, returns 0
      return 0;
    } else {
      //if it's not empty, returns one greater than the last elements id, this is to stop a case where two elements get the same id if one was deleted
      return parseInt(nameContainerChildren.last().attr("id")) + 1;
    }
  };

  Instrument.prototype.createName = function createName() {
    $(this.notation.container + " > .instrument-name-container").append(this.instrumentNameHTML);
    $(this.notation.container + " ." + this.className).css(this.getInstrumentNameCSS()); //applies dynamic css stuff to instrument-name class
  };

  //if a name wasn't passed through it will return a invisible character to maintain height, otherwise it will return the name

  Instrument.prototype.initName = function initName(name) {
    if (name === undefined) {
      return "&zwnj;"; //invisible character to maintain spacing
    } else {
        return name;
      }
  };

  //returns an id used in the addBar method, finds out how many bars already exist

  Instrument.prototype.currentNumberOfBars = function currentNumberOfBars() {
    return this.bars.length;
  };

  Instrument.prototype.getInstrumentNameCSS = function getInstrumentNameCSS() {
    return { "height": String(this.notation.barHeight) + "px",
      "margin": "0px 20px " + this.notation.marginUnderBar + "px 0px",
      "padding": "0"

    };
  };

  return Instrument;
})();

exports['default'] = Instrument;
module.exports = exports['default'];

},{"./bar":1}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _instrument = require('./instrument');

var _instrument2 = _interopRequireDefault(_instrument);

var Notation = (function () {
  function Notation(container) {
    _classCallCheck(this, Notation);

    this.instrumentNameContainerHTML = '<div class="instrument-name-container"></div>';

    this.barHeight = 42; //height of bars and instrument name divs
    this.marginAboveBar = 50;
    this.marginUnderBar = 60;
    this.marginUnderBarContainer = 20; //the amount of padidng under the CONTAINERS (instrument name container, bar-container)

    if (container == undefined) {
      throw "You did not initiate Notation with a container";
    }
    this.container = container; //include the class or id of an element you wish to build the Notation in.
    this.instruments = [];

    this.initialize();
  }

  Notation.prototype.addBar = function addBar() {
    //adds a bar to every current instrument
    for (var i = 0; i < this.instruments.length; i++) {
      var instrument = this.instruments[i];
      instrument.newBar();
    }
  };

  //creates a new instrument and pushes it to the instruments array, name is optional.
  //If it is not the first instrument to be added, this function will check to see the current number of bars and add those to the new instrument also.

  Notation.prototype.addInstrument = function addInstrument(name) {

    var instrument = new _instrument2['default'](this, name); //create new instrument

    if (this.instruments.length != 0) {
      //checks if another instrument exists

      var numberOfBarsToAdd = this.instruments[0].bars.length; //can be any instrument as they'll all have the same length, so [0]

      for (var i = 0; i < numberOfBarsToAdd; i++) {
        //adds that number of bars, so if there are no bars yet it will do nothing
        instrument.newBar();
      }
    } else {
      instrument.newBar(); //each instrument should have at least one bar, for clefs, time sigs etc
    }

    this.instruments.push(instrument); //add it to the container
    return instrument; //returns the object so it can be saved to a variable
  };

  //delete instrument by the name, the id or the object

  Notation.prototype.removeInstrument = function removeInstrument(identifer) {
    var instrumentToDeleteIndex = undefined; //if === undefined at the end, no match was found for that instrument

    if (typeof identifer === "string") {

      for (var i = 0; i < this.instruments.length; i++) {
        if (this.instruments[i].name === identifer) {
          console.log("match found (name)");
          instrumentToDeleteIndex = i;
        }
      }
    } else if (typeof identifer === "number") {

      for (var i = 0; i < this.instruments.length; i++) {
        if (this.instruments[i].id === identifer) {
          console.log("match found (id)");
          instrumentToDeleteIndex = i;
        }
      }
    } else if (typeof identifer === "object") {

      for (var i = 0; i < this.instruments.length; i++) {
        if (this.instruments[i] === identifer) {
          console.log("match found (object)");
          instrumentToDeleteIndex = i;
        }
      }
    } else {
      throw "You must pass an id(integer), object or name(string) to removeInstrument() to delete an instrument";
    }

    if (instrumentToDeleteIndex != undefined) {
      var instrumentToDelete = this.instruments[instrumentToDeleteIndex];
      this.instruments.splice(instrumentToDeleteIndex, 1);
      instrumentToDelete.removeFromPage();
    }

    this.removeEmptyBarContainers(); //runs the remove empty bar containers functions to REMOVE EMPTY BARS
  };

  //stuff that is run when the object is created

  Notation.prototype.initialize = function initialize() {
    this.setUpContainer();
    this.addNamesContainer();
  };

  //empties the container when Notation is initiated

  Notation.prototype.setUpContainer = function setUpContainer() {
    $(this.container).html(" ");
  };

  //Adds the container that will contain the names of the instruments to the far left of the container, the number of instrument elements in this container is used to set the ids of instrument elements

  Notation.prototype.addNamesContainer = function addNamesContainer() {
    $(this.container).append(this.instrumentNameContainerHTML);
    $(".instrument-name-container").css(this.getInstrumentNameContainerCSS());
  };

  Notation.prototype.getInstrumentNameContainerCSS = function getInstrumentNameContainerCSS() {
    return { "display": "inline-block",
      "vertical-align": "top",
      "margin-top": this.marginAboveBar + "px",
      "margin-bottom": this.marginUnderBarContainer + "px"

    };
  };

  //removes empty bar containers after deleting instruments or bars

  Notation.prototype.removeEmptyBarContainers = function removeEmptyBarContainers() {
    var barContainers = $(".bar-container");

    for (var i = 0; i < barContainers.length; i++) {
      var bar = barContainers.eq(i);

      if (bar.children().length === 0) {
        bar.remove();
      }
    }
  };

  return Notation;
})();

window.Notation = Notation; //makes the module global
exports['default'] = Notation;
module.exports = exports['default'];

},{"./instrument":2}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Note = (function () {
  function Note(bar, parentNote) {
    _classCallCheck(this, Note);

    this.bar = bar;
    this.parentNote = parentNote;
    this.barReference = this.bar.reference;
    this.containerClassName = "note-container";
    this.className = "note";
    this.noteContainerID;
    this.noteID;

    this.noteContainerReference;
    this.noteReference;

    this.pitch;
    this.accidental;
    this.octave;
    this.duration;
    this.tuplet;
    this.rest;

    this.wholeNoteDuration = 4.0;
    this.halfNoteDuration = this.wholeNoteDuration / 2;
    this.quarterNoteDuration = this.halfNoteDuration / 2;
    this.eighthNoteDuration = this.quarterNoteDuration / 2;
    this.sixteenthNoteDuration = this.eighthNoteDuration / 2;
    this.thirtysecondNoteDuration = this.sixteenthNoteDuration / 2;
  }

  Note.prototype.initialize = function initialize() {
    //if a note is added not to be appended to another note, it will run these to set up the container the reference to it
    if (this.parentNote === undefined) {
      this.noteContainerID = this.getNoteContainerID();
      this.printNoteContainer();
      this.setNoteContainerReference();
      this.setNoteContainerCSS();
    } else {
      this.noteContainerID = this.parentNote.noteContainerID;
      this.noteContainerReference = this.parentNote.noteContainerReference;
    }

    this.noteID = this.getNoteID();
    console.log(this.noteID);
    this.printNote();
    this.setNoteReference();
    this.setNoteCSS();
  };

  Note.prototype.printNoteContainer = function printNoteContainer() {
    var noteContainerHTML = '<div class="' + this.containerClassName + '" id="' + this.noteContainerID + '"></div>';

    $(this.barReference).append(noteContainerHTML);
  };

  Note.prototype.printNote = function printNote() {
    var noteHTML = '<div class="' + this.className + '" id="' + this.noteID + '"></div>';

    $(this.noteContainerReference).append(noteHTML);
  };

  Note.prototype.setNoteContainerReference = function setNoteContainerReference() {
    var allNoteContainers = $(this.barReference).children("." + this.containerClassName);
    var targetNote = undefined;

    for (var i = 0; i < allNoteContainers.length; i++) {
      var currentNote = allNoteContainers.eq(i);

      if (currentNote.attr("id") === String(this.noteContainerID)) {
        targetNote = currentNote;
        break;
      }
    }

    if (targetNote != undefined) {
      this.noteContainerReference = targetNote;
    } else {
      throw "unable to set reference for note container";
    }
  };

  Note.prototype.setNoteReference = function setNoteReference() {
    var allNotes = $(this.noteContainerReference).children("." + this.className);
    var targetNote = undefined;

    for (var i = 0; i < allNotes.length; i++) {
      var currentNote = allNotes.eq(i);

      if (currentNote.attr("id") === String(this.noteID)) {
        targetNote = currentNote;
        break;
      }
    }

    if (targetNote != undefined) {
      this.noteReference = targetNote;
    } else {
      throw "unable to set reference for note container";
    }
  };

  Note.prototype.setNoteContainerCSS = function setNoteContainerCSS() {

    if ($(this.noteContainerReference) === undefined) {
      throw "noteContainerReference not found";
    }

    $(this.noteContainerReference).css(this.getNoteContainerCSS());
  };

  Note.prototype.setNoteCSS = function setNoteCSS() {

    if ($(this.noteReference) === undefined) {
      throw "noteContainerReference not found";
    }

    $(this.noteReference).css(this.getNoteCSS());
  };

  Note.prototype.getNoteContainerCSS = function getNoteContainerCSS() {
    return { "height": "100%",
      "width": "30px",
      "background-color": "#a4b4d6",
      "display": "inline-block",
      "border-right": "1px solid blue",
      "box-sizing": "border-box"

    };
  };

  //returns css attributes for note container

  Note.prototype.getNoteCSS = function getNoteCSS() {
    return { "height": "10px",
      "width": "100%",
      "background-color": "#e87676",
      "display": "block",
      "border-bottom": "1px solid red",
      "box-sizing": "border-box"

    };
  };

  //returns css attributes for note

  Note.prototype.getNoteContainerID = function getNoteContainerID() {
    return $(this.barReference).children("." + this.containerClassName).length;
  };

  Note.prototype.getNoteID = function getNoteID() {
    return $(this.noteContainerReference).children().length;
  };

  return Note;
})();

exports["default"] = Note;
module.exports = exports["default"];

},{}]},{},[3]);
