import Instrument from './instrument';

class Notation {
  constructor(container, size) {
    
    this.trebleClefPath = "./media/clef.png";
    this.bassClefPath = "./media/bass.png";
    
    this.keySignature = "C";
    
    this.barHeight = 35; //height of bars and instrument name divs, can be fined when creatign the object but defaults to 35
    if (size !== undefined && typeof(size) === "number" && size > 0){
      this.barHeight = size;
    } //if size is a positive int will make barHeight that size;
    
    this.marginAboveBar = this.barHeight;
    this.marginUnderBar = this.barHeight;
    this.marginUnderBarContainer = 20; //the amount of padidng under the CONTAINERS (instrument name container, bar-container)
    
    
    if (container == undefined) { throw "You did not initiate Notation with a container" }
    this.container = container; //include the class or id of an element you wish to build the Notation in.
    
    this.barsContainer = "bars-container";
    this.instrumentNameContainer = "instrument-name-container"
    this.instruments = [];
    
    this.title;
    this.tempo;
    
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
    let width = $(this.container).width() - $("." + this.instrumentNameContainer).width() - this.barHeight * 2; //the clef not loading initially throws off the size of the container, and it's roughly the width of the bar height
    let css = {"display": "inline-block",
               "vertical-align": "top",
               "width": width + "px",
               "padding": 0,
               "margin": 0,
              }
            
    $("." + this.barsContainer).css(css);
  }
  
  //loops through bars and searches for breakpoints, adds conjoining lines/clefs etc
  resize(){
    $(this.container).find(".clef").remove(); //removes all the clefs already on the page
    $(this.container).find(".conjoining-line-container").remove() //removes all conjoining lines
    
    let barContainers = $(this.container + " > ." + this.barsContainer).children(); //all the bar containers
    
    for (let i = 0; i < barContainers.length; i++) {
      let currentBarX = barContainers.eq(i).offset().top;
      let previousBarX;
      
      //sets previous bar if the current bar is not the first
      if (i > 0) {
        previousBarX = barContainers.eq(i - 1).offset().top;
      }
      
     
      //adds the thicker line to the first bar of each line of bars
      if (currentBarX > previousBarX || previousBarX === undefined) {
        for (let i2 = 0; i2 < this.instruments.length; i2++) {
          
          let instrument = this.instruments[i2];
          let bar = instrument.bar(i + 1);
          instrument.bar(i + 1).addClef(); //bars are 1 indexed, not 0;
          
          //applies the thicker conjoining line to all bars but the last instrument
          if(!(instrument.id === this.instruments[this.instruments.length - 1].id)){
            instrument.bar(i + 1).addConjoiningLine("bold"); //the first line should be bold
            
            //if it's not the very first bar, add the end of bar conjoining line to the previous bar
            if(previousBarX !== undefined){
              instrument.bar(i).addConjoiningLine("end");
              
              let lastBar = instrument.bar(instrument.bars.length) //bars are 1 indexed, not 0, so no need to subtract one
              
              if(bar === lastBar){
                bar.addConjoiningLine("end");
              }
            }
          }
          
        }
      }
      //adds the other, thinner lines to every other bar
      else {
        for (let i2 = 0; i2 < this.instruments.length; i2++) {
          
          let instrument = this.instruments[i2];
          let bar = instrument.bar(i + 1);
          
          if(!(instrument.id === this.instruments[this.instruments.length - 1].id)){
            if (instrument.bar(i + 1) != undefined){ 
              
              instrument.bar(i + 1).addConjoiningLine();
              
              let lastBar = instrument.bar(instrument.bars.length) //bars are 1 indexed, not 0, so no need to subtract one
              
              if(bar === lastBar){
                bar.addConjoiningLine("end");
              }
            }
          }
          
        }
      }
      
      
    
      
      
    }
  }
  
  rtwo(){
      $(this.container).find(".clef").remove(); //removes all the clefs already on the page
      $(this.container).find(".conjoining-line-container").remove() //removes all conjoining lines
      
      let barContainers = $(this.container + " > ." + this.barsContainer).children(); //all the bar containers
      
      for (let i = 0; i < barContainers.length; i++) {
        let currentBarX = barContainers.eq(i).offset().top; //x position of current bar
        let previousBarX; //x position of previous bar to compare it against, this is not set for the first bar obviously
        
        //sets previous bar if the current bar is not the first
        if (i > 0) {
          previousBarX = barContainers.eq(i - 1).offset().top;
        }
        
       
        //adds the thicker line to the first bar of each line of bars
        for (let i2 = 0; i2 < this.instruments.length; i2++) {
          
          let instrument = this.instruments[i2];
          let bar = instrument.bar(i + 1);
          
          let prevBar;
          if (i != 0){
            prevBar = instrument.bar(i);
          }
          
          if(!(instrument.id === this.instruments[this.instruments.length - 1].id)){
            if (bar != undefined){ 
              bar.addConjoiningLine();
            }
            
            if(previousBarX !== undefined){
              prevBar.addConjoiningLine("end");
            }
          
            //if it's the last bar
            if(bar === instrument.bar(instrument.bars.length)){
              bar.addConjoiningLine("end");
            }
          }
          
          if (currentBarX > previousBarX || previousBarX === undefined) {
            
            
            bar.addClef(); //bars are 1 indexed, not 0;
            
            //applies the thicker conjoining line to all bars but the last instrument
            if(!(instrument.id === this.instruments[this.instruments.length - 1].id)){
              
              bar.addConjoiningLine("bold"); //the first line should be bold
            }
            
            //if it's not the very first bar, add the end of bar conjoining line to the previous bar
  
            
          }
          //adds the other, thinner lines to every other bar
          

          
        }

      }
    }
  
  setTitle(title){
    this.title = title;
    
    if (this.title === undefined){
      this.title = "";
    }
    
    this.setTitleContainer();
    
  }
  
  setTempo(tempo){
    this.tempo = tempo;
    
    if (this.tempo === undefined){
      this.tempo = "";
    }
    
    this.setTitleContainer();
    
  }
  

  
  private
  
  //stuff that is run when the object is created
  initialize(){ 
    this.setUpContainer();
    this.addNamesContainer();
    this.addBarsContainer();
  }
  
  setTitleContainer(){
    $(this.container).children(".title-container").remove(); //removes the old title container
    
    let html = '<div class="title-container">' +
                  '<h1 class="title">' +
                    this.title +
                  '</h1>' +
                  '<h4 class="tempo"><i>' +
                    this.tempo +
                  '</i></h4>' +
               '</div>';
               
    $(this.container).prepend(html);
    
    let topPadding = 0;
    let sidePadding = $(this.container).find(".instrument-name-container").width(); //should be in line with the instrument name container
    
    
    let titleContainerCSS = {"padding": topPadding + "px " + sidePadding + "px 0px",
                    
                    }
    
    let titleCSS = {"text-align":"center",
                    
                    }
                    
    let tempoCSS = {"text-align":"left",
                    "margin-bottom":"0px",
                    }
                    
    $(this.container).find(".title-container").css(titleContainerCSS);
    $(this.container).find(".title").css(titleCSS);
    $(this.container).find(".tempo").css(tempoCSS);
    
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