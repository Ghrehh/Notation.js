class Beam {
  constructor(note){
    this.note = note;
    
    this.containerReference;
    this.reference;
    
    this.endNote;
    this.middleNotes = []; //array of any additional notes to be beamed between the first and last
    
    this.beamPointingUp;
    this.stemFacingDown;
    
    this.adj;
    this.opp;
    this.hyp
    this.angle;
    
    this.initialize();
  }
  
  initialize(){
    this.printBeamContainer();
    this.printBeam();
    this.unjoinedBeam();
  }
  
  unjoinedBeam(){
    //current size i'm using for the curved unjoined beams
    let size = this.note.notation.barHeight / 5;
    
    if (this.note.noteParameters.stemDirection === "down") {
      this.stemFacingDown = true;
      this.setBeamContainerCSS(0, size * 1.5)
    }
    else {
      this.stemFacingDown = false;
      this.setBeamContainerCSS(0, size * 1.5)
    }
    
    this.setUnjoinedBeamCSS(size);
  }
  
  beamTo(endNote){
    if (endNote === undefined){
      throw "Beam.beamTo() must be given a target note";
    }
    else {
      this.endNote = endNote;
    }
    
    //if there are any notes between the start and endNote place them in an array
    if (endNote.noteContainerID - 1 !== this.note.noteContainerID ){
      this.getMiddleNotes();
    }
    
    this.checkNotesAreValid();
    this.removeOldBeamCSS();
    this.pickStemDirection();
    this.calculate();
    this.resizeMiddleNotes();
    this.setBeamContainerCSS(this.angle);
    this.setBeamCSS(this.hyp);
    
    
  }
  
  checkNotesAreValid(){
    let allNotesValid = true;
    
  }
  
  removeOldBeamCSS(){
    
    //remove the unjoined beam CSS from all the beamed notes
    $(this.reference).removeAttr('style');
    $(this.endNote.beam.reference).removeAttr('style');
    
    for (let i = 0; i < this.middleNotes.length; i++){
      let middleNoteStem = $(this.middleNotes[i].beam.reference);
      
      middleNoteStem.removeAttr('style');
    }
  }
  
  //if there are more than two notes beamed together, get the notes between the first note and final note and push them in this.middleNotes
  getMiddleNotes(){
    let bar = this.note.bar;
    
    for (let i = this.note.noteContainerID; i < this.endNote.noteContainerID - 1; i++){
      let note = bar.note(i + 2); //plus 2 because we want the note after the current one, and another + 1 because the Bar.note() method is 1 indexed note 0 indexed
      
      if (note === undefined){
        throw "unable to find note in Beam.getMiddleNotes()";
      }
      else {
        this.middleNotes.push(note);
      }
    }
  }
  
  //ensures all notes stems are in the same direction before they are beamed
  pickStemDirection(){

    //currently, if any note stems face down, make all notes being beamed face down
    
    //check if any of the notes stem downwards
    this.stemFacingDown = false;
    
    if (this.note.noteParameters.stemDirection === "down" ){
      this.stemFacingDown = true;
    }
    else if (this.endNote.noteParameters.stemDirection === "down" ){
      this.stemFacingDown = true;
    }
    
    if (this.stemFacingDown === false) {
      for (let i = 0; i < this.middleNotes.length; i++){
      let note = this.middleNotes[i];
      
      if (note.noteParameters.stemDirection === "down"){
        this.stemFacingDown = true;
      }
    }
    } //loops through the other beamed notes, only called if neither of the previous two if statements were true
    
    //if any of them did face down, make all notes face down
    
    if (this.stemFacingDown === true){
      this.note.changeStemDirection("down");
      this.endNote.changeStemDirection("down");
      
      for (let i = 0; i < this.middleNotes.length; i++){
        
        let note = this.middleNotes[i];
        
        note.changeStemDirection("down");
        
      }
      
    }
    
  }
  
  //decides wether to use the normal beam (slanted/flat) or use the type that sits along the bottom/top of the bar if the notes are all over the place
  pickBeamType(){
    
  }
  
  
  //calculates angles and lengths
  calculate(){
    let targetNote = this.endNote;
    if (targetNote === undefined){
      throw "Beam.calculate: Beam.endNote was not defined";
    }
    
    let firstNote = $(this.note.noteStemReference).offset();
    let secondNote = $(targetNote.noteStemReference).offset();
    
    this.beamPointingUp = true;
    
    this.adj = secondNote.left - firstNote.left;
    
    this.opp = firstNote.top - secondNote.top;
    if (this.opp < 0 ){ //if the second note has a lower x axis than the first and the beam needs to point down
      this.opp = Math.abs(this.opp);
      this.beamPointingUp = false;
    } //makes the opp a positive number if it is negative
    
    this.hyp = Math.sqrt((this.adj * this.adj) + (this.opp * this.opp));
    
    this.angle = Math.atan(this.opp / this.adj) * 180/Math.PI;
    
    
    let spaceHeight = $(this.note.barReference).height() / 4; //height of the spaces in a bar/height of a note head. this will be the maxium "height" of a beam
    
    //if the slope of the beam is too steep, set it to the max then recalculate the hyp
    if (this.opp > spaceHeight) {
      this.angle = Math.atan(spaceHeight / this.adj) * 180/Math.PI;
      this.hyp = Math.sqrt((this.adj * this.adj) + (spaceHeight * spaceHeight));
      
      //if the beam needed to be set to the max angle, then the second stem wont be connected to it, stems need to be shortened/lengthened
      this.resizeFirstAndLastStems(this.opp - spaceHeight); //this.opp - spaceheight will be the gap between the second note and the stem
      
    }
    
    //round to 2 decimal places
    this.angle = this.angle.toFixed(1);
    
    

  }
  
  //fixes the length of the first and last stems if the stem angle needed to be readjusted
  resizeFirstAndLastStems(space){
    
    let first = $(this.note.noteHeadReference).offset().top
    let second = $(this.endNote.noteHeadReference).offset().top
    
    //make first note taller
    if ((this.stemFacingDown && first < second) || (this.stemFacingDown === false &&  first > second) ) {
      let currentHeight = $(this.note.noteStemReference).height();
      this.note.setNoteStemCSS(currentHeight + space);

    }
    //make second note taller
    else {
      let currentHeight = $(this.note.noteStemReference).height();
      this.endNote.setNoteStemCSS(currentHeight + space);
    }
    
  }
  
  resizeMiddleNotes(){
  
    let firstNote = this.note;
    let beamWidth = 2;
    
    for (let i = 0; i < this.middleNotes.length; i++ ){
      let middleNote = this.middleNotes[i];

      
      let opp = $(middleNote.noteStemReference).offset().left - $(firstNote.noteStemReference).offset().left;
      let adj = opp / Math.tan((90 - this.angle) * Math.PI/180); // opp/tan(angle) 90- this.angle because the angle applied to the css is the outside angle, I need the inside. note Math.PI/180 is the opposite of the function used on the one above
     
      
      let targetPos; //Position along beam where the middle notes stem needs to be cut/extended to
      let currentPos; //current location of the top/bottom of the middle note
      let currentHeight = $(middleNote.noteStemReference).height();
      
      if (this.stemFacingDown) {
        let bottomOfStem = $(this.note.noteStemReference).offset().top + $(this.note.noteStemReference).height();
        currentPos = $(middleNote.noteStemReference).offset().top + $(middleNote.noteStemReference).height()
        
        if (this.beamPointingUp){
          targetPos = bottomOfStem - adj;
        }
        else {
          targetPos = bottomOfStem + adj;
        }
        
        middleNote.setNoteStemCSS(currentHeight + (targetPos - currentPos ));
      }
      else {
        let topOfStem = $(this.note.noteStemReference).offset().top;
        currentPos = $(middleNote.noteStemReference).offset().top;
        
        if (this.beamPointingUp){
          targetPos = topOfStem - adj;
        }
        else {
          targetPos = topOfStem + adj;
        }
        
        middleNote.setNoteStemCSS(currentHeight + (currentPos - targetPos - beamWidth ));
        
      }
     
      
      

      
    }
    
  }
  
  
  printBeamContainer(){
    let html = '<div class="beam-container"></div>';
    
    $(this.note.noteStemReference).append(html);
    this.containerReference = $(this.note.noteStemReference).children();
  }
  
  printBeam(){
    let html = '<div class="beam"></div>'
    
    $(this.containerReference).append(html);
    this.reference = $(this.containerReference).children();
  }
  
  setBeamContainerCSS(rotate, setBeamHeight){
    let beamHeight = 3;
    let top = "0px";
    
    if (setBeamHeight != undefined) {
      beamHeight = setBeamHeight;
    }
    
    if (this.stemFacingDown === true){
      let noteStemHeightRaw = $(this.note.noteReference).find(".note-stem").css("height");
      let noteStemHeightInt = parseInt($(this.note.noteReference).find(".note-stem").css("height").substr(0, noteStemHeightRaw.length - 2)); //shaves of the "px"
      top = noteStemHeightInt - beamHeight;

    }
    
    if (this.beamPointingUp == true){
      rotate = rotate - rotate - rotate; //turns it into a negative number, which makes the beam point up.   
    }
    
    let css = {"height":"0px",
               "width":"0px",
               "transform":"rotate(" + rotate + "deg)",
               "position": "relative",
                "top": top + "px",
              }
              
    $(this.containerReference).css(css);
  }
  
  setBeamCSS(width){
      let beamHeight = 3;
      let stemWidth = 1;
    
      let css = {"height": beamHeight + "px",
                 "width": (width + stemWidth) + "px",
                 "background-color":"black",
                }
              
    $(this.reference).css(css);
  }
  
  //sets CSS for beam "tails" on unjoined 8th notes etc
  setUnjoinedBeamCSS(size){
      if (size === undefined){
        throw "in beam.setUnjoinedBeamCSS() you must set a size"
      }
      else if (typeof size !== "number" && size > 0){
        throw "in beam.setUnjoinedBeamCSS the value provided must be a number greater than 0"
      }
      let beamWidth = 1;
      
      let css;
      
      if (this.stemFacingDown === true){
        css = {"height": size * 1.5,
                   "width": size,
                   "background-color":"transparent",
                   "border-bottom": (beamWidth * 2) + "px solid black",
                   "border-right": beamWidth + "px solid black",
                   "border-radius": "0px 0px " + size + "px"
                  }
       }
       else {
        css = {"height": size * 1.5,
                   "width": size,
                   "background-color":"transparent",
                   "border-top": (beamWidth * 2) + "px solid black",
                   "border-right": beamWidth + "px solid black",
                   "border-radius": "0px " + size + "px 0px"
                  }
       }
              
    $(this.reference).css(css);
  }
  
  
  
  
  
}

export default Beam;