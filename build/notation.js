(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _note = require("./note");

var _note2 = _interopRequireDefault(_note);

var _keySignature = require("./keySignature");

var _keySignature2 = _interopRequireDefault(_keySignature);

var _timeSignature = require("./timeSignature");

var _timeSignature2 = _interopRequireDefault(_timeSignature);

var Bar = (function () {
  function Bar(instrument, id) {
    _classCallCheck(this, Bar);

    this.instrument = instrument;
    this.notation = this.instrument.notation;
    this.id = id;
    this.notes = [];
    this.reference;

    this.keySignature;
    this.timeSignature;

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

  Bar.prototype.addNote = function addNote(n, duration, addNoteToNote) {
    //{ pitch = "A", accidental = "sharp/flat/natural", octave = 3, duration = 4 }
    var note = new _note2["default"](this, n, duration, addNoteToNote);
    note.initialize();

    if (addNoteToNote === undefined) {
      //only add it to the bar.notes[] if it's the first note added of a chord
      this.notes.push(note);
    } else {
      addNoteToNote.childNotes.push(note);
    }
    return note;
  };

  //returns a note from the bar, index starting at 1 not 0

  Bar.prototype.note = function note(noteIndex) {
    var note = this.notes[noteIndex - 1];

    if (note === undefined) {
      var instrument = this.instrument.id;
      var bar = this.bar.id;
      throw "unable to find the note of [index: " + noteIndex + "] in the [bar: " + bar + "] in [instrument: " + instrument + "]";
    } else {
      return note;
    }
  };

  Bar.prototype.printBar = function printBar() {
    var currentBarContainers = $("." + this.notation.barsContainer + " > ." + this.containerClassName); //all bars
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

    if (this.id === 0) {
      //only gets run on the first bar that is added by default, sets up the clef, time sig and key sig. Should probably break this into a seperate function
      this.addClef(newBar);
      this.changeKeySignature("sharps", 0);
      this.changeTimeSignature(4, 4); //default to a 4/4 time signature because i'm a pleb
    }
  };

  Bar.prototype.setBeams = function setBeams() {
    for (var i = 0; i < this.notes.length; i++) {
      var note = this.notes[i];

      note.defaultBeam(); //should return all beams to their defaults and set the note.noteGrouping to false
      note.setBeam(); //should look at neighbouring notes and set the beams appropriately
    }
  };

  //chcecks if a bar container already exists, so multiples do not get added

  Bar.prototype.checkIfBarContainerExists = function checkIfBarContainerExists() {
    var barFound = false;
    var currentBars = $("." + this.notation.barsContainer + " > ." + this.containerClassName);

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
    $("." + this.notation.barsContainer).append(this.barContainerHTML);
    $("." + this.containerClassName).css(this.getBarContainerCSS()); //probably quicker just to set all the bars css than to loop through them all and find the right one?
  };

  Bar.prototype.removeBarsFromContainer = function removeBarsFromContainer(target) {
    target.html("");
  };

  Bar.prototype.getBarCSS = function getBarCSS() {
    var minWidth = this.notation.barHeight * 2;

    return { "height": this.notation.barHeight + "px", //the "height" the stave lines will be
      "margin": this.notation.marginAboveBar + "px -" + this.widthOfBarLines + "px " + this.notation.marginUnderBar + "px 0px", //notice the negative symbol, negative margin to overlap the end line and start line of two bars
      "padding": "0px", //also on line above, marginUnderBar which is set in the notation class, sets the bottom margin of instrument name and bars
      "border": "0px solid black",
      "border-width": "0px " + this.widthOfBarLines + "px", //the "width the bar linse will be"
      "vertical-align": "top",
      "min-width": minWidth + "px",
      "white-space": "nowrap"
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

      var lineStyle = "height: " + this.heightOfLines + "; background-color: #636363; position: relative;  top: " + topOffset + ";";
      var lineHTML = '<div class="line" style="' + lineStyle + '"></div>';

      var lineContainerStyle = "height: 0; padding: 0px; margin: 0px";
      var lineContainerHTML = '<div class="line-container" style="' + lineContainerStyle + '">' + lineHTML + '</div';

      $(bar).append(lineContainerHTML);
    }
  };

  Bar.prototype.addClef = function addClef(bar) {
    var targetBar = $(bar);
    var clefHTML = undefined;
    var clefCSS = undefined;

    if (this.instrument.clef === "bass") {
      clefHTML = '<img src="' + this.notation.bassClefPath + '" class="clef">';

      clefCSS = {
        "height": "80%",
        "display": "inline-block",
        "padding": "2px 5px 2px 10px",
        "box-sizing": "border-box",
        "vertical-align": "top",
        "position": "relative" };
    } else //so it sits atop the lines
      {
        clefHTML = '<img src="' + this.notation.trebleClefPath + '" class="clef">';
        var bottomOffset = $(this.reference).height() / 7;

        clefCSS = {
          "height": "150%",
          "display": "inline-block",
          "padding": "2px 5px 2px 10px",
          "box-sizing": "border-box",
          "bottom": bottomOffset,
          "position": "relative"
        };
      }

    targetBar.append(clefHTML);
    targetBar.children(".clef").css(clefCSS);
  };

  Bar.prototype.changeKeySignature = function changeKeySignature(typeOf, numberOf) {
    this.keySignature = new _keySignature2["default"](this, typeOf, numberOf);
  };

  Bar.prototype.changeTimeSignature = function changeTimeSignature(top, bottom) {
    if (typeof top != "number") {
      throw "time signatures must be be numeric values";
    }

    if (typeof bottom != "number") {
      throw "time signatures must be be numeric values";
    }

    this.timeSignature = new _timeSignature2["default"](this, top, bottom);
  };

  Bar.prototype.removeTimeSignature = function removeTimeSignature() {
    if (this.timeSignature === undefined) {
      var instrument = this.instrument.id;
      var bar = this.id;
      throw "the time signature cannot be removed from [instrument: " + instrument + ", bar: " + bar + "] as one does not currently exist.";
    } else {
      this.timeSignature.removeOldTimeSignature();
      this.timeSignature = undefined;
    }
  };

  return Bar;
})();

exports["default"] = Bar;
module.exports = exports["default"];

},{"./keySignature":3,"./note":5,"./timeSignature":6}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bar = require('./bar');

var _bar2 = _interopRequireDefault(_bar);

var Instrument = (function () {
  function Instrument(notation, name, clef) {
    _classCallCheck(this, Instrument);

    this.notation = notation;
    this.name = this.initName(name);
    this.clef = clef;
    this.id = this.setId();
    this.bars = [];

    this.className = "instrument-name"; //name has to be written without the period as when concaterated in a html class it won't work with it
    this.instrumentNameHTML = '<div class="' + this.className + '" id="' + String(this.id) + '">' + this.name + '</div>';

    this.initialize();
  }

  //this calls the notation class method of the same name but returns the added bar for the instrument it's called on so it can be stored as a variable

  Instrument.prototype.addBar = function addBar() {
    this.notation.addBar();
    return this.bars[this.bars.length - 1];
  };

  //the method that is actually called to add the b

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
    var containerChildren = $("." + this.notation.barsContainer).children(); //gets all the bar and name containers

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

    containerChildren = $(this.notation.container).children(); //gets all the bar and name containers

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
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeySignature = (function () {
  function KeySignature(bar, typeOf, numberOf) {
    _classCallCheck(this, KeySignature);

    this.bar = bar;
    this.instrument = this.bar.instrument;

    this.sharpHorizontalLineThickness = $(this.bar.reference).height() / 4 / 2.75;
    this.sharpVerticalLineThickness = $(this.bar.reference).height() / 4 / 4.25;

    this.numberOf = numberOf; //number of sharps or flats 0-7
    this.typeOf = typeOf; //sharps or flats

    this.keySignatureContainerClassName = "key-signature-container";
    this.keySignatureContainerReference;

    this.keySignatureClassName = "key-signature";

    this.initialize();

    //element heirarchy

    //div key-signature-container (holds all the sharp/flats)
    //div key-signature
    //sharp(1-4) (lines)
  }

  KeySignature.prototype.initialize = function initialize() {
    this.removeOldKeySignature();

    if (this.numberOf > 0) {
      //doesn't get run if the numberOf is 0, but the container still gets deleted
      this.appendKeyContainer();
      this.setKeyContainerReference();
      this.setKeyContainerCSS();
    }

    for (var i = 0; i < this.numberOf; i++) {

      this.appendKey();
      this.keyCSS(i);

      if (this.typeOf === "sharps") {
        this.drawSharp();
      } else if (this.typeOf === "flats") {
        this.drawFlat();
      } else {
        throw "valid type of keysignature was not passed, the valid paramaters are either 'sharps' or 'flats'";
      }
    }
  };

  KeySignature.prototype.removeOldKeySignature = function removeOldKeySignature() {
    //removes the old key signature if one exists
    var bar = $(this.bar.reference);
    var oldKey = bar.children("." + this.keySignatureContainerClassName);

    if (oldKey.length > 0) {
      oldKey.remove();
    }
  };

  //containers the keysignature

  KeySignature.prototype.appendKeyContainer = function appendKeyContainer() {
    var keyContainerHTML = '<div class="' + this.keySignatureContainerClassName + '"></div>';
    var targetBar = $(this.bar.reference);

    if (targetBar.children(".clef").length > 0) {
      //if the bar has a clef, append it after it. Otherwise it will append the keysignature before the clef
      targetBar.children(".clef").after(keyContainerHTML);
    } else {
      targetBar.children(".line-container").last().after(keyContainerHTML); //append it after the last line-container otherwise
    }
  };

  KeySignature.prototype.setKeyContainerReference = function setKeyContainerReference() {
    var bar = $(this.bar.reference);
    var target = bar.children("." + this.keySignatureContainerClassName);

    this.keySignatureContainerReference = target;
  };

  KeySignature.prototype.setKeyContainerCSS = function setKeyContainerCSS() {

    var leftPadding = $(this.bar.reference).height() / 4;

    var style = { "display": "inline-block",
      "height": "100%",
      "vertical-align": "top",
      "padding-left": leftPadding + "px"
    };

    $(this.keySignatureContainerReference).css(style);
  };

  KeySignature.prototype.appendKey = function appendKey() {
    var keyHTML = '<div class"' + this.keySignatureClassName + '"></div>';
    var container = $(this.keySignatureContainerReference);

    container.append(keyHTML); //append new sharp
  };

  KeySignature.prototype.keyCSS = function keyCSS(index) {
    var topOffsetVal = $(this.bar.reference).height() / 4; //height of space between bar lines
    var topOffsetMult = undefined;
    if (this.typeOf === "sharps") {
      topOffsetMult = this.sharpsDictionary(index);
    } else if (this.typeOf === "flats") {
      topOffsetMult = this.flatsDictionary(index);
    }

    var container = $(this.keySignatureContainerReference);
    var newestElement = container.children().last(); //get the newly added element

    var width = $(this.bar.reference).height() / 2.5; //so the size scales when the height of the bar is changed

    var style = { "display": "inline-block",
      "vertical-align": "top",
      "width": width + "px",
      "position": "relative",
      "top": topOffsetVal * topOffsetMult

    };

    newestElement.css(style);
  };

  KeySignature.prototype.drawSharp = function drawSharp() {
    var container = $(this.keySignatureContainerReference); //key sig container
    var newestElement = container.children().last(); //latest instance of "key sig" which holds each sharp or flat

    this.firstSharpLine(newestElement); //topmost horizontal line
    this.secondSharpLine(newestElement); //bottom horizontal line
    this.thirdSharpLine(newestElement);
    this.fourthSharpLine(newestElement);
  };

  //topmost horizontal line

  KeySignature.prototype.firstSharpLine = function firstSharpLine(keySignature) {
    var kSig = $(keySignature); //target to append container too

    var lineContanerHTML = '<div class="line-container line-container1"></div>';

    var lineContainerCSS = { "height": "0",
      "transform": "rotate(-10deg)",
      "position": "relative",
      "bottom": this.sharpHorizontalLineThickness / 2 };

    //makes the line sit atop the bar line instead of below it
    kSig.append(lineContanerHTML);

    var lineContainer = kSig.children().last(); //find container just added
    lineContainer.css(lineContainerCSS); //apply css to it

    var width = $(this.bar.reference).height() / 3; //width of the line, slightly less the than the width of the Key Signature so there is a gap between sharps/flats
    var lineHTML = '<div class="line line1"></div>';

    var lineCSS = { "width": width + "px",
      "height": this.sharpHorizontalLineThickness + "px",
      "background-color": "black"

    };

    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
  };

  //bottom horizontal line

  KeySignature.prototype.secondSharpLine = function secondSharpLine(keySignature) {
    var kSig = $(keySignature); //target to append container too

    var lineContanerHTML = '<div class="line-container line-container2"></div>';
    var topOffset = $(this.bar.reference).height() / 4; //same as the distance between lines

    var lineContainerCSS = { "height": "0",
      "transform": "rotate(-10deg)",
      "position": "relative",
      "top": topOffset - this.sharpHorizontalLineThickness / 2 };

    //subtract half the thickness of the line so it sits atop the bar line
    kSig.append(lineContanerHTML);

    var lineContainer = kSig.children().last(); //find container just added
    lineContainer.css(lineContainerCSS); //apply css to it

    var width = $(this.bar.reference).height() / 3; //width of the line, slightly less the than the width of the Key Signature so there is a gap between sharps/flats
    var lineHTML = '<div class="line line2"></div>';

    var lineCSS = { "width": width + "px",
      "height": this.sharpHorizontalLineThickness + "px",
      "background-color": "black"

    };

    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
  };

  KeySignature.prototype.thirdSharpLine = function thirdSharpLine(keySignature) {
    var kSig = $(keySignature); //target to append container too

    var widthOfHorizontalLine = $(this.bar.reference).height() / 3;

    var lengthOfVerticalLine = $(this.bar.reference).height() / 2;

    var lineContanerHTML = '<div class="line-container line-container3"></div>';
    var topOffset = $(this.bar.reference).height() / 4; //same as the distance between lines

    var lineContainerCSS = { "height": "0",
      "position": "relative",
      "bottom": lengthOfVerticalLine / 4, //subtract half the thickness of the line so it sits atop the bar line
      "left": widthOfHorizontalLine / 5
    };

    kSig.append(lineContanerHTML);

    var lineContainer = kSig.children().last(); //find container just added
    lineContainer.css(lineContainerCSS); //apply css to it

    var lineHTML = '<div class="line line3"></div>';

    var lineCSS = { "width": this.sharpVerticalLineThickness + "px",
      "height": lengthOfVerticalLine + "px",
      "background-color": "black"

    };

    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
  };

  KeySignature.prototype.fourthSharpLine = function fourthSharpLine(keySignature) {
    var kSig = $(keySignature); //target to append container too

    var widthOfHorizontalLine = $(this.bar.reference).height() / 3;

    var lengthOfVerticalLine = $(this.bar.reference).height() / 2;

    var lineContanerHTML = '<div class="line-container line-container4"></div>';
    var topOffset = $(this.bar.reference).height() / 4; //same as the distance between lines

    var lineContainerCSS = { "height": "0",
      "position": "relative",
      "bottom": lengthOfVerticalLine / 4, //subtract half the thickness of the line so it sits atop the bar line
      "left": widthOfHorizontalLine / 5 * 3
    };

    kSig.append(lineContanerHTML);

    var lineContainer = kSig.children().last(); //find container just added
    lineContainer.css(lineContainerCSS); //apply css to it

    var lineHTML = '<div class="line line4"></div>';

    var lineCSS = { "width": this.sharpVerticalLineThickness + "px",
      "height": lengthOfVerticalLine + "px",
      "background-color": "black"

    };

    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
  };

  KeySignature.prototype.sharpsDictionary = function sharpsDictionary(index) {
    var dictionary = [-0.5, 1, -1, 0.5, 2, 0, 1.5];

    if (this.instrument.clef === "bass") {
      //bass clef moves everything down a whole line or space
      return dictionary[index] + 1;
    }

    return dictionary[index];
  };

  KeySignature.prototype.drawFlat = function drawFlat() {
    var container = $(this.keySignatureContainerReference); //key sig container
    var newestElement = container.children().last();

    this.flatHead(newestElement);
    this.flatStem(newestElement);
  };

  KeySignature.prototype.flatHead = function flatHead(keySignature) {
    var newestElement = $(keySignature);
    var flatHeadContainerHTML = '<div class="flat-head-container"></div>';

    var flatHeadContainerCSS = { "height": "0px"
    };

    //"transform": "rotate(-20deg)",

    newestElement.append(flatHeadContainerHTML);

    var flatHeadContainer = newestElement.children().last();
    flatHeadContainer.css(flatHeadContainerCSS);

    var flatHeadHTML = '<div class="flat-head"></div>';

    var height = $(this.bar.reference).height() / 4; //size of space between lines

    var flatHeadCSS = { "border": "1px solid black",
      "height": height + "px",
      "width": height * 0.80 + "px",
      "border-width": height / 4 + "px " + height / 2.5 + "px " + height / 8 + "px " + height / 8 + "px",
      "border-radius": height * 1.15 + "px " + height * 1.15 / 2 + "px " + height * 1.15 + "px " + "0px",
      "box-sizing": "border-box"

    };
    // (height / 4) + "px " + (height / 3) + "px " + (height / 8) + "px " + (height / 8) + "px"

    flatHeadContainer.append(flatHeadHTML);
    var flatHead = flatHeadContainer.children();

    flatHead.css(flatHeadCSS);
  };

  KeySignature.prototype.flatStem = function flatStem(keySignature) {
    var newestElement = $(keySignature);
    var flatStemContainerHTML = '<div class="flat-stem-container"></div>';

    var flatStemContainerCSS = { "height": "0px"

    };

    newestElement.append(flatStemContainerHTML);

    var flatStemContainer = newestElement.children().last();
    flatStemContainer.css(flatStemContainerCSS);

    var flatStemHTML = '<div class="flat-stem"></div>';

    var height = $(this.bar.reference).height() / 4; //size of space between lines

    var flatStemCSS = { "background-color": "black",
      "height": height * 2.5 + "px",
      "width": height / 4 + "px",
      "position": "relative",
      "bottom": height * 1.5 + "px"

    };
    flatStemContainer.append(flatStemHTML);
    var flatHead = flatStemContainer.children();

    flatHead.css(flatStemCSS);
  };

  KeySignature.prototype.flatsDictionary = function flatsDictionary(index) {
    var dictionary = [1.5, 0, 2, 0.5, 2.5, 1, 3];

    if (this.instrument.clef === "bass") {
      //bass clef moves everything down a whole line or space
      return dictionary[index] + 1;
    }

    return dictionary[index];
  };

  return KeySignature;
})();

exports["default"] = KeySignature;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _instrument = require('./instrument');

var _instrument2 = _interopRequireDefault(_instrument);

var Notation = (function () {
  function Notation(container) {
    _classCallCheck(this, Notation);

    this.trebleClefPath = "./media/clef.png";
    this.bassClefPath = "./media/bass.png";

    this.keySignature = "C";

    this.barHeight = 35; //height of bars and instrument name divs
    this.marginAboveBar = this.barHeight;
    this.marginUnderBar = this.barHeight;
    this.marginUnderBarContainer = 20; //the amount of padidng under the CONTAINERS (instrument name container, bar-container)

    if (container == undefined) {
      throw "You did not initiate Notation with a container";
    }
    this.container = container; //include the class or id of an element you wish to build the Notation in.

    this.barsContainer = "bars-container";
    this.instrumentNameContainer = "instrument-name-container";
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

  Notation.prototype.addInstrument = function addInstrument(name, clef) {

    var instrument = new _instrument2["default"](this, name, clef); //create new instrument

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

  Notation.prototype.setBarsContainerCSS = function setBarsContainerCSS() {
    var width = $(this.container).width() - $("." + this.instrumentNameContainer).width();
    var css = { "display": "inline-block",
      "vertical-align": "top",
      "width": width + "px",
      "padding": 0,
      "margin": 0
    };

    $("." + this.barsContainer).css(css);
  };

  Notation.prototype.setBarClefs = function setBarClefs() {
    $(this.container).find(".clef").remove();
  };

  //stuff that is run when the object is created

  Notation.prototype.initialize = function initialize() {
    this.setUpContainer();
    this.addNamesContainer();
    this.addBarsContainer();
  };

  //empties the container when Notation is initiated

  Notation.prototype.setUpContainer = function setUpContainer() {
    $(this.container).html(" ");
  };

  //Adds the container that will contain the names of the instruments to the far left of the container, the number of instrument elements in this container is used to set the ids of instrument elements

  Notation.prototype.addNamesContainer = function addNamesContainer() {
    var HTML = '<div class="instrument-name-container"></div>';

    $(this.container).append(HTML);
    $(".instrument-name-container").css(this.getInstrumentNameContainerCSS());
  };

  Notation.prototype.addBarsContainer = function addBarsContainer() {
    var HTML = '<div class="' + this.barsContainer + '"></div>';

    $(this.container).append(HTML);
    this.setBarsContainerCSS();
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
exports["default"] = Notation;
module.exports = exports["default"];

},{"./instrument":2}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Note = (function () {
  function Note(bar, pitch, duration, parentNote) {
    _classCallCheck(this, Note);

    this.bar = bar;

    this.parentNote = parentNote;
    this.childNotes = []; //notes that inhabit the same index as this note to make a chord
    this.partOfNoteGrouping = false; // wether this note has been beamed together with other notes

    this.barReference = this.bar.reference;
    this.containerClassName = "note-container";
    this.className = "note";
    this.noteContainerID;
    this.noteID;

    this.noteContainerReference; //holds note container jquery object
    this.noteReference; //and the same for the note
    this.noteHeadReference;
    this.ledgerLineContainerReference;
    this.ledgerLineReference;
    this.noteStemContainerReference;
    this.noteStemReference;

    this.pitch = pitch;
    this.duration = duration;
    if (this.duration === undefined) {
      this.duration = "quarter-note";
    }
    this.accidental;
    this.octave;
    this.tuplet;
    this.rest;

    this.stemDirection = "down";

    this.noteParameters = this.getNoteParameters(this.pitch);
    if (this.noteParameters === undefined) {
      throw "note/octave '" + this.pitch + "' not recognised in note.getNoteParameters()";
    }
  }

  Note.prototype.initialize = function initialize() {
    //if a note is added not to be appended to another note, it will run these to set up the container the reference to it

    //Note-container, contains multiple or single notes and allocates the correct amount of space for them
    if (this.parentNote === undefined) {
      this.noteContainerID = this.getNoteContainerID();
      this.printNoteContainer();
      this.setNoteContainerReference();
      this.setNoteContainerCSS();
    } else {
      this.noteContainerID = this.parentNote.noteContainerID;
      this.noteContainerReference = this.parentNote.noteContainerReference;
    }

    //the container for the note head, there may be many in each note-container
    this.noteID = this.getNoteID();
    this.printNote();
    this.setNoteReference();
    this.setNoteCSS();

    //note head gets top applied to it to move it to the correct place
    this.printNoteHead();
    this.setNoteHeadReference();
    this.setNoteHeadCSS();

    //ledger lines
    if (this.noteParameters.ledgerLinePosition !== undefined) {
      for (var i = 0; i < this.noteParameters.ledgerLineNumber; i++) {
        this.printLedgerLineContainer();
        this.setLedgerLineContainerReference();
        this.setLedgerLineContainerCSS();

        this.printLedgerLine();
        this.setLedgerLineReference();
        this.setLedgerLineCSS(i);
      }
    }

    //note stem container, anything rotated in a nother roated element needs to have a 0 height 0 width container to stop strange things from happening when the height is adjusted
    if (this.duration !== "whole-note") {
      this.printNoteStemContainer();
      this.setNoteStemContainerReference();
      this.setNoteStemContainerCSS();

      this.printNoteStem();
      this.setNoteStemReference();
      this.setNoteStemCSS();
    }
  };

  Note.prototype.setBeam = function setBeam() {};

  Note.prototype.printNoteContainer = function printNoteContainer() {
    var noteContainerHTML = '<div class="' + this.containerClassName + '" id="' + this.noteContainerID + '"></div>';

    $(this.barReference).append(noteContainerHTML);
  };

  Note.prototype.printNote = function printNote() {
    var noteHTML = '<div class="' + this.className + '" id="' + this.noteID + '"></div>';

    $(this.noteContainerReference).append(noteHTML);
  };

  Note.prototype.printNoteHead = function printNoteHead() {
    var noteHeadHTML = '<div class="note-head"></div>';

    $(this.noteReference).append(noteHeadHTML);
  };

  Note.prototype.printLedgerLineContainer = function printLedgerLineContainer() {
    var ledgerLineContainerHTML = '<div class="ledger-line-container"></div>';
    $(this.noteHeadReference).append(ledgerLineContainerHTML);
  };

  Note.prototype.printLedgerLine = function printLedgerLine() {
    var ledgerLineHTML = '<div class="ledger-line"></div>';

    $(this.ledgerLineContainerReference).append(ledgerLineHTML);
  };

  Note.prototype.printNoteStemContainer = function printNoteStemContainer() {
    var noteStemContainerHTML = '<div class="note-stem-container"></div>';
    $(this.noteHeadReference).append(noteStemContainerHTML);
  };

  Note.prototype.printNoteStem = function printNoteStem() {
    var noteStemHTML = '<div class="note-stem"></div>';

    $(this.noteStemContainerReference).append(noteStemHTML);
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

  Note.prototype.setNoteHeadReference = function setNoteHeadReference() {
    this.noteHeadReference = $(this.noteReference).children();
  };

  Note.prototype.setLedgerLineContainerReference = function setLedgerLineContainerReference() {
    this.ledgerLineContainerReference = $(this.noteHeadReference).children(".ledger-line-container").last(); //should grab the most recent one in the event there are multiple ledger lines for a note
  };

  Note.prototype.setLedgerLineReference = function setLedgerLineReference() {
    this.ledgerLineReference = $(this.ledgerLineContainerReference).children();
  };

  Note.prototype.setNoteStemContainerReference = function setNoteStemContainerReference() {
    this.noteStemContainerReference = $(this.noteHeadReference).children(".note-stem-container");
  };

  Note.prototype.setNoteStemReference = function setNoteStemReference() {
    this.noteStemReference = $(this.noteStemContainerReference).children();
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

  Note.prototype.setNoteHeadCSS = function setNoteHeadCSS() {
    $(this.noteHeadReference).css(this.getNoteHeadCSS());
  };

  Note.prototype.setLedgerLineContainerCSS = function setLedgerLineContainerCSS() {
    $(this.ledgerLineContainerReference).css(this.getLedgerLineContainerCSS());
  };

  Note.prototype.setLedgerLineCSS = function setLedgerLineCSS(index) {
    $(this.ledgerLineReference).css(this.getLedgerLineCSS(index));
  };

  Note.prototype.setNoteStemContainerCSS = function setNoteStemContainerCSS() {
    $(this.noteStemContainerReference).css(this.getNoteStemContainerCSS());
  };

  Note.prototype.setNoteStemCSS = function setNoteStemCSS() {
    $(this.noteStemReference).css(this.getNoteStemCSS());
  };

  Note.prototype.getNoteContainerCSS = function getNoteContainerCSS() {
    var wholeNoteWidth = 4.0;
    var halfNoteWidth = wholeNoteWidth / 2;
    var quarterNoteWidth = halfNoteWidth / 2;
    var eighthNoteWidth = quarterNoteWidth / 2;
    var sixteenthNoteWidth = eighthNoteWidth / 2;
    var thirtysecondNoteWidth = sixteenthNoteWidth / 2;

    var widthMultiplier = undefined;

    switch (this.duration) {
      case "whole-note":
        widthMultiplier = 2;
        break;
      case "half-note":
        widthMultiplier = 1.3;
        break;
      case "quarter-note":
        widthMultiplier = 1.1;
        break;
      case "eighth-note":
        widthMultiplier = 0.90;
        break;
      case "sixteenth-note":
        widthMultiplier = 0.70;
        break;
      case "thirty-second-note":
        widthMultiplier = 0.60;
        break;
    }

    var width = $(this.barReference).height();

    return { "height": "100%",
      "width": width * widthMultiplier + "px",
      "display": "inline-block",
      "box-sizing": "border-box",
      "vertical-align": "top"

    };
  };

  //returns css attributes for note container

  Note.prototype.getNoteCSS = function getNoteCSS() {
    return { "height": "0px",
      "width": "100%",
      "background-color": "#e87676",
      "display": "block",
      "border-bottom": "0px solid red",
      "box-sizing": "border-box"

    };
  };

  //returns css attributes for note

  Note.prototype.getNoteHeadCSS = function getNoteHeadCSS() {
    var noteHeadHeight = $(this.barReference).height() / 4; //same as the distance between lines

    var background = undefined;

    if (this.duration === "whole-note" || this.duration === "half-note") {
      background = "transparent";
    } else {
      background = "black";
    }

    return {
      "height": noteHeadHeight + "px",
      "width": noteHeadHeight * 1.25 + "px",
      "box-sizing": "border-box",
      "border": "2px solid black",
      "border-width": "2px 1px",
      "border-radius": "50px",
      "transform": "rotate(-15deg)",
      "margin": "auto",
      "position": "relative",
      "top": "" + noteHeadHeight * this.noteParameters.topOffset + "px",
      "background-color": background

    };
  };

  Note.prototype.getLedgerLineContainerCSS = function getLedgerLineContainerCSS() {
    return {
      "transform": "rotate(15deg)",
      "height": "0px",
      "width": "0px"

    };
  };

  Note.prototype.getLedgerLineCSS = function getLedgerLineCSS(index) {
    var noteHeadHeight = $(this.barReference).height() / 4;
    var noteHeadWidth = noteHeadHeight * 1.25; //same as the distance between lines

    var offset = undefined;

    if (this.noteParameters.ledgerLinePosition === "top") {
      var barTop = $(this.noteContainerReference).offset().top;

      var idealLedgerLinePosition = barTop - noteHeadHeight * (index + 1); //basically moves every ledger line up one space

      var currentLedgerLinePosition = $(this.ledgerLineReference).offset().top;

      offset = idealLedgerLinePosition - currentLedgerLinePosition;
    } else if (this.noteParameters.ledgerLinePosition === "bottom") {
      var barTop = $(this.noteContainerReference).offset().top;

      var barHeight = this.noteContainerReference.height();

      var idealLedgerLinePosition = barTop + barHeight + noteHeadHeight * (index + 1) - this.bar.widthOfBarLines; //basically moves every ledger line up one space

      var currentLedgerLinePosition = $(this.ledgerLineReference).offset().top;

      offset = idealLedgerLinePosition - currentLedgerLinePosition;
    }

    return {
      "height": this.bar.widthOfBarLines + "px",
      "width": noteHeadWidth * 2.5 + "px",
      "background-color": "black",
      "position": "relative",
      "right": noteHeadWidth / 1.20 + "px",
      "top": offset + "px"
    };
  };

  Note.prototype.getNoteStemContainerCSS = function getNoteStemContainerCSS() {
    return {
      "transform": "rotate(15deg)",
      "height": "0px",
      "width": "0px"
    };
  };

  Note.prototype.getNoteStemCSS = function getNoteStemCSS() {
    var noteHeadHeight = $(this.barReference).height() / 4; //same as the distance between lines
    var stemWidth = 1;
    var stemHeight = noteHeadHeight * 3.0;
    var left = undefined;
    var bottom = undefined;

    if (this.noteParameters.stemDirection === "up") {
      left = noteHeadHeight * 1.25 - stemWidth - 1; // the addiontal minus 1 just seems to do the trick
      bottom = stemHeight - noteHeadHeight / 2.60;
    } else if (this.noteParameters.stemDirection === "down") {
      left = 0;
      bottom = 0;
    }

    return {
      "height": stemHeight,
      "width": stemWidth,
      "background-color": "black",
      "position": "relative",
      "left": left,
      "bottom": bottom
    };
  };

  Note.prototype.getNoteContainerID = function getNoteContainerID() {
    return $(this.barReference).children("." + this.containerClassName).length;
  };

  Note.prototype.getNoteID = function getNoteID() {
    return $(this.noteContainerReference).children().length;
  };

  Note.prototype.getNoteParameters = function getNoteParameters(note) {

    var noteDictionary = { "C6": { topOffset: -2.5, stemDirection: "down", ledgerLinePosition: "top", ledgerLineNumber: 2 },
      "B5": { topOffset: -2.0, stemDirection: "down", ledgerLinePosition: "top", ledgerLineNumber: 1 },
      "A5": { topOffset: -1.5, stemDirection: "down", ledgerLinePosition: "top", ledgerLineNumber: 1 },
      "G5": { topOffset: -1.0, stemDirection: "down" },
      "F5": { topOffset: -0.5, stemDirection: "down" },
      "E5": { topOffset: 0.0, stemDirection: "down" },
      "D5": { topOffset: 0.5, stemDirection: "down" },
      "C5": { topOffset: 1.0, stemDirection: "down" },
      "B4": { topOffset: 1.5, stemDirection: "down" },
      "A4": { topOffset: 2.0, stemDirection: "up" },
      "G4": { topOffset: 2.5, stemDirection: "up" },
      "F4": { topOffset: 3.0, stemDirection: "up" },
      "E4": { topOffset: 3.5, stemDirection: "up" },
      "D4": { topOffset: 4.0, stemDirection: "up" },
      "C4": { topOffset: 4.5, stemDirection: "up", ledgerLinePosition: "bottom", ledgerLineNumber: 1 },
      "B3": { topOffset: 5.0, stemDirection: "up", ledgerLinePosition: "bottom", ledgerLineNumber: 1 }
    };

    return noteDictionary[note];
  };

  return Note;
})();

exports["default"] = Note;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimeSignature = (function () {
  function TimeSignature(bar, top, bottom) {
    _classCallCheck(this, TimeSignature);

    this.bar = bar;
    this.top = top;
    this.bottom = bottom;

    this.timeSignatureContainerReference;
    this.timeSignatureTopReference;
    this.timeSignatureBottomReference;

    this.initialize();
  }

  TimeSignature.prototype.initialize = function initialize() {
    this.removeOldTimeSignature();

    this.printTimeSignatureContainer();
    this.setTimeSignatureContainerReference();
    this.setTimeSignatureContainerCSS();

    this.printTimeSignatureTop();
    this.setTimeSignatureTopReference();
    this.setTimeSignatureTopCSS();

    this.printTimeSignatureBottom();
    this.setTimeSignatureBottomReference();
    this.setTimeSignatureBottomCSS();
  };

  //this needs to be public so it can be called from the bar method to removed a time signature

  TimeSignature.prototype.removeOldTimeSignature = function removeOldTimeSignature() {
    //removes the old time signature if one exists
    var bar = $(this.bar.reference);
    var oldTimeSignature = bar.children(".time-signature-container");

    if (oldTimeSignature.length > 0) {
      oldTimeSignature.remove();
    }
  };

  TimeSignature.prototype.printTimeSignatureContainer = function printTimeSignatureContainer() {
    var bar = $(this.bar.reference);
    var html = '<div class="time-signature-container"></div>';
    //bar.append(html);

    if (bar.children(".key-signature-container").length > 0) {
      bar.children(".key-signature-container").after(html);
    } else if (bar.children(".clef").length > 0) {
      bar.children(".clef").after(html);
    } else {
      bar.children(".line-container").last().after(html);
    }
  };

  TimeSignature.prototype.setTimeSignatureContainerReference = function setTimeSignatureContainerReference() {
    var bar = $(this.bar.reference);
    var container = bar.children(".time-signature-container");
    this.timeSignatureContainerReference = container;
  };

  TimeSignature.prototype.setTimeSignatureContainerCSS = function setTimeSignatureContainerCSS() {
    var container = $(this.timeSignatureContainerReference);
    var padding = $(this.bar.reference).height() / 5;
    var containerCSS = { "display": "inline-block",
      "height": "100%",
      "vertical-align": "top",
      "padding-left": padding + "px",
      "padding-right": padding * 2 + "px",
      "position": "relative" };

    //makes it sit above the lines

    container.css(containerCSS);
  };

  TimeSignature.prototype.printTimeSignatureTop = function printTimeSignatureTop() {
    var timeSignatureContainer = $(this.timeSignatureContainerReference);
    var html = '<p class="time-signature-top">' + this.top + '</p>';

    timeSignatureContainer.append(html);
  };

  TimeSignature.prototype.setTimeSignatureTopReference = function setTimeSignatureTopReference() {
    var timeSignatureContainer = $(this.timeSignatureContainerReference);
    var top = timeSignatureContainer.children(".time-signature-top");
    this.timeSignatureTopReference = top;
  };

  TimeSignature.prototype.setTimeSignatureTopCSS = function setTimeSignatureTopCSS() {
    var top = $(this.timeSignatureTopReference);

    var lineHeight = $(this.bar.reference).height() / 2;
    var topCSS = { "display": "inline-block",
      "vertical-align": "top",
      "margin": "0px",
      "font-weight": "800",
      "line-height": lineHeight + "px",
      "font-size": lineHeight * 1.50 + "px",
      "display": "block"

    };

    top.css(topCSS);
  };

  TimeSignature.prototype.printTimeSignatureBottom = function printTimeSignatureBottom() {
    var timeSignatureContainer = $(this.timeSignatureContainerReference);
    var html = '<p class="time-signature-bottom">' + this.bottom + '</p>';

    timeSignatureContainer.append(html);
  };

  TimeSignature.prototype.setTimeSignatureBottomReference = function setTimeSignatureBottomReference() {
    var timeSignatureContainer = $(this.timeSignatureContainerReference);
    var bottom = timeSignatureContainer.children(".time-signature-bottom");
    this.timeSignatureTopReference = bottom;
  };

  TimeSignature.prototype.setTimeSignatureBottomCSS = function setTimeSignatureBottomCSS() {
    var bottom = $(this.timeSignatureTopReference);

    var lineHeight = $(this.bar.reference).height() / 2;
    var bottomCSS = { "display": "inline-block",
      "vertical-align": "top",
      "margin": "0px",
      "font-weight": "800",
      "line-height": lineHeight + "px",
      "font-size": lineHeight * 1.50 + "px",
      "display": "block"

    };

    bottom.css(bottomCSS);
  };

  return TimeSignature;
})();

exports["default"] = TimeSignature;
module.exports = exports["default"];

},{}]},{},[4]);
