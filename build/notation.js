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
    this.barContainerReference;

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
    var currentBarContainers = $(this.notation.container + " > ." + this.notation.barsContainer + " > ." + this.containerClassName); //all bars
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
      this.addClef();
      this.changeKeySignature("sharps", 0);
      this.changeTimeSignature(4, 4); //default to a 4/4 time signature because i'm a pleb
    }
  };

  Bar.prototype.addClef = function addClef() {

    if ($(this.reference) === undefined) {
      throw "cannot add clef, bar reference is undefined (instrument: " + this.instrument.id + ", bar: " + this.id + ")";
    }
    var targetBar = $(this.reference);
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

    targetBar.children(".line-container").last().after(clefHTML); //append it after the last line-container otherwise
    targetBar.children(".clef").css(clefCSS);
  };

  Bar.prototype.addConjoiningLine = function addConjoiningLine(modifier) {
    /* modifiers
      "bold" the bold, "thicker" first conjoining line on each new segment
      "end" places a conjoining line at the end of the bar
    */

    //establish class names for the different modifiers, then append the html with the correct name
    var className = undefined;

    if (modifier === "bold") {
      className = "conjoining-line bold";
    } else if (modifier === "end") {
      className = "conjoining-line end";
    } else {
      className = "conjoining-line";
    }

    var html = '<div class="conjoining-line-container">' + '<div class="' + className + '">' + '</div>' + '</div>';

    $(this.reference).prepend(html);

    var left = undefined;
    var lineWidth = 1; //should set this dynamically probably
    var width = 1;
    var marginBottom = $(this.reference).css("margin-bottom");
    var height = parseInt($(this.reference).height() * 2) + parseInt(marginBottom.substr(0, marginBottom.length - 2)); //assumes the margin bottom is XXXpx and cuts off the px

    //declare the left padding value if the modifier is "end"
    if (modifier === "end") {
      var barWidth = $(this.reference).width();
      left = barWidth;
    }

    var conjoiningLineContainerCSS = { "width": 0,
      "height": 0
    };

    var conjoiningLineCSS = { "width": width + "px",
      "height": height + "px",
      "background-color": "black",
      "position": "relative",
      "right": lineWidth + "px"
    };

    var conjoiningLineCSSEnd = { "left": left + "px" };

    var conjoiningLineCSSBold = { "width": width * 2 + "px" };

    $(this.reference).children(".conjoining-line-container").css(conjoiningLineContainerCSS);
    $(this.reference).find(".conjoining-line").css(conjoiningLineCSS);

    $(this.reference).find(".end").css(conjoiningLineCSSEnd);

    $(this.reference).find(".bold").css(conjoiningLineCSSBold);
  };

  Bar.prototype.removeConjoiningLine = function removeConjoiningLine() {
    $(this.reference).children(".conjoining-line-container").remove();
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
    var currentBars = $(this.notation.container + " > ." + this.notation.barsContainer + " > ." + this.containerClassName);

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
    $(this.notation.container + " ." + this.notation.barsContainer).append(this.barContainerHTML);
    $(this.notation.container + " ." + this.containerClassName).css(this.getBarContainerCSS()); //probably quicker just to set all the bars css than to loop through them all and find the right one?
    this.addBarNumber();
  };

  Bar.prototype.addBarNumber = function addBarNumber() {

    //find the right bar container
    var barContainers = $(this.notation.container).find("." + this.containerClassName);

    for (var i = 0; i < barContainers.length; i++) {
      var barContainer = barContainers[i];

      if (barContainer.id == this.id) {
        //two equals because it's string to integer, maybe not safe
        this.barContainerReference = barContainer;
      }
    }

    //declare and append html
    var html = '<div class="number-container">' + '<p class="number">' + (parseInt(this.id) + 1) + '</p>' + '</div>';

    $(this.barContainerReference).prepend(html);

    //declare and apply css
    var containerCSS = { "height": "0px",
      "width": "0px"
    };

    var fontSize = this.notation.barHeight / 3;
    var leftPadding = fontSize / 2; //move it over a little
    var topPadding = this.notation.marginAboveBar - fontSize * 1.4; //some bullshit that kind of looks right

    var CSS = { "position": "relative",
      "top": topPadding + "px",
      "left": leftPadding + "px",
      "margin": "0",
      "padding": "0",
      "color": "#515197",
      "font-size": fontSize + "px"
    };

    $(this.barContainerReference).find(".number-container").css(containerCSS);
    $(this.barContainerReference).find(".number").css(CSS);
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

},{"./keySignature":4,"./note":6,"./timeSignature":7}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Beam = (function () {
  function Beam(note) {
    _classCallCheck(this, Beam);

    this.note = note;

    this.containerReferences = [];
    this.references = [];

    this.endNote;
    this.middleNotes = []; //array of any additional notes to be beamed between the first and last

    this.beamPointingUp;
    this.stemFacingDown;

    this.adj;
    this.opp;
    this.hyp;
    this.angle;

    this.initialize();
  }

  Beam.prototype.initialize = function initialize() {
    this.printBeamContainer();
    this.printBeam();
    this.unjoinedBeam();
  };

  Beam.prototype.beamTo = function beamTo(endNote) {
    if (endNote === undefined) {
      throw "Beam.beamTo() must be given a target note";
    } else {
      this.endNote = endNote;
    }

    //if there are any notes between the start and endNote place them in an array
    if (endNote.noteContainerID - 1 !== this.note.noteContainerID) {
      this.getMiddleNotes();
    }

    this.checkNotesAreValid();
    this.removeBeamCSS();
    this.pickStemDirection();
    this.calculate();
    this.resizeMiddleNotes();

    this.applyFirstNoteBeams(); //do first one seperates since it cant beam backwards? might be best to meld this in the the next method
    this.sortNoteBeams();
  };

  Beam.prototype.unjoinedBeam = function unjoinedBeam() {
    //current size i'm using for the curved unjoined beams
    var size = this.note.notation.barHeight / 5;
    if (this.note.noteParameters.stemDirection === "down") {
      this.stemFacingDown = true;
    } else {
      this.stemFacingDown = false;
    }
    //no rotation, size of unjoined beam, the top/bottom offset beam, whether or not it is an unjoined beam

    for (var i = 0; i < this.containerReferences.length; i++) {
      var container = this.containerReferences[i];
      var stem = this.references[i];

      var additionalOffset = size / 2 * i;
      $(container).css(this.getBeamContainerCSS(0, size * 1, size / 1.5 + additionalOffset, true));
      $(stem).css(this.getUnjoinedBeamCSS(size));
    }
  };

  Beam.prototype.applyFirstNoteBeams = function applyFirstNoteBeams() {
    //Apply the main beam that stretches across all the notes in the grouping, these values are calculated in the calculate() function
    $(this.containerReferences[0]).css(this.getBeamContainerCSS(this.angle));
    $(this.references[0]).css(this.getBeamCSS(this.hyp));

    //then calculate the beam between the first and second note (which may be different if the grouping is more than two notes)
    var nextNote = undefined;

    if (this.middleNotes.length === 0) {
      nextNote = this.endNote;
    } else {
      nextNote = this.middleNotes[0];
    }

    var offset = this.note.notation.barHeight / 10;
    var lowerBeamHeight = 2;

    //adds some additional padding to the 16th note beam on beams that are above notes
    var topBeamHeightFix = 0;
    if (this.stemFacingDown === false) {
      topBeamHeightFix = 2;
    }

    var stem = $(this.note.noteStemReference);
    var nextStem = $(nextNote.noteStemReference);

    var opp = nextStem.offset().left - stem.offset().left;
    var adj = undefined;

    if (this.stemFacingDown) {
      adj = nextStem.offset().top + nextStem.height() - (stem.offset().top + stem.height());
    } else {
      adj = nextStem.offset().top - stem.offset().top;
    }

    var hyp = Math.sqrt(adj * adj + opp * opp);

    //get any other beams from the root note, minus the first, hence index starts at 1 not 0
    for (var i = 1; i < this.references.length; i++) {
      var container = $(this.containerReferences[i]);
      var beam = $(this.references[i]);

      var width = undefined;

      if (nextNote.beam.containerReferences.length > i) {
        width = hyp;
      } else {
        width = hyp / 4;
      }
      //rotation, size of unjoined beam, the top/bottom offset beam, whether or not it is an unjoined beam
      container.css(this.getBeamContainerCSS(this.angle, undefined, topBeamHeightFix + offset * i, false));
      beam.css(this.getBeamCSS(width, lowerBeamHeight));
    }
  };

  Beam.prototype.sortNoteBeams = function sortNoteBeams() {

    var fullArray = this.middleNotes;fullArray.push(this.endNote);fullArray.unshift(this.note);

    for (var i = 1; i < fullArray.length; i++) {
      var prevNote = fullArray[i - 1];
      var currNote = fullArray[i];
      var nextNote = fullArray[i + 1];

      var prevNoteBeams = prevNote.beam.references;
      var currNoteBeams = currNote.beam.references;
      var nextNoteBeams = nextNote ? nextNote.beam.references : undefined;

      var prevNoteStem = prevNote.noteStemReference;
      var currNoteStem = currNote.noteStemReference;
      var nextNoteStem = nextNote ? nextNote.noteStemReference : undefined;

      ///if the final note

      var beam_back = false;
      var beam_all_forward = false;
      var beam_shared_forward = false;

      if (nextNote === undefined) {
        //beam EVERYTHING BACK
        //beam NOTHING FORWARD
        beam_back = true;
        beam_all_forward = false;
        beam_shared_forward = false;
      } else if (currNoteBeams.length >= nextNoteBeams.length) {
        //beam EVERYTHING BACK
        //beam anything the next note has forward
        beam_back = true;
        beam_all_forward = false;
        beam_shared_forward = true;
      } else if (currNoteBeams.length < nextNoteBeams.length) {
        //beam NOTHING back
        //beam everything forward
        beam_back = false;
        beam_all_forward = true;
        beam_shared_forward = false;
      }

      for (var i2 = 1; i2 < currNoteBeams.length; i2++) {
        var nextContainer = nextNote.beam.containerReferences[i2] || undefined;

        var container = currNote.beam.containerReferences[i2];
        var beam = currNote.beam.references[i2];

        var opp = nextNoteStem.offset().left - currNoteStem.offset().left;
        var adj = undefined;

        if (this.stemFacingDown) {
          adj = nextNoteStem.offset().top + nextNoteStem.height() - (currNoteStem.offset().top + currNoteStem.height());
        } else {
          adj = nextNoteStem.offset().top - currNoteStem.offset().top;
        }

        var hyp = Math.sqrt(adj * adj + opp * opp);

        if (nextContainer) {}
      }
    }
  };

  Beam.prototype.checkNotesAreValid = function checkNotesAreValid() {
    var allNotesValid = true;
  };

  //removes the css from unjoined beams before joining

  Beam.prototype.removeBeamCSS = function removeBeamCSS() {

    //remove the unjoined beam CSS from all the beamed notes
    $(this.note.noteReference).find(".beam").removeAttr('style');
    $(this.endNote.noteReference).find(".beam").removeAttr('style');

    for (var i = 0; i < this.middleNotes.length; i++) {
      var middleNote = $(this.middleNotes[i].noteReference).find(".beam");

      middleNote.removeAttr('style');
    }
  };

  //if there are more than two notes beamed together, get the notes between the first note and final note and push them in this.middleNotes

  Beam.prototype.getMiddleNotes = function getMiddleNotes() {
    var bar = this.note.bar;

    for (var i = this.note.noteContainerID; i < this.endNote.noteContainerID - 1; i++) {
      var note = bar.note(i + 2); //plus 2 because we want the note after the current one, and another + 1 because the Bar.note() method is 1 indexed note 0 indexed

      if (note === undefined) {
        throw "unable to find note in Beam.getMiddleNotes()";
      } else {
        this.middleNotes.push(note);
      }
    }
  };

  //ensures all notes stems are in the same direction before they are beamed

  Beam.prototype.pickStemDirection = function pickStemDirection() {

    //currently, if any note stems face down, make all notes being beamed face down

    //check if any of the notes stem downwards
    this.stemFacingDown = false;

    if (this.note.noteParameters.stemDirection === "down") {
      this.stemFacingDown = true;
    } else if (this.endNote.noteParameters.stemDirection === "down") {
      this.stemFacingDown = true;
    }

    if (this.stemFacingDown === false) {
      for (var i = 0; i < this.middleNotes.length; i++) {
        var note = this.middleNotes[i];

        if (note.noteParameters.stemDirection === "down") {
          this.stemFacingDown = true;
        }
      }
    } //loops through the other beamed notes, only called if neither of the previous two if statements were true

    //if any of them did face down, make all notes face down

    if (this.stemFacingDown === true) {
      this.note.changeStemDirection("down");
      this.endNote.changeStemDirection("down");

      for (var i = 0; i < this.middleNotes.length; i++) {

        var note = this.middleNotes[i];

        note.changeStemDirection("down");
      }
    }
  };

  //decides wether to use the normal beam (slanted/flat) or use the type that sits along the bottom/top of the bar if the notes are all over the place

  Beam.prototype.pickBeamType = function pickBeamType() {};

  //calculates angles and lengths of main beam between first and last

  Beam.prototype.calculate = function calculate() {
    var targetNote = this.endNote;
    if (targetNote === undefined) {
      throw "Beam.calculate: Beam.endNote was not defined";
    }

    var firstNote = $(this.note.noteStemReference).offset();
    var secondNote = $(targetNote.noteStemReference).offset();

    this.beamPointingUp = true;

    this.adj = secondNote.left - firstNote.left;

    this.opp = firstNote.top - secondNote.top;
    if (this.opp < 0) {
      //if the second note has a lower x axis than the first and the beam needs to point down
      this.opp = Math.abs(this.opp);
      this.beamPointingUp = false;
    } //makes the opp a positive number if it is negative

    this.hyp = Math.sqrt(this.adj * this.adj + this.opp * this.opp);

    this.angle = Math.atan(this.opp / this.adj) * 180 / Math.PI;

    var spaceHeight = $(this.note.barReference).height() / 4; //height of the spaces in a bar/height of a note head. this will be the maxium "height" of a beam

    //if the slope of the beam is too steep, set it to the max then recalculate the hyp
    if (this.opp > spaceHeight) {
      this.angle = Math.atan(spaceHeight / this.adj) * 180 / Math.PI;
      this.hyp = Math.sqrt(this.adj * this.adj + spaceHeight * spaceHeight);

      //if the beam needed to be set to the max angle, then the second stem wont be connected to it, stems need to be shortened/lengthened
      this.resizeFirstAndLastStems(this.opp - spaceHeight); //this.opp - spaceheight will be the gap between the second note and the stem
    }

    //round to 2 decimal places
    this.angle = this.angle.toFixed(1);
  };

  //fixes the length of the first and last stems if the stem angle needed to be readjusted

  Beam.prototype.resizeFirstAndLastStems = function resizeFirstAndLastStems(space) {

    var first = $(this.note.noteHeadReference).offset().top;
    var second = $(this.endNote.noteHeadReference).offset().top;

    //make first note taller
    if (this.stemFacingDown && first < second || this.stemFacingDown === false && first > second) {
      var currentHeight = $(this.note.noteStemReference).height();
      this.note.setNoteStemCSS(currentHeight + space);
    }
    //make second note taller
    else {
        var currentHeight = $(this.note.noteStemReference).height();
        this.endNote.setNoteStemCSS(currentHeight + space);
      }
  };

  Beam.prototype.resizeMiddleNotes = function resizeMiddleNotes() {

    var firstNote = this.note;
    var beamWidth = 2;

    for (var i = 0; i < this.middleNotes.length; i++) {
      var middleNote = this.middleNotes[i];

      var opp = $(middleNote.noteStemReference).offset().left - $(firstNote.noteStemReference).offset().left;
      var adj = opp / Math.tan((90 - this.angle) * Math.PI / 180); // opp/tan(angle) 90- this.angle because the angle applied to the css is the outside angle, I need the inside. note Math.PI/180 is the opposite of the function used on the one above

      var targetPos = undefined; //Position along beam where the middle notes stem needs to be cut/extended to
      var currentPos = undefined; //current location of the top/bottom of the middle note
      var currentHeight = $(middleNote.noteStemReference).height();

      if (this.stemFacingDown) {
        var bottomOfStem = $(this.note.noteStemReference).offset().top + $(this.note.noteStemReference).height();
        currentPos = $(middleNote.noteStemReference).offset().top + $(middleNote.noteStemReference).height();

        if (this.beamPointingUp) {
          targetPos = bottomOfStem - adj;
        } else {
          targetPos = bottomOfStem + adj;
        }

        middleNote.setNoteStemCSS(currentHeight + (targetPos - currentPos));
      } else {
        var topOfStem = $(this.note.noteStemReference).offset().top;
        currentPos = $(middleNote.noteStemReference).offset().top;

        if (this.beamPointingUp) {
          targetPos = topOfStem - adj;
        } else {
          targetPos = topOfStem + adj;
        }

        middleNote.setNoteStemCSS(currentHeight + (currentPos - targetPos - beamWidth));
      }
    }
  };

  Beam.prototype.printBeamContainer = function printBeamContainer() {
    var numberOfContainers = 1;

    switch (this.note.duration) {
      case "eighth":
        numberOfContainers = 1;
        break;
      case "sixteenth":
        numberOfContainers = 2;
        break;
      case "thirty-second":
        numberOfContainers = 3;
        break;
      case "sixty-fourth":
        numberOfContainers = 4;
        break;
    }

    for (var i = 0; i < numberOfContainers; i++) {
      var html = '<div class="beam-container"></div>';

      $(this.note.noteStemReference).prepend(html);
      this.containerReferences.push($(this.note.noteStemReference).children().eq(0));
    }
  };

  Beam.prototype.printBeam = function printBeam() {

    for (var i = 0; i < this.containerReferences.length; i++) {
      var html = '<div class="beam"></div>';
      var containerReference = this.containerReferences[i];
      $(containerReference).append(html);
      this.references.push($(containerReference).children());
    }
  };

  Beam.prototype.getBeamContainerCSS = function getBeamContainerCSS(rotate, setBeamHeight, setBeamOffset, isUnjoinedBeam) {
    //setBeamHeight for unjoined beams, setBeamOffset for unjoined beams also
    var beamHeight = 3;
    var beamOffset = 0;
    var top = 0;

    if (setBeamHeight != undefined) {
      if (typeof setBeamHeight != "number" || setBeamHeight < 1) {
        throw "in beam.setBeamContainerCSS() setBeamHeight must be a number over 0";
      }
      beamHeight = setBeamHeight;
    }

    if (setBeamOffset != undefined) {
      if (typeof setBeamOffset != "number") {
        throw "in beam.setBeamContainerCSS() setBeamOffset must be a number";
      }
      beamOffset = setBeamOffset;
    }

    if (this.stemFacingDown === true) {
      var noteStemHeightRaw = $(this.note.noteReference).find(".note-stem").css("height");
      var noteStemHeightInt = parseInt($(this.note.noteReference).find(".note-stem").css("height").substr(0, noteStemHeightRaw.length - 2)); //shaves of the "px"
      top = noteStemHeightInt - beamHeight - beamOffset;
    } else {
      //width of the unjoined beam at it's thickest, should pull this form somewhere else when I'm calculating the width programatically
      var unjoinedBeamWidth = 0; //shouldn't be applied to beams that arent providing the setBeamOffset attribute, as they are not unjoined
      if (isUnjoinedBeam === true) {
        unjoinedBeamWidth = 2;
      }

      top = top + beamOffset - unjoinedBeamWidth;
    }

    if (this.beamPointingUp == true) {
      rotate = rotate - rotate - rotate; //turns it into a negative number, which makes the beam point up. 
    }

    var css = { "height": "0px",
      "width": "0px",
      "transform": "rotate(" + rotate + "deg)",
      "position": "relative",
      "top": top + "px"
    };

    return css;
  };

  Beam.prototype.getBeamCSS = function getBeamCSS(width, height, moveRight) {
    var beamHeight = 3;
    var stemWidth = 1;
    var right = 0;

    if (height !== undefined) {
      if (typeof height !== "number" || height < 0) {
        throw "in beam.getBeamCSS(): height provided was not a number greater than 0";
      }
      beamHeight = height;
    }

    if (moveRight !== undefined) {
      if (typeof moveRight !== "number") {
        throw "in beam.getBeamCSS(): moveRight provided was not a number";
      }
      right = moveRight;
    }

    var css = { "height": beamHeight + "px",
      "width": width + stemWidth + "px",
      "background-color": "black",
      "position": "relative",
      "right": right
    };

    return css;
    //$(this.reference).css(css);
  };

  //sets CSS for beam "tails" on unjoined 8th notes etc

  Beam.prototype.getUnjoinedBeamCSS = function getUnjoinedBeamCSS(size) {
    if (size === undefined) {
      throw "in beam.setUnjoinedBeamCSS() you must set a size";
    } else if (typeof size !== "number" && size > 0) {
      throw "in beam.setUnjoinedBeamCSS the value provided must be a number greater than 0";
    }
    var beamWidth = 1;

    var css = undefined;

    if (this.stemFacingDown === true) {
      css = { "height": size * 1,
        "width": size,
        "background-color": "transparent",
        "border-bottom": beamWidth * 2 + "px solid black",
        "border-right": beamWidth + "px solid black",
        "border-radius": "0px 0px " + size + "px"
      };
    } else {
      css = { "height": size * 1,
        "width": size,
        "background-color": "transparent",
        "border-top": beamWidth * 2 + "px solid black",
        "border-right": beamWidth + "px solid black",
        "border-radius": "0px " + size + "px 0px"
      };
    }

    return css;
  };

  return Beam;
})();

exports["default"] = Beam;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
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

},{"./bar":1}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _instrument = require('./instrument');

var _instrument2 = _interopRequireDefault(_instrument);

var Notation = (function () {
  function Notation(container, size) {
    _classCallCheck(this, Notation);

    this.trebleClefPath = "./media/clef.png";
    this.bassClefPath = "./media/bass.png";

    this.keySignature = "C"; //default key signature is C, no sharps or flats

    this.barHeight = 35; //height of bars and instrument name divs, can be defined when creatign the object but defaults to 35
    if (size !== undefined && typeof size === "number" && size > 0) {
      this.barHeight = size;
    } //if size is a positive int will make barHeight that size;

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

    this.title;
    this.tempo;

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

  //makes

  Notation.prototype.setBarsContainerCSS = function setBarsContainerCSS() {
    var width = $(this.container).width() - $("." + this.instrumentNameContainer).width() - this.barHeight * 2; //the clef not loading initially throws off the size of the container, and it's roughly the width of the bar height
    var css = { "display": "inline-block",
      "vertical-align": "top",
      "width": width + "px",
      "padding": 0,
      "margin": 0
    };

    $("." + this.barsContainer).css(css);
  };

  //loops through bars and searches for breakpoints, adds conjoining lines/clefs etc

  Notation.prototype.resize = function resize() {
    $(this.container).find(".clef").remove(); //removes all the clefs already on the page
    $(this.container).find(".conjoining-line-container").remove(); //removes all conjoining lines

    var barContainers = $(this.container + " > ." + this.barsContainer).children(); //all the bar containers

    for (var i = 0; i < barContainers.length; i++) {
      var currentBarX = barContainers.eq(i).offset().top; //x position of current bar
      var previousBarX = undefined; //x position of previous bar to compare it against, this is not set for the first bar obviously

      //sets previous bar if the current bar is not the first
      if (i > 0) {
        previousBarX = barContainers.eq(i - 1).offset().top;
      }

      //adds the thicker line to the first bar of each line of bars
      for (var i2 = 0; i2 < this.instruments.length; i2++) {

        var instrument = this.instruments[i2];
        var bar = instrument.bar(i + 1);

        var prevBar = undefined;
        if (i != 0) {
          prevBar = instrument.bar(i);
        }

        if (!(instrument.id === this.instruments[this.instruments.length - 1].id)) {
          if (bar != undefined) {
            bar.addConjoiningLine();
          }

          if (previousBarX !== undefined) {
            prevBar.addConjoiningLine("end");
          }

          //if it's the last bar
          if (bar === instrument.bar(instrument.bars.length)) {
            bar.addConjoiningLine("end");
          }
        }

        if (currentBarX > previousBarX || previousBarX === undefined) {

          bar.addClef(); //bars are 1 indexed, not 0;

          //applies the thicker conjoining line to all bars but the last instrument
          if (!(instrument.id === this.instruments[this.instruments.length - 1].id)) {

            bar.addConjoiningLine("bold"); //the first line should be bold
          }

          //if it's not the very first bar, add the end of bar conjoining line to the previous bar
        }
        //adds the other, thinner lines to every other bar
      }
    }
  };

  Notation.prototype.setTitle = function setTitle(title) {
    this.title = title;

    if (this.title === undefined) {
      this.title = "";
    }

    this.setTitleContainer();
  };

  Notation.prototype.setTempo = function setTempo(tempo) {
    this.tempo = tempo;

    if (this.tempo === undefined) {
      this.tempo = "";
    }

    this.setTitleContainer();
  };

  //stuff that is run when the object is created

  Notation.prototype.initialize = function initialize() {
    this.setUpContainer();
    this.addNamesContainer();
    this.addBarsContainer();

    //starts up functions that deal with resizing/breaking bars
    this.enableResizeFunctions();
  };

  Notation.prototype.setTitleContainer = function setTitleContainer() {
    $(this.container).children(".title-container").remove(); //removes the old title container

    var html = '<div class="title-container">' + '<h1 class="title">' + this.title + '</h1>' + '<h4 class="tempo"><i>' + this.tempo + '</i></h4>' + '</div>';

    $(this.container).prepend(html);

    var topPadding = 0;
    var sidePadding = $(this.container).find(".instrument-name-container").width(); //should be in line with the instrument name container

    var titleContainerCSS = { "padding": topPadding + "px " + sidePadding + "px 0px"

    };

    var titleCSS = { "text-align": "center"

    };

    var tempoCSS = { "text-align": "left",
      "margin-bottom": "0px"
    };

    $(this.container).find(".title-container").css(titleContainerCSS);
    $(this.container).find(".title").css(titleCSS);
    $(this.container).find(".tempo").css(tempoCSS);
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

  Notation.prototype.enableResizeFunctions = function enableResizeFunctions() {

    var n = this; //cant use this inside a jquery window function

    //need to remove this timeout fix after I replace the clef images with SVGs or something
    setTimeout(function () {
      n.setBarsContainerCSS();
      n.resize();
    }, 1000);

    $(window).resize(function () {
      n.setBarsContainerCSS();
      n.resize();
    });
  };

  Notation.prototype.changeBarPadding = function changeBarPadding(val) {

    if (this.instruments.length < 1) {
      throw "Cannot redraw bar height if there are no instruments ( in Notation.changeBarPadding() )";
    }

    this.marginAboveBar = val;
    this.marginUnderBar = val;

    //apply new margin to bars
    var css = { "margin-bottom": String(this.marginUnderBar) + "px",
      "margin-top": String(this.marginAboveBar) + "px"
    };

    $(this.container + " .bar").css(css);

    //apply the same css to the instrument names, except for the first one which needs the this.barHeight shaved of the top margin to align everything properly
    var instrumentNames = $(this.container + " .instrument-name");

    for (var i = 0; i < instrumentNames.length; i++) {
      var instrumentName = instrumentNames.eq(i);
      if (instrumentName.attr("id") === "0") {
        instrumentName.css({ "margin-bottom": String(this.marginUnderBar) + "px",
          "margin-top": String(this.marginAboveBar - this.barHeight) + "px"
        });
      } else {
        instrumentName.css(css);
      }
    }

    //remove and redraw bar numbers
    $(this.container + " .number-container").remove();

    //only need to do it for the first instrument

    var firstInstrument = this.instruments[0];
    console.log(firstInstrument);

    for (var i = 0; i < firstInstrument.bars.length; i++) {
      var bar = firstInstrument.bars[i];
      bar.addBarNumber();
    }
  };

  return Notation;
})();

window.Notation = Notation; //makes the module global
exports["default"] = Notation;
module.exports = exports["default"];

},{"./instrument":3}],6:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _beam = require("./beam");

var _beam2 = _interopRequireDefault(_beam);

var Note = (function () {
  function Note(bar, pitch, duration, parentNote) {
    _classCallCheck(this, Note);

    this.bar = bar;
    this.notation = this.bar.instrument.notation;
    this.beam;

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

    //the container for the note head, there may be many in each note-container dfg
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

    if (this.duration !== "whole-note" && this.duration !== "half-note" && this.duration !== "quarter-note") {
      this.beam = new _beam2["default"](this);
    }
  };

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

  //optional height for changes later

  Note.prototype.setNoteStemCSS = function setNoteStemCSS(height) {
    $(this.noteStemReference).css(this.getNoteStemCSS(height));
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
      case "whole":
        widthMultiplier = 2;
        break;
      case "half":
        widthMultiplier = 1.3;
        break;
      case "quarter":
        widthMultiplier = 1.1;
        break;
      case "eighth":
        widthMultiplier = 0.90;
        break;
      case "sixteenth":
        widthMultiplier = 0.70;
        break;
      case "thirty-second":
        widthMultiplier = 0.60;
        break;
      case "sixty-fourth":
        widthMultiplier = 0.50;
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

    //tweaks positioning of note head slightly
    var noteHeadPadding = noteHeadHeight / 8;

    if (this.duration === "whole-note" || this.duration === "half-note") {
      background = "transparent";
    } else {
      background = "black";
    }

    return {
      "height": noteHeadHeight * 0.71 + "px",
      "width": noteHeadHeight * 1.02 + "px",
      "box-sizing": "border-box",
      "border": "2px solid black",
      "border-width": "2px 1px",
      "border-radius": "50px",
      "transform": "rotate(-15deg)",
      "margin": "auto",
      "position": "relative",
      "top": "" + (noteHeadHeight * this.noteParameters.topOffset + noteHeadPadding) + "px",
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

  Note.prototype.getNoteStemCSS = function getNoteStemCSS(height) {
    var noteHeadHeight = $(this.barReference).height() / 4; //same as the distance between lines
    var stemWidth = 1;
    var stemHeight = noteHeadHeight * 3;

    if (height !== undefined) {
      stemHeight = height;
    }

    var left = undefined;
    var bottom = undefined;

    if (this.noteParameters.stemDirection === "up") {
      left = noteHeadHeight * 1.05 - stemWidth - 1; // the addiontal minus 1 just seems to do the trick
      bottom = stemHeight;
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

  Note.prototype.changeStemDirection = function changeStemDirection(direction) {
    //if you specify a direction it will change the stem to that direction if it isn't already facing that way

    //throw error if the stem doesn't already have a defined direction
    if (this.noteParameters.stemDirection === undefined) {
      throw "in note.changeStemDirection(): the stem direction can not be changed as one was not defined";
    }

    //call this section if direction is undefined
    if (direction === "up") {
      if (this.noteParameters.stemDirection !== "up") {
        this.noteParameters.stemDirection = "up";
      }
    } else if (direction === "down") {
      if (this.noteParameters.stemDirection !== "down") {
        this.noteParameters.stemDirection = "down";
      }
    } else if (direction === undefined) {
      //flip the stem direction
      if (this.noteParameters.stemDirection === "up") {
        this.noteParameters.stemDirection = "down";
      } else if (this.noteParameters.stemDirection === "down") {
        this.noteParameters.stemDirection = "up";
      }
    } else {
      throw "a valid parameter was not passed to Note.changeStemDirection() [parameter passed: " + direction;+"]";
    }

    //reapply the css to the stem
    this.setNoteStemCSS();
  };

  return Note;
})();

exports["default"] = Note;
module.exports = exports["default"];

},{"./beam":2}],7:[function(require,module,exports){
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

},{}]},{},[5]);
