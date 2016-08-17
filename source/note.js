class Note {
  constructor(bar, parentNote){
    this.bar = bar;
    this.parentNote = parentNote;
    this.barReference = this.bar.reference;
    this.containerClassName = "note-container";
    this.className = "note";
    this.noteContainerID;
    this.noteID;
    
    this.noteContainerReference; //holds note container jquery object
    this.noteReference; //and the same for the note
    this.noteHeadReference;
    this.noteStemContainerReference;
    this.noteStemReference;
    
    this.pitch;
    this.accidental;
    this.octave;
    this.duration;
    this.tuplet;
    this.rest;
    
    
    
    this.wholeNoteDuration = 4.0;
    this.halfNoteDuration = this.wholeNoteDuration / 2;
    this.quarterNoteDuration = this.halfNoteDuration / 2;
    this.eighthNoteDuration = this.quarterNoteDuration / 2;
    this.sixteenthNoteDuration = this.eighthNoteDuration / 2;
    this.thirtysecondNoteDuration = this.sixteenthNoteDuration / 2;
    
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
    
    //note stem container, anything rotated in a nother roated element needs to have a 0 height 0 width container to stop strange things from happening when the height is adjusted
    this.printNoteStemContainer();
    this.setNoteStemContainerReference();
    this.setNoteStemContainerCSS();
    
    this.printNoteStem();
    this.setNoteStemReference();
    this.setNoteStemCSS();
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
  
  setNoteStemContainerReference(){
    this.noteStemContainerReference = $(this.noteHeadReference).children();
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
  
  setNoteStemContainerCSS(){
    $(this.noteStemContainerReference).css(this.getNoteStemContainerCSS());
  }
  
  setNoteStemCSS(){
    $(this.noteStemReference).css(this.getNoteStemCSS());
  }
  
  
  
  getNoteContainerCSS(){
    let width = $(this.barReference).height();
    
    return {"height": "100%",
            "width": width + "px",
            //"background-color": "#a4b4d6",
            "display": "inline-block",
            //"border-right": "1px solid blue",
            "box-sizing": "border-box",
                  
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
    let noteTopOffset = this.getNoteTopOffset(this.pitch);
    
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
      "top": "" + (noteHeadHeight * noteTopOffset) + "px",
      
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
    let stemHeight = noteHeadHeight * 2.5;
    let left = (noteHeadHeight * 1.25) - stemWidth - 1; // the addiontal minus 1 just seems to do the trick
    
    return {
      "height" : stemHeight,
      "width": stemWidth,
      "background-color": "black",
      "position": "relative",
      "left" : left,
      "bottom" : stemHeight - (noteHeadHeight / 2.60),
    }
  }
  
  
  
  getNoteContainerID() {
    return $(this.barReference).children("." + this.containerClassName).length;
    
  }
  
  getNoteID(){
    return $(this.noteContainerReference).children().length;
  }
  
  getNoteTopOffset(note){
    let noteDictionary = {"E": 0,
                          "D": 0.5,
                          "C": 1,
                          "B": 1.5,
                          "A": 2,
                          "G": 2.5,
                          "F": 3,
                        }
                        
    return noteDictionary[note];
  }
  
  
}
export default Note;