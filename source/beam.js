class Beam {
  constructor(note){
    this.note = note;

    this.containerReferences = [];
    this.references = [];

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
    this.removeBeamCSS();
    this.pickStemDirection();
    this.calculate();
    this.resizeMiddleNotes();

    this.applyFirstNoteBeams(); //do first one seperates since it cant beam backwards? might be best to meld this in the the next method
    this.sortNoteBeams();

  }

  unjoinedBeam(){
    //current size i'm using for the curved unjoined beams
    let size = this.note.notation.barHeight / 5;
    if (this.note.noteParameters.stemDirection === "down") {
      this.stemFacingDown = true;
    }
    else {
      this.stemFacingDown = false;
    }
    //no rotation, size of unjoined beam, the top/bottom offset beam, whether or not it is an unjoined beam

    for (let i = 0; i < this.containerReferences.length; i++) {
      let container = this.containerReferences[i];
      let stem = this.references[i];

      let additionalOffset = (size / 2) * i;
      $(container).css(this.getBeamContainerCSS(0, size * 1, size / 1.5 + additionalOffset, true));
      $(stem).css(this.getUnjoinedBeamCSS(size));
    }

  }



  applyFirstNoteBeams(){
    //Apply the main beam that stretches across all the notes in the grouping, these values are calculated in the calculate() function
    $(this.containerReferences[0]).css(this.getBeamContainerCSS(this.angle));
    $(this.references[0]).css(this.getBeamCSS(this.hyp));

    //then calculate the beam between the first and second note (which may be different if the grouping is more than two notes)
    let nextNote;

    if (this.middleNotes.length === 0){
      nextNote = this.endNote;
    }
    else {
      nextNote = this.middleNotes[0];
    }

    let offset = this.note.notation.barHeight / 10;
    let lowerBeamHeight = 2;

    //adds some additional padding to the 16th note beam on beams that are above notes
    let topBeamHeightFix = 0;
    if (this.stemFacingDown === false) {
      topBeamHeightFix = 2;
    }

    let stem = $(this.note.noteStemReference);
    let nextStem = $(nextNote.noteStemReference);

    let opp = nextStem.offset().left - stem.offset().left;
    let adj;

    if (this.stemFacingDown) {
      adj = (nextStem.offset().top + nextStem.height()) - (stem.offset().top + stem.height());

    }
    else {
      adj = nextStem.offset().top - stem.offset().top;
    }

    let hyp = Math.sqrt((adj * adj) + (opp * opp));

    //get any other beams from the root note, minus the first, hence index starts at 1 not 0
    for (let i = 1; i < this.references.length; i++){
      let container = $(this.containerReferences[i]);
      let beam = $(this.references[i]);

      let width;

      if (nextNote.beam.containerReferences.length > i) {
        width = hyp;
      }
      else {
        width = hyp / 4;
      }
      //rotation, size of unjoined beam, the top/bottom offset beam, whether or not it is an unjoined beam
      container.css(this.getBeamContainerCSS(this.angle, undefined, topBeamHeightFix + (offset * i), false));
      beam.css(this.getBeamCSS(width, lowerBeamHeight));

    }

  }

  sortNoteBeams(){

    let fullArray = this.middleNotes; fullArray.push(this.endNote); fullArray.unshift(this.note);

    for (let i = 1; i < fullArray.length; i++){
      let prevNote = fullArray[i - 1];
      let currNote = fullArray[i];
      let nextNote = fullArray[i + 1];

      let prevNoteBeams = prevNote.beam.references;
      let currNoteBeams = currNote.beam.references;
      let nextNoteBeams = nextNote ? nextNote.beam.references : undefined;

      let prevNoteStem = prevNote.noteStemReference;
      let currNoteStem = currNote.noteStemReference;
      let nextNoteStem = nextNote ? nextNote.noteStemReference : undefined;

      let offset = this.note.notation.barHeight / 10;
      let lowerBeamHeight = 2;

      let topBeamHeightFix = 0;
      if (this.stemFacingDown === false) {
        topBeamHeightFix = 2;
      }

      let beam_back = false;
      let beam_all_forward = false;
      let beam_shared_forward = false;

      ///if the final note
      if (nextNote === undefined){
        //beam EVERYTHING BACK
        //beam NOTHING FORWARD
        beam_back = true
        beam_all_forward = false
        beam_shared_forward = false
      }
      else if (currNoteBeams.length >= nextNoteBeams.length) {
        //beam EVERYTHING BACK
        //beam anything the next note has forward
        beam_back = true
        beam_all_forward = false
        beam_shared_forward = true
      }
      else if(currNoteBeams.length < nextNoteBeams.length) {
        //beam NOTHING back
        //beam everything forward
        beam_back = false
        beam_all_forward = true
        beam_shared_forward = false
      }



      for (let i2 = 1; i2 < currNoteBeams.length; i2++){
        let nextContainer = nextNote.beam.containerReferences[i2] || undefined;

        let container = currNote.beam.containerReferences[i2];
        let beam = currNote.beam.references[i2];


        let opp = nextNoteStem.offset().left - currNoteStem.offset().left;
        let adj;

        if (this.stemFacingDown) {
          adj = (nextNoteStem.offset().top + nextNoteStem.height()) - (currNoteStem.offset().top + currNoteStem.height());

        }
        else {
          adj = nextNoteStem.offset().top - currNoteStem.offset().top;
        }

        let hyp = Math.sqrt((adj * adj) + (opp * opp));

        let angle = nextNote ? this.angle : this.angle + 180;

        let width = 0;
        let right = 0;


        if (beam_shared_forward && nextContainer) {
          width += hyp
        }

        if (beam_back) {
          width += hyp / 4
          right += hyp / 4
        }

        console.log(hyp)
        console.log(width + "\n\n")
        //rotation, size of unjoined beam, the top/bottom offset beam, whether or not it is an unjoined beam
        container.css(this.getBeamContainerCSS(this.angle, undefined, topBeamHeightFix + (offset * i), false));
        beam.css(this.getBeamCSS(width, lowerBeamHeight, right));

      }
    }
  }




  checkNotesAreValid(){
    let allNotesValid = true;

  }

  //removes the css from unjoined beams before joining
  removeBeamCSS(){

    //remove the unjoined beam CSS from all the beamed notes
    $(this.note.noteReference).find(".beam").removeAttr('style');
    $(this.endNote.noteReference).find(".beam").removeAttr('style');

    for (let i = 0; i < this.middleNotes.length; i++){
      let middleNote = $(this.middleNotes[i].noteReference).find(".beam");

      middleNote.removeAttr('style');
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


  //calculates angles and lengths of main beam between first and last
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
    let numberOfContainers = 1;

       switch(this.note.duration){
          case "eighth":
            numberOfContainers = 1;
            break;
          case "sixteenth":
            numberOfContainers = 2;
            break;
          case "thirty-second":
            numberOfContainers = 3;
            break;
          case "sixty-fourth":
            numberOfContainers = 4;
            break;
        }


    for (let i = 0; i < numberOfContainers; i ++) {
      let html = '<div class="beam-container"></div>';

      $(this.note.noteStemReference).prepend(html);
      this.containerReferences.push($(this.note.noteStemReference).children().eq(0));
    }
  }

  printBeam(){

    for (let i = 0; i < this.containerReferences.length; i++){
      let html = '<div class="beam"></div>'
      let containerReference = this.containerReferences[i];
      $(containerReference).append(html);
      this.references.push($(containerReference).children());
    }
  }



  getBeamContainerCSS(rotate, setBeamHeight, setBeamOffset, isUnjoinedBeam){
    //setBeamHeight for unjoined beams, setBeamOffset for unjoined beams also
    let beamHeight = 3;
    let beamOffset = 0;
    let top = 0;

    if (setBeamHeight != undefined) {
      if (typeof setBeamHeight != "number" || setBeamHeight < 1) {
        throw "in beam.setBeamContainerCSS() setBeamHeight must be a number over 0";
      }
      beamHeight = setBeamHeight;
    }

    if (setBeamOffset != undefined) {
     if (typeof setBeamOffset != "number" ) {
        throw "in beam.setBeamContainerCSS() setBeamOffset must be a number";
      }
      beamOffset = setBeamOffset
    }

    if (this.stemFacingDown === true){
      let noteStemHeightRaw = $(this.note.noteReference).find(".note-stem").css("height");
      let noteStemHeightInt = parseInt($(this.note.noteReference).find(".note-stem").css("height").substr(0, noteStemHeightRaw.length - 2)); //shaves of the "px"
      top = noteStemHeightInt - beamHeight - beamOffset;

    }
    else {
      //width of the unjoined beam at it's thickest, should pull this form somewhere else when I'm calculating the width programatically
      let unjoinedBeamWidth = 0; //shouldn't be applied to beams that arent providing the setBeamOffset attribute, as they are not unjoined
      if (isUnjoinedBeam === true ) {
        unjoinedBeamWidth = 2;
      }

      top = top + beamOffset - unjoinedBeamWidth ;
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

    return css;
  }

  getBeamCSS(width, height, moveRight){
      let beamHeight = 3;
      let stemWidth = 1;
      let right = 0;

      if (height !== undefined){
        if (typeof height !== "number" || height < 0) {
          throw "in beam.getBeamCSS(): height provided was not a number greater than 0";
        }
        beamHeight = height;
      }

      if (moveRight !== undefined){
        if (typeof moveRight !== "number" ) {
          throw "in beam.getBeamCSS(): moveRight provided was not a number";
        }
        right = moveRight;
      }

      let css = {"height": beamHeight + "px",
                 "width": (width + stemWidth) + "px",
                 "background-color":"black",
                 "position": "relative",
                 "right": right,
                }

    return css;
    //$(this.reference).css(css);
  }

  //sets CSS for beam "tails" on unjoined 8th notes etc
  getUnjoinedBeamCSS(size){
    if (size === undefined){
      throw "in beam.setUnjoinedBeamCSS() you must set a size"
    }
    else if (typeof size !== "number" && size > 0){
      throw "in beam.setUnjoinedBeamCSS the value provided must be a number greater than 0"
    }
    let beamWidth = 1;

    let css;

    if (this.stemFacingDown === true){
      css = {"height": size * 1,
                 "width": size,
                 "background-color":"transparent",
                 "border-bottom": (beamWidth * 2) + "px solid black",
                 "border-right": beamWidth + "px solid black",
                 "border-radius": "0px 0px " + size + "px"
                }
     }
     else {
      css = {"height": size * 1,
                 "width": size,
                 "background-color":"transparent",
                 "border-top": (beamWidth * 2) + "px solid black",
                 "border-right": beamWidth + "px solid black",
                 "border-radius": "0px " + size + "px 0px"
                }
     }

    return css;
  }





}

export default Beam;
