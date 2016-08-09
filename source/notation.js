import Instrument from './instrument';

class Notation {
  constructor(container) {
    this.instrumentNameContainerHTML = '<div class="instrument-name-container"></div>';
    this.barHeight = 35;
    
    if (container == undefined) { throw "You did not initiate Notation with a container" }
    this.container = container; //include the class or id of an element you wish to build the Notation in.
    this.instruments = [];
    
    this.initialize();
  }
  
  addBar(){ //adds a bar to every current instrument
    for (let i = 0; i < this.instruments.length; i++){
      let instrument = this.instruments[i];
      
      instrument.createNewBar()
    }
  }
  
  newInstrument(name) {
    let i = new Instrument(this, name); //create new instrument
    this.instruments.push(i); //add it to the container 
    return i;
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
  }
  
  
  private
  
  //stuff that is run when the object is created
  initialize(){ 
    this.setUpContainer();
    this.addNamesContainer();
  }
  
  //empties the container when Notation is initiated
  setUpContainer(){ 
    $(this.container).html(" ");
  }
  
  //Adds the container that will contain the names of the instruments to the far left of the container, the number of instrument elements in this container is used to set the ids of instrument elements
  addNamesContainer() {
    $(this.container).append(this.instrumentNameContainerHTML);
  } 
  

}

window.Notation = Notation; //makes the module global
export default Notation;