import Note from "./note";

class Bar {
  constructor(instrument, id){
    this.instrument = instrument;
    this.notation = this.instrument.notation;
    this.id = id;
    this.notes = [];
    this.reference;
    
    this.containerClassName = "bar-container";
    this.className = "bar";
    
    this.barContainerHTML = '<div class="' + this.containerClassName + '" id="' + String(this.id) + '"></div>'; //container to be appended if it doesn't already exist
    this.barHTML =  '<div class="' + this.className + '" id="' + String(this.instrument.id) + '">' + '</div>';
    
    this.heightOfLines = 1;
    this.widthOfBarLines = 1;
    

  }
  
  //need to make this a public method and run it from the instrument class creating it, pushBar is counting the number of bars in the bars array on the isntrument, so it need sto push before it starts
  initialize(){
    this.checkIfBarContainerExists(); //checks if the bar container exists, before adding the bar
    this.printBar();
  }
  
  addNote() {
    let note = new Note(this.reference);
    note.pitch = "A";
    note.octave = 3;
    note.initialize();
    
    this.notes.push(note);
  }
  
  
  
  
  printBar(){
    let currentBarContainers = $(this.notation.container + " > ." + this.containerClassName) //all bars
    let targetBarContainer = currentBarContainers.eq(this.id); //bar you will be appending to
    
    targetBarContainer.append(this.barHTML); //append the bar to the bar container
    
    //now loop through the bar container to get your new bar you just added by the instrument id
    let newBar; //where the bar will be stored
    
    for(let i = 0; i < targetBarContainer.children().length; i++){
      let targetBar = targetBarContainer.children()[i];
 
      if (targetBar.id == this.instrument.id) {
        newBar = targetBar
      }
      
    }
    
    this.reference = newBar; //jquery object for the bar, pass it to a this variable so i can use it later in the note
    
    $(newBar).css(this.getBarCSS()) //sets the bars css
    this.createLines(newBar); //adds lines to it
  }
  
  
  
  
  private
  
  
  //chcecks if a bar container already exists, so multiples do not get added
  checkIfBarContainerExists(){
    var barFound = false;
    var currentBars = $(this.notation.container + " > ." + this.containerClassName)
    
    for (let i = 0; i < currentBars.length; i++) {
      if (currentBars[i].id == this.id) {
        barFound = true;
      }
    }
    
    //if the barcontainer cannot be found, add it to the DOM
    if (barFound === false) {
      this.addBarContainer()
    }

  }
  
  addBarContainer(){
    //this uses the id of the current bar, so should append the bar container correctly
    $(this.notation.container).append(this.barContainerHTML);
    $("." + this.containerClassName).css(this.getBarContainerCSS()); //probably quicker just to set all the bars css than to loop through them all and find the right one?
  }
  
  removeBarsFromContainer(target){
    target.html("");
  }
  
  getBarCSS() {
    return {"height": this.notation.barHeight + "px", //the "height" the stave lines will be
            "margin": "0px -" + this.widthOfBarLines  + "px " + this.notation.marginUnderBar + "px 0px", //notice the negative symbol, negative margin to overlap the end line and start line of two bars 
            "padding": "0px",                                                                           //also on line above, marginUnderBar which is set in the notation class, sets the bottom margin of instrument name and bars
            "border": "0px solid black",
            "border-width": "0px " + this.widthOfBarLines  + "px", //the "width the bar linse will be"
            "vertical-align": "top",
          }
  }
  
  getBarContainerCSS(){
    return {"display": "inline-block",
            "vertical-align": "top",
            "margin-bottom": String(this.notation.marginUnderBarContainer) + "px" //padding under bar container and instrument name container
      
            }
  }
  
  createLines(bar) {
    let height = parseInt($(bar).height() - this.heightOfLines); //for some reason this needs to be called with a $ selector, maybe cause it was passed from another function
                                                          //^ need to subtract the height of the line, otherwise bar height + line height puts the last line a line height out of the div
    let subDivisions = 4; //number of times to divide by, number of spaces basically
    
    for(let i = 0; i < subDivisions + 1; i++){ //number of sub divisions plus 1, as the first line's top value gets multipled by 0 and doesn't do anything
      
      let topOffset = (height / subDivisions) * i;

      
      let lineStyle = "height: " + this.heightOfLines + "; background-color: black; position: relative;  top: " + topOffset + ";"
      let lineHTML = '<div class="line" style="' + lineStyle + '"></div>'
      
      let lineContainerStyle = "height: 0; padding: 0px; margin: 0px"
      let lineContainerHTML = '<div class="line-container" style="' + lineContainerStyle + '">' +
                                lineHTML +
                              '</div';
                            
      $(bar).append(lineContainerHTML);
    }
    
    
    
  }
  
}
export default Bar;