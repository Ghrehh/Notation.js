//Need to have a bool for wether the Beam has been "beamed" or not
//Need a way of having a max slope for the beam
// if one note beams down, they all beam down
//need to beam from the bottom of the stem if the notes are beamed down

class Beam {
  constructor(note){
    this.note = note;
    this.containerReference;
    this.reference;
    
    this.initialize();
  }
  
  initialize(){
    this.printBeamContainer();
    this.printBeam();
  }
  
  calculate(targetNote){
    if (targetNote === undefined){
      throw "Beam.calculateBeam must be given a target note";
    }
    
    let firstNote = $(this.note.noteStemReference).offset();
    let secondNote = $(targetNote.noteStemReference).offset();
    
    let beamPointingUp = true;
    
    let adj = secondNote.left - firstNote.left;
    
    let opp = firstNote.top - secondNote.top;
    if (opp < 0 ){ //if the second note has a lower x axis than the first and the beam needs to point down
      opp = Math.abs(opp);
      beamPointingUp = false;
    } //makes the opp a positive number if it is negative
    
    let hyp = Math.sqrt((adj * adj) + (opp * opp));
    
    var angle = Math.atan(opp / adj) * 180/Math.PI;
    
    if (beamPointingUp == true){
      angle = angle - angle - angle; //turns it into a negative number, which makes the beam point up.   
    }
    
    this.setBeamContainerCSS(angle);
    this.setBeamCSS(hyp);
    

  }
  
  private
  
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
    
    let css = {"height":"0px",
               "width":"0px",
               "transform":"rotate(" + rotate + "deg)",
              }
              
    $(this.containerReference).css(css);
  }
  
  setBeamCSS(width){
      let stemHeight = 3; 
    
      let css = {"height": stemHeight + "px",
                 "width": width + "px",
                 "background-color":"black",
                }
              
    $(this.reference).css(css);
  }
  
  
  
  
}

export default Beam;