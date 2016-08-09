import Bar from './bar';

class Instrument {
  constructor(notation, name) {
    this.notation = notation;
    this.name = this.initName(name);
    this.id = this.setId();
    this.bars = [];
    
    this.className = "instrument" //name has to be written without the period as when concaterated in a html class it won't work with it
    this.instrumentNameHTML = '<div class="' + this.className + '" id="' + String(this.id) + '">' +
                                  this.name +
                              '</div>';

    this.initialize();
  }
  
  newBar(){
    var bar = new Bar(this, this.currentNumberOfBars());
    this.bars.push(bar);
    bar.initialize();
  }
  
  //loops through each container, like name container and bar container, finds the instruments id and deletes all instances of it
  removeFromPage() {
    let containerChildren =  $(this.notation.container).children(); //gets all the bar and name containers
    
    for (let i = 0; i < containerChildren.length; i++) { //loops through the name and bar containers
      for (let i2 = 0; i2 < containerChildren[i].childNodes.length; i2++) { //containerchildren[i] or whatever simply returns the raw html, not an object for some reason.
        var element = containerChildren[i].childNodes[i2];
        
        if (this.id == element.id) { //double equals sign because the element.id is a string, saves a little bit of code
          console.log("match")
          element.remove();
        }
        
      }
    }
    

  }
  
  private
  
  initialize(){
    this.createName();
  }
  
  setId() {
    var nameContainerChildren = $(this.notation.container + " > .instrument-name-container").children();
    
    if (nameContainerChildren.length === 0) { //if the arrays empty, returns 0
      return 0; 
    }
    else { //if it's not empty, returns one greater than the last elements id, this is to stop a case where two elements get the same id if one was deleted
      return parseInt(nameContainerChildren.last().attr("id")) + 1;
    }
  }
  
  createName() {
    $(this.notation.container + " > .instrument-name-container").append(this.instrumentNameHTML);
    $(this.notation.container + " ." + this.className).css(this.getInstrumentNameCSS()) //applies dynamic css stuff to instrument-name class
  }
  
  //if a name wasn't passed through it will return a invisible character to maintain height, otherwise it will return the name
  initName(name) {
    if (name === undefined) { 
      return "&zwnj;"; //invisible character to maintain spacing
    }
    else {
      return name;
    }
  }
  
  //returns an id used in the addBar method, finds out how many bars already exist
  currentNumberOfBars(){
    return this.bars.length;
  }
  
  getInstrumentNameCSS() {
    return {"height": String(this.notation.barHeight) + "px",
            "margin": "4px",
            "padding": "4px 8px"
          }
  }
  

}

export default Instrument;