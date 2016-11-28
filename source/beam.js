//Need to have a bool for wether the Beam has been "beamed" or not
//Need a way of having a max slope for the beam
// if one note beams down, they all beam down
//need to beam from the bottom of the stem if the notes are beamed down

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
    
    this.pickStemDirection();
    this.calculate();
    this.setBeamContainerCSS(this.angle);
    this.setBeamCSS(this.hyp);
    
    
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
    
    let this.beamPointingUp = true;
    
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
    
    if (this.beamPointingUp == true){
      this.angle = this.angle - this.angle - this.angle; //turns it into a negative number, which makes the beam point up.   
    }
    

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
    
    for (let i = 0; i < this.middleNotes.length; i++ ){
      let middleNote = this.middleNotes[i];
      
      let opp = $(middleNote.noteStemReference).offset().left - $(firstNote.noteStemReference).offset().left;
      let adj = opp / Math.tan(this.angle * 180/Math.PI); // opp/tan(angle)
      
      if (this.stemFacingDown) {
        
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
  
  setBeamContainerCSS(rotate){
    let beamHeight = 3;
    let top = "0px";
    
    if (this.stemFacingDown === true){
      let noteStemHeightRaw = $(this.note.noteReference).find(".note-stem").css("height");
      let noteStemHeightInt = parseInt($(this.note.noteReference).find(".note-stem").css("height").substr(0, noteStemHeightRaw.length - 2)); //shaves of the "px"
      top = noteStemHeightInt - beamHeight;

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
  
  
  
  
}

export default Beam;