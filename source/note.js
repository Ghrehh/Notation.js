class Note {
  constructor(barReference){
    this.barReference = barReference;
    this.reference;
    this.className = "note";
    this.id = this.getNoteID();
    
    this.pitch;
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
    this.printNote();
    this.setReference();
    this.setCSS();
  }
  
  private
  
  printNote() {
    let noteHTML = '<div class="' + this.className +'" id="' + this.id +'"></div>';
  
    var newNote = $(this.barReference).append(noteHTML);
    
  }
  
  setReference(){
    let allNotes = $(this.barReference).children("." + this.className)
    let targetNote;
    
    for(let i = 0; i < allNotes.length; i++) {
      let currentNote = allNotes.eq(i);
      
      if (currentNote.attr("id") === String(this.id) ) {
        targetNote = currentNote;
        break;
      }
    }
    
    if (targetNote != undefined) {
      this.reference = targetNote;
    }
    else {
      throw "unable to set reference for note";
    }
  }
  
  setCSS(){
    $(this.reference).css(this.getNoteCSS());
  }
  
  getNoteCSS(){
    return {"height": "100%",
            "width": "30px",
            "background-color": "#a4b4d6",
            "display": "inline-block",
            "border-right": "1px solid blue",
            "box-sizing": "border-box"
                  
          }
  } //returns css attributes for note
  
  getNoteID() {
    return $(this.barReference).children("." + this.className).length;
    
  }
  
  
}
export default Note;