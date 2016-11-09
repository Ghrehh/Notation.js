import Note from "./note";
import KeySignature from "./keySignature";
import TimeSignature from "./timeSignature";

class Bar {
  constructor(instrument, id){
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
    this.barHTML =  '<div class="' + this.className + '" id="' + String(this.instrument.id) + '">' + '</div>';
    
    this.heightOfLines = 1;
    this.widthOfBarLines = 1;
    

  }
  
  //need to make this a public method and run it from the instrument class creating it, pushBar is counting the number of bars in the bars array on the isntrument, so it need sto push before it starts
  initialize(){
    this.checkIfBarContainerExists(); //checks if the bar container exists, before adding the bar
    this.printBar();
  }
  
  addNote(n, duration, addNoteToNote) {
    //{ pitch = "A", accidental = "sharp/flat/natural", octave = 3, duration = 4 }
    let note = new Note(this, n, duration, addNoteToNote);
    note.initialize();
    
    if (addNoteToNote === undefined) { //only add it to the bar.notes[] if it's the first note added of a chord
      this.notes.push(note);
    }
    else {
      
      addNoteToNote.childNotes.push(note);
    }
    
    return note;
    
  }
  
  //returns a note from the bar, index starting at 1 not 0
  note(noteIndex){
    let note = this.notes[noteIndex - 1];
    
    if (note === undefined) {
      let instrument = this.instrument.id;
      let bar = this.bar.id;
      throw "unable to find the note of [index: " + noteIndex + "] in the [bar: " + bar + "] in [instrument: " + instrument + "]"
    }
    else {
      return note;
    }
  }
  
  printBar(){
    let currentBarContainers = $(this.notation.container + " > ." + this.notation.barsContainer + " > ." + this.containerClassName) //all bars
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
    
    if (this.id === 0) { //only gets run on the first bar that is added by default, sets up the clef, time sig and key sig. Should probably break this into a seperate function
      this.addClef();
      this.changeKeySignature("sharps", 0);
      this.changeTimeSignature(4, 4); //default to a 4/4 time signature because i'm a pleb
    }

  }
  
  addClef() {
    
    if ($(this.reference) === undefined) {
      throw "cannot add clef, bar reference is undefined (instrument: " + this.instrument.id + ", bar: " + this.id + ")";
    }
    let targetBar = $(this.reference);
    let clefHTML;
    let clefCSS;
    
    if (this.instrument.clef === "bass") {
      clefHTML = '<img src="' + this.notation.bassClefPath + '" class="clef">';
      
      clefCSS = {
        "height": "80%",
        "display": "inline-block",
        "padding": "2px 5px 2px 10px",
        "box-sizing": "border-box",
        "vertical-align":"top",
        "position": "relative", //so it sits atop the lines
      } 
    }
    else {
      clefHTML = '<img src="' + this.notation.trebleClefPath + '" class="clef">';
      let bottomOffset = $(this.reference).height() / 7;
      
      clefCSS = {
        "height": "150%",
        "display": "inline-block",
        "padding": "2px 5px 2px 10px",
        "box-sizing": "border-box",
        "bottom": bottomOffset,
        "position": "relative",
      } 
    
    }
    
    

    targetBar.children(".line-container").last().after(clefHTML); //append it after the last line-container otherwise
    targetBar.children(".clef").css(clefCSS);
    
  }
  
  addConjoiningLine(modifier){
    /* modifiers
      "bold" the bold, "thicker" first conjoining line on each new segment
      "end" places a conjoining line at the end of the bar
    */
    
    //establish class names for the different modifiers, then append the html with the correct name
    let className;
    
    if (modifier === "bold") {
      className = "conjoining-line bold";
    }
    else if (modifier === "end") {
      className = "conjoining-line end";
    }
    else {
      className = "conjoining-line";
    }
    
    let html = '<div class="conjoining-line-container">' +
                  '<div class="' + className + '">' +
                  '</div>' +
                '</div>'
                
    $(this.reference).prepend(html);
    
    
    let left;
    let lineWidth = 1; //should set this dynamically probably
    let width = 1;
    let marginBottom = $(this.reference).css("margin-bottom");
    let height = parseInt($(this.reference).height() * 2) + parseInt(marginBottom.substr(0, marginBottom.length - 2)); //assumes the margin bottom is XXXpx and cuts off the px
    

    //declare the left padding value if the modifier is "end"
    if (modifier === "end") {
      let barWidth = $(this.reference).width();
      left = barWidth;
      
    }


    let conjoiningLineContainerCSS = {"width": 0,
                                      "height": 0,
                                     }
                    
    let conjoiningLineCSS = {"width": width + "px",
                             "height": height + "px",
                             "background-color":"black",
                             "position":"relative",
                             "right": lineWidth + "px",
                            }
                            
    let conjoiningLineCSSEnd = { "left": left + "px", }

    let conjoiningLineCSSBold = { "width": (width * 2) + "px", }
    
    
    
    
    $(this.reference).children(".conjoining-line-container").css(conjoiningLineContainerCSS);
    $(this.reference).find(".conjoining-line").css(conjoiningLineCSS);
    

    $(this.reference).find(".end").css(conjoiningLineCSSEnd);
    
    
    $(this.reference).find(".bold").css(conjoiningLineCSSBold);
    
    
    
  }
  
  removeConjoiningLine(){
    $(this.reference).children(".conjoining-line-container").remove();
  }
  
  setBeams(){
    for (let i = 0; i < this.notes.length; i++){
      let note = this.notes[i];
      
      note.defaultBeam(); //should return all beams to their defaults and set the note.noteGrouping to false
      note.setBeam(); //should look at neighbouring notes and set the beams appropriately
    }
  }
  
  
  
  private
  
  //chcecks if a bar container already exists, so multiples do not get added
  checkIfBarContainerExists(){
    var barFound = false;
    var currentBars = $(this.notation.container + " > ." + this.notation.barsContainer + " > ." + this.containerClassName)
    
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
    $(this.notation.container + " ." + this.notation.barsContainer).append(this.barContainerHTML);
    $(this.notation.container + " ." + this.containerClassName).css(this.getBarContainerCSS()); //probably quicker just to set all the bars css than to loop through them all and find the right one?
    this.addBarNumber();
  }
  
  addBarNumber(){
    
    //find the right bar container
    let barContainers = $(this.notation.container).find("." + this.containerClassName);
    
    for (let i = 0; i < barContainers.length; i ++){
      let barContainer = barContainers[i];
      
      if (barContainer.id == this.id) { //two equals because it's string to integer, maybe not safe
        this.reference = barContainer;
      }
    }
    
    //declare and append html
    let html = '<div class="number-container">' +
                  '<p class="number">' + (parseInt(this.id) + 1) + '</p>' +
                '</div>'
                
    $(this.reference).append(html);
    
    
    //declare and apply css
    let containerCSS = {"height": "0px",
                        "width": "0px",
                       }
    
    let fontSize = this.notation.barHeight / 3;
    let leftPadding = fontSize / 2; //move it over a little
    let topPadding = this.notation.marginAboveBar - (fontSize * 1.4); //some bullshit that kind of looks right
    
    let CSS = {"position":"relative",
               "top": topPadding + "px",
               "left": leftPadding + "px",
               "margin": "0",
               "padding": "0",
               "color": "#515197",
               "font-size": fontSize + "px",
              }
    
    $(this.reference).find(".number-container").css(containerCSS);
    $(this.reference).find(".number").css(CSS);
    
    
  }
  
  removeBarsFromContainer(target){
    target.html("");
  }
  
  getBarCSS() {
    let minWidth = this.notation.barHeight * 2;
    
    return {"height": this.notation.barHeight + "px", //the "height" the stave lines will be
            "margin": this.notation.marginAboveBar + "px -" + this.widthOfBarLines  + "px " + this.notation.marginUnderBar + "px 0px", //notice the negative symbol, negative margin to overlap the end line and start line of two bars 
            "padding": "0px",                                                                           //also on line above, marginUnderBar which is set in the notation class, sets the bottom margin of instrument name and bars
            "border": "0px solid black",
            "border-width": "0px " + this.widthOfBarLines  + "px", //the "width the bar linse will be"
            "vertical-align": "top",
            "min-width": minWidth + "px",
            "white-space": "nowrap",
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

      
      let lineStyle = "height: " + this.heightOfLines + "; background-color: #636363; position: relative;  top: " + topOffset + ";"
      let lineHTML = '<div class="line" style="' + lineStyle + '"></div>'
      
      let lineContainerStyle = "height: 0; padding: 0px; margin: 0px"
      let lineContainerHTML = '<div class="line-container" style="' + lineContainerStyle + '">' +
                                lineHTML +
                              '</div';
                            
      $(bar).append(lineContainerHTML);
    }
    
    
    
  }
  
  
  changeKeySignature(typeOf, numberOf) {
    this.keySignature = new KeySignature(this, typeOf, numberOf);
  }
  
  changeTimeSignature(top, bottom){
    if (typeof top != "number"){
      throw "time signatures must be be numeric values"
    }
    
    if (typeof bottom != "number"){
      throw "time signatures must be be numeric values"
    }
    
    this.timeSignature = new TimeSignature(this, top, bottom);
  }
  
  removeTimeSignature(){
    if (this.timeSignature === undefined) {
      let instrument = this.instrument.id;
      let bar = this.id;
      throw "the time signature cannot be removed from [instrument: " + instrument + ", bar: " + bar + "] as one does not currently exist."
    }
    else {
      this.timeSignature.removeOldTimeSignature();
      this.timeSignature = undefined;
    }
  }
  
}
export default Bar;