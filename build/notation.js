(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bar = (function () {
  function Bar(instrument, id) {
    _classCallCheck(this, Bar);

    this.instrument = instrument;
    this.notation = this.instrument.notation;
    this.id = id;

    this.containerClassName = "bar-container";
    this.className = "bar";

    this.barContainerHTML = '<div class="' + this.containerClassName + '" id="' + String(this.id) + '"></div>'; //container to be appended if it doesn't already exist
    this.barHTML = '<div class="' + this.className + '" id="' + String(this.instrument.id) + '">' + this.instrument.name + " - ID: " + String(this.id) + '</div>';

    //this.initialize(); //need to make this a public method and run it from the instrument class creating it, pushBar is counting the number of bars in the bars array on the isntrument, so it need sto push before it starts
  }

  Bar.prototype.initialize = function initialize() {
    this.checkIfBarContainerExists(); //checks if the bar container exists, before adding the bar
    this.pushBar();
  };

  Bar.prototype.redraw = function redraw() {};

  Bar.prototype.pushBar = function pushBar() {
    console.log("Pushing bar");
    var currentBars = $(this.notation.container + " > ." + this.containerClassName);
    var targetBar = currentBars.eq(this.id); //bar you will be appending to
    targetBar.append(this.barHTML);

    $(this.notation.container + " ." + this.className).css(this.getBarCSS());
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
    } else {
      console.warn("Bar container already exists");
    }
  };

  Bar.prototype.addBarContainer = function addBarContainer() {
    $(this.notation.container).append(this.barContainerHTML);
  };

  Bar.prototype.removeBarsFromContainer = function removeBarsFromContainer(target) {
    target.html("");
  };

  Bar.prototype.getBarCSS = function getBarCSS() {
    return { "height": String(this.notation.barHeight) + "px",
      "margin": "4px",
      "padding": "4px 8px"
    };
  };

  return Bar;
})();

exports["default"] = Bar;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
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

    this.className = "instrument"; //name has to be written without the period as when concaterated in a html class it won't work with it
    this.instrumentNameHTML = '<div class="' + this.className + '" id="' + String(this.id) + '">' + this.name + '</div>';

    this.initialize();
  }

  Instrument.prototype.newBar = function newBar() {
    var bar = new _bar2['default'](this, this.currentNumberOfBars());
    this.bars.push(bar);
    bar.initialize();
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
      "margin": "4px",
      "padding": "4px 8px"
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
    this.barHeight = 35;

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

  Notation.prototype.newInstrument = function newInstrument(name) {

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

},{"./instrument":2}]},{},[3]);
