class Note {
  constructor(bar, parentNote){
    this.bar = bar;
    this.parentNote = parentNote;
    this.barReference = this.bar.reference;
    this.containerClassName = "note-container";
    this.className = "note";
    this.noteContainerID;
    this.noteID;
    
    this.noteContainerReference;
    this.noteReference;
    
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
    
    this.noteID = this.getNoteID();
    console.log(this.noteID)
    this.printNote();
    this.setNoteReference();
    this.setNoteCSS();
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
  
  getNoteContainerCSS(){
    return {"height": "100%",
            "width": "30px",
            "background-color": "#a4b4d6",
            "display": "inline-block",
            "border-right": "1px solid blue",
            "box-sizing": "border-box",
                  
          }
  } //returns css attributes for note container
  
  getNoteCSS(){
    return {"height": "10px",
            "width": "100%",
            "background-color": "#e87676",
            "display": "block",
            "border-bottom": "1px solid red",
            "box-sizing": "border-box",
                  
          }
  } //returns css attributes for note
  
  getNoteContainerID() {
    return $(this.barReference).children("." + this.containerClassName).length;
    
  }
  
  getNoteID(){
    return $(this.noteContainerReference).children().length;
  }
  
  
}
export default Note;