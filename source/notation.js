import Instrument from './instrument';

class Notation {
  constructor(container) {
    
    this.trebleClefPath = "./media/clef.png";
    this.bassClefPath = "./media/bass.png";
    
    this.keySignature = "C";
    
    this.barHeight = 35; //height of bars and instrument name divs
    this.marginAboveBar = this.barHeight;
    this.marginUnderBar = this.barHeight;
    this.marginUnderBarContainer = 20; //the amount of padidng under the CONTAINERS (instrument name container, bar-container)
    
    
    if (container == undefined) { throw "You did not initiate Notation with a container" }
    this.container = container; //include the class or id of an element you wish to build the Notation in.
    
    this.barsContainer = "bars-container";
    this.instrumentNameContainer = "instrument-name-container"
    this.instruments = [];
    
    this.initialize();
  }
  
  addBar(){ //adds a bar to every current instrument
    for (let i = 0; i < this.instruments.length; i++){
      let instrument = this.instruments[i];
      instrument.newBar()
    }
  }
  
  //creates a new instrument and pushes it to the instruments array, name is optional. 
  //If it is not the first instrument to be added, this function will check to see the current number of bars and add those to the new instrument also.
  addInstrument(name, clef) {
    
    let instrument = new Instrument(this, name, clef); //create new instrument

    if(this.instruments.length != 0) { //checks if another instrument exists
    
      let numberOfBarsToAdd = this.instruments[0].bars.length; //can be any instrument as they'll all have the same length, so [0]
      
      for (let i = 0; i < numberOfBarsToAdd; i++){ //adds that number of bars, so if there are no bars yet it will do nothing
        instrument.newBar();
      }
      
    }
    else {
      instrument.newBar(); //each instrument should have at least one bar, for clefs, time sigs etc
    }
    
    this.instruments.push(instrument); //add it to the container
    return instrument; //returns the object so it can be saved to a variable
  }
  
  
  //delete instrument by the name, the id or the object
  removeInstrument(identifer) {
    let instrumentToDeleteIndex; //if === undefined at the end, no match was found for that instrument
    
    if (typeof identifer === "string") {
      
      for(let i = 0; i < this.instruments.length; i++) {
        if (this.instruments[i].name === identifer) {
          console.log("match found (name)")
          instrumentToDeleteIndex = i;
        }
      }
      
    }
    else if (typeof identifer === "number") {
      
      for(let i = 0; i < this.instruments.length; i++) {
        if (this.instruments[i].id === identifer) {
          console.log("match found (id)")
          instrumentToDeleteIndex = i;
        }
      }
      
    }
    else if (typeof identifer === "object") {
      
      for(let i = 0; i < this.instruments.length; i++) {
        if (this.instruments[i] === identifer) {
          console.log("match found (object)")
          instrumentToDeleteIndex = i;
        }
      }
      
    }
    else {
      throw "You must pass an id(integer), object or name(string) to removeInstrument() to delete an instrument";

    }
    
    if (instrumentToDeleteIndex != undefined){
      let instrumentToDelete = this.instruments[instrumentToDeleteIndex];
      this.instruments.splice(instrumentToDeleteIndex, 1);
      instrumentToDelete.removeFromPage();
    }
    
    this.removeEmptyBarContainers(); //runs the remove empty bar containers functions to REMOVE EMPTY BARS
  }
  
  setBarsContainerCSS(){
    let width = $(this.container).width() - $("." + this.instrumentNameContainer).width();
    let css = {"display": "inline-block",
               "vertical-align": "top",
               "width": width + "px",
               "padding": 0,
               "margin": 0,
              }
            
    $("." + this.barsContainer).css(css);
  }
  
  setBarClefs(){
    $(this.container).find(".clef").remove();
  }
  
  
  private
  
  //stuff that is run when the object is created
  initialize(){ 
    this.setUpContainer();
    this.addNamesContainer();
    this.addBarsContainer();
  }
  
  //empties the container when Notation is initiated
  setUpContainer(){ 
    $(this.container).html(" ");
  }
  
  //Adds the container that will contain the names of the instruments to the far left of the container, the number of instrument elements in this container is used to set the ids of instrument elements
  addNamesContainer() {
    let HTML = '<div class="instrument-name-container"></div>';
    
    $(this.container).append(HTML);
    $(".instrument-name-container").css(this.getInstrumentNameContainerCSS());
  }
  
  addBarsContainer() {
    let HTML = '<div class="' + this.barsContainer + '"></div>';
    
    $(this.container).append(HTML);
    this.setBarsContainerCSS();
        
  }
  getInstrumentNameContainerCSS(){
    return {"display": "inline-block",
            "vertical-align": "top",
            "margin-top": this.marginAboveBar + "px",
            "margin-bottom": this.marginUnderBarContainer + "px",
        
            }
  }
  

  
  //removes empty bar containers after deleting instruments or bars
  removeEmptyBarContainers() {
    let barContainers = $(".bar-container");
    
    for (let i = 0; i < barContainers.length; i ++){
      let bar = barContainers.eq(i);
      
      if (bar.children().length === 0) {
        bar.remove();
      }
    }
  }
  

}

window.Notation = Notation; //makes the module global
export default Notation;