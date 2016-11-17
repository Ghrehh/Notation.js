import Beam from "./beam";

class Note {
  constructor(bar, pitch, duration, parentNote){
    this.bar = bar;
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
      this.duration = "quarter-note"
    }
    this.accidental;
    this.octave;
    this.tuplet;
    this.rest;
    
    this.stemDirection = "down";
    
    
    this.noteParameters = this.getNoteParameters(this.pitch);
    if (this.noteParameters === undefined) {
      throw "note/octave '" + this.pitch + "' not recognised in note.getNoteParameters()"
    }
    
    
  }
  
  initialize(){
    //if a note is added not to be appended to another note, it will run these to set up the container the reference to it
    
    //Note-container, contains multiple or single notes and allocates the correct amount of space for them
    if (this.parentNote === undefined) {
      this.noteContainerID = this.getNoteContainerID();
      this.printNoteContainer();
      this.setNoteContainerReference();
      this.setNoteContainerCSS();
    }
    else {
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
    if (this.noteParameters.ledgerLinePosition !== undefined){
      for(let i = 0; i < this.noteParameters.ledgerLineNumber; i++){
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
    
    this.beam = new Beam(this);
  }
  
  setBeam(){
    
  }
  
  private
  printNoteContainer() {
    let noteContainerHTML = '<div class="' + this.containerClassName +'" id="' + this.noteContainerID +'"></div>';
  
    $(this.barReference).append(noteContainerHTML);
    
  }
  
  printNote() {
    let noteHTML = '<div class="' + this.className +'" id="' + this.noteID +'"></div>';
    
    $(this.noteContainerReference).append(noteHTML);
  }
  
  printNoteHead(){
    let noteHeadHTML = '<div class="note-head"></div>';
    
    $(this.noteReference).append(noteHeadHTML);
  }
  
  
  printLedgerLineContainer(){
    let ledgerLineContainerHTML = '<div class="ledger-line-container"></div>';
    $(this.noteHeadReference).append(ledgerLineContainerHTML);
  }
  
  printLedgerLine(){
    let ledgerLineHTML = '<div class="ledger-line"></div>';
    
    $(this.ledgerLineContainerReference).append(ledgerLineHTML);
  }
  
  
  printNoteStemContainer(){
    let noteStemContainerHTML = '<div class="note-stem-container"></div>';
    $(this.noteHeadReference).append(noteStemContainerHTML);
  }
  
  printNoteStem(){
    let noteStemHTML = '<div class="note-stem"></div>';
    
    $(this.noteStemContainerReference).append(noteStemHTML);
  }
  
  
  
  setNoteContainerReference(){
    let allNoteContainers = $(this.barReference).children("." + this.containerClassName)
    let targetNote;
    
    for(let i = 0; i < allNoteContainers.length; i++) {
      let currentNote = allNoteContainers.eq(i);
      
      if (currentNote.attr("id") === String(this.noteContainerID) ) {
        targetNote = currentNote;
        break;
      }
    }
    
    if (targetNote != undefined) {
      this.noteContainerReference = targetNote;
    }
    else {
      throw "unable to set reference for note container";
    }
  }
  
  setNoteReference(){
    let allNotes = $(this.noteContainerReference).children("." + this.className)
    let targetNote;
    
    for(let i = 0; i < allNotes.length; i++) {
      let currentNote = allNotes.eq(i);
      
      if (currentNote.attr("id") === String(this.noteID) ) {
        targetNote = currentNote;
        break;
      }
    }
    
    if (targetNote != undefined) {
      this.noteReference = targetNote;
    }
    else {
      throw "unable to set reference for note container";
    } 
  }
  
  setNoteHeadReference(){
    this.noteHeadReference = $(this.noteReference).children();
  }
  
  setLedgerLineContainerReference(){
    this.ledgerLineContainerReference = $(this.noteHeadReference).children(".ledger-line-container").last(); //should grab the most recent one in the event there are multiple ledger lines for a note
  }
  
  setLedgerLineReference(){
    this.ledgerLineReference = $(this.ledgerLineContainerReference).children();
  }
  
  setNoteStemContainerReference(){
    this.noteStemContainerReference = $(this.noteHeadReference).children(".note-stem-container");
  }
  
  setNoteStemReference(){
    this.noteStemReference = $(this.noteStemContainerReference).children();
  }
  
  
  
  setNoteContainerCSS(){
    
    if ($(this.noteContainerReference) === undefined) {
      throw "noteContainerReference not found";
    }
    
    $(this.noteContainerReference).css(this.getNoteContainerCSS());
  }
  
  setNoteCSS(){
    
    if ($(this.noteReference) === undefined) {
      throw "noteContainerReference not found";
    }
    
    $(this.noteReference).css(this.getNoteCSS());
  }
  
  setNoteHeadCSS(){
    $(this.noteHeadReference).css(this.getNoteHeadCSS()); 
  }
  
  
  setLedgerLineContainerCSS(){
    $(this.ledgerLineContainerReference).css(this.getLedgerLineContainerCSS());
  }
  
  setLedgerLineCSS(index){
    $(this.ledgerLineReference).css(this.getLedgerLineCSS(index));
  }
  
  
  setNoteStemContainerCSS(){
    $(this.noteStemContainerReference).css(this.getNoteStemContainerCSS());
  }
  
  setNoteStemCSS(){
    $(this.noteStemReference).css(this.getNoteStemCSS());
  }
  
  
  
  getNoteContainerCSS(){
    let wholeNoteWidth = 4.0;
    let halfNoteWidth =  wholeNoteWidth / 2;
    let quarterNoteWidth =  halfNoteWidth / 2;
    let eighthNoteWidth =  quarterNoteWidth / 2;
    let sixteenthNoteWidth =  eighthNoteWidth / 2;
    let thirtysecondNoteWidth =  sixteenthNoteWidth / 2;
    
    let widthMultiplier;
    
    switch(this.duration){
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

    
    let width = $(this.barReference).height();
    
    return {"height": "100%",
            "width": (width * widthMultiplier) + "px",
            "display": "inline-block",
            "box-sizing": "border-box",
            "vertical-align": "top",
                  
          }
  } //returns css attributes for note container
  
  getNoteCSS(){
    return {"height": "0px",
            "width": "100%",
            "background-color": "#e87676",
            "display": "block",
            "border-bottom": "0px solid red",
            "box-sizing": "border-box",
            
                  
          }
  } //returns css attributes for note
  
  getNoteHeadCSS(){
    let noteHeadHeight = $(this.barReference).height() / 4; //same as the distance between lines
    
    let background;
    
    if (this.duration === "whole-note" || this.duration === "half-note"){
      background = "transparent";
    }
    else {
      background = "black";
    }
    
    return {
      "height": noteHeadHeight + "px",
      "width": (noteHeadHeight * 1.25)  + "px",
      "box-sizing": "border-box",
      "border" : "2px solid black",
      "border-width": "2px 1px",
      "border-radius": "50px",
      "transform":"rotate(-15deg)",
      "margin":"auto",
      "position":"relative",
      "top": "" + (noteHeadHeight * this.noteParameters.topOffset) + "px",
      "background-color": background,
      
    }
  }
  
  getLedgerLineContainerCSS(){
    return {
      "transform": "rotate(15deg)",
      "height": "0px",
      "width":"0px",
      
    }
  }
  
  getLedgerLineCSS(index){
    let noteHeadHeight = $(this.barReference).height() / 4;
    let noteHeadWidth = noteHeadHeight * 1.25; //same as the distance between lines
    
    let offset;
    
    if (this.noteParameters.ledgerLinePosition === "top"){
      let barTop = $(this.noteContainerReference).offset().top;
      
      let idealLedgerLinePosition = barTop - (noteHeadHeight * (index + 1)); //basically moves every ledger line up one space
      
      let currentLedgerLinePosition = $(this.ledgerLineReference).offset().top;
  
      offset = idealLedgerLinePosition - currentLedgerLinePosition
    }
    else if (this.noteParameters.ledgerLinePosition === "bottom"){
      let barTop = $(this.noteContainerReference).offset().top;
      
      let barHeight = (this.noteContainerReference).height();
      
      let idealLedgerLinePosition = (barTop + barHeight) + (noteHeadHeight * (index + 1)) - this.bar.widthOfBarLines; //basically moves every ledger line up one space
      
      let currentLedgerLinePosition = $(this.ledgerLineReference).offset().top;
  
      offset = idealLedgerLinePosition - currentLedgerLinePosition
    }

    
    return {
      "height": this.bar.widthOfBarLines + "px",
      "width": noteHeadWidth * 2.5 + "px",
      "background-color": "black",
      "position": "relative",
      "right": noteHeadWidth / 1.20 + "px",
      "top": offset + "px"
    }
  }
  
  getNoteStemContainerCSS(){
    return {
      "transform": "rotate(15deg)",
      "height": "0px",
      "width":"0px",
    }
  }
  
  getNoteStemCSS(){
    let noteHeadHeight = $(this.barReference).height() / 4; //same as the distance between lines
    let stemWidth = 1;
    let stemHeight = noteHeadHeight * 3.0;
    let left;
    let bottom;
    
    if (this.noteParameters.stemDirection === "up") {
      left = (noteHeadHeight * 1.25) - stemWidth - 1; // the addiontal minus 1 just seems to do the trick
      bottom = stemHeight - (noteHeadHeight / 2.60);
    }
    else if (this.noteParameters.stemDirection === "down") {
      left = 0;
      bottom = 0;
    }
    
    return {
      "height" : stemHeight,
      "width": stemWidth,
      "background-color": "black",
      "position": "relative",
      "left" : left,
      "bottom" : bottom,
    }
  }
  
  
  
  getNoteContainerID() {
    return $(this.barReference).children("." + this.containerClassName).length;
    
  }
  
  getNoteID(){
    return $(this.noteContainerReference).children().length;
  }
  
  getNoteParameters(note){
    
    let noteDictionary = {"C6": {topOffset:-2.5, stemDirection: "down", ledgerLinePosition: "top", ledgerLineNumber: 2},
                          "B5": {topOffset:-2.0, stemDirection: "down", ledgerLinePosition: "top", ledgerLineNumber: 1},
                          "A5": {topOffset:-1.5, stemDirection: "down", ledgerLinePosition: "top", ledgerLineNumber: 1},
                          "G5": {topOffset:-1.0, stemDirection: "down"},
                          "F5": {topOffset:-0.5, stemDirection: "down"},
                          "E5": {topOffset: 0.0, stemDirection: "down"},
                          "D5": {topOffset: 0.5, stemDirection: "down"},
                          "C5": {topOffset: 1.0, stemDirection: "down"},
                          "B4": {topOffset: 1.5, stemDirection: "down"},
                          "A4": {topOffset: 2.0, stemDirection: "up"},
                          "G4": {topOffset: 2.5, stemDirection: "up"},
                          "F4": {topOffset: 3.0, stemDirection: "up"},
                          "E4": {topOffset: 3.5, stemDirection: "up"},
                          "D4": {topOffset: 4.0, stemDirection: "up"},
                          "C4": {topOffset: 4.5, stemDirection: "up",  ledgerLinePosition: "bottom", ledgerLineNumber: 1},
                          "B3": {topOffset: 5.0, stemDirection: "up", ledgerLinePosition: "bottom", ledgerLineNumber: 1},
                        }
                        
    return noteDictionary[note];
  }
  
  changeStemDirection(direction){
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
    }
    else if (direction === "down"){
      if (this.noteParameters.stemDirection !== "down") {
        this.noteParameters.stemDirection = "down";
      }
    }
    else if (direction === undefined){
      //flip the stem direction
      if (this.noteParameters.stemDirection === "up" ){
        this.noteParameters.stemDirection = "down";
      }
      else if (this.noteParameters.stemDirection === "down" ){
        this.noteParameters.stemDirection = "up";
      }
    
    }
    else {
      throw "a valid parameter was not passed to Note.changeStemDirection() [parameter passed: " + direction; + "]"
    }
    
    //reapply the css to the stem
    this.setNoteStemCSS();
  }

}
export default Note;