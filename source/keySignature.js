class KeySignature {
  constructor(bar, typeOf, numberOf ){
    this.bar = bar;
    this.instrument = this.bar.instrument;
    
    this.sharpHorizontalLineThickness = ($(this.bar.reference).height() / 4) / 2.75;
    this.sharpVerticalLineThickness = ($(this.bar.reference).height() / 4) / 4.25;
    
    this.numberOf = numberOf; //number of sharps or flats 0-7
    this.typeOf = typeOf; //sharps or flats
    
    this.keySignatureContainerClassName = "key-signature-container";
    this.keySignatureContainerReference;
    
    this.keySignatureClassName = "key-signature";
    
    
    this.initialize();
    
    
    //element heirarchy
    
    //div key-signature-container (holds all the sharp/flats)
      //div key-signature
        //sharp(1-4) (lines)
        
  }
  
  private
  
  initialize(){
    this.removeOldKeySignature();
    this.appendKeyContainer();
    this.setKeyContainerReference();
    this.setKeyContainerCSS();
    
    for(let i = 0; i < this.numberOf; i++) {
      
      this.appendKey();
      this.keyCSS(i);
      
      if(this.typeOf === "sharps") {
        this.drawSharp();
      }
      else if(this.typeOf === "flats") {
        this.drawFlat();
      }
      else {
        throw "valid type of keysignature was not passed, the valid paramaters are either 'sharps' or 'flats'";
      }
    }
    
    
  }
  
  removeOldKeySignature(){ //removes the old key signature if one exists
    let bar = $(this.bar.reference);
    let oldKey = bar.children("." + this.keySignatureContainerClassName)
    
    if (oldKey.length > 0) {
      oldKey.remove();
    }
  }
  //containers the keysignature
  appendKeyContainer(){
    let keyContainerHTML = '<div class="' + this.keySignatureContainerClassName + '"></div>'
    let targetBar = $(this.bar.reference);
    
    if (targetBar.children(".clef").length > 0) { //if the bar has a clef, append it after it. Otherwise it will append the keysignature before the clef
      targetBar.children(".clef").after(keyContainerHTML);
    }
    else {
       targetBar.children(".line-container").last().after(keyContainerHTML); //append it after the last line-container otherwise
    }
  }
  
  setKeyContainerReference(){
    let bar = $(this.bar.reference);
    let target = bar.children("." + this.keySignatureContainerClassName);
    
    this.keySignatureContainerReference = target;
  }
  
  setKeyContainerCSS(){
    
    let leftPadding = $(this.bar.reference).height() / 4;

    let style = {"display":"inline-block",
                "height": "100%",
                "vertical-align": "top",
                "padding-left": leftPadding + "px",
              };
              
    $(this.keySignatureContainerReference).css(style);
    
    
  }
  
  appendKey(){
    let keyHTML = '<div class"' + this.keySignatureClassName + '"></div>';
    let container = $(this.keySignatureContainerReference);
    
    container.append(keyHTML); //append new sharp
    
    
  }
  
  keyCSS(index){
    let topOffsetVal = $(this.bar.reference).height() / 4; //height of space between bar lines
    let topOffsetMult;
    if (this.typeOf === "sharps") {
      topOffsetMult = this.sharpsDictionary(index);
    }
    else if (this.typeOf === "flats") {
      topOffsetMult = this.flatsDictionary(index);
    }
    
    let container = $(this.keySignatureContainerReference);
    let newestElement = container.children().last(); //get the newly added element
    
    let width = $(this.bar.reference).height() / 2.5; //so the size scales when the height of the bar is changed
    
    let style = {"display":"inline-block",
                "vertical-align": "top",
                "width": width + "px",
                "position":"relative",
                "top": topOffsetVal * topOffsetMult,
                
                }
                
                
    newestElement.css(style);
  }
  
  
  drawSharp(){
    let container = $(this.keySignatureContainerReference); //key sig container
    let newestElement = container.children().last(); //latest instance of "key sig" which holds each sharp or flat
    
    this.firstSharpLine(newestElement); //topmost horizontal line
    this.secondSharpLine(newestElement); //bottom horizontal line
    this.thirdSharpLine(newestElement);
    this.fourthSharpLine(newestElement);
  }
  //topmost horizontal line
  firstSharpLine(keySignature){
    let kSig = $(keySignature); //target to append container too
    
    let lineContanerHTML = '<div class="line-container line-container1"></div>';
    
    let lineContainerCSS = {"height": "0",
                            "transform":"rotate(-10deg)",
                            "position":"relative",
                            "bottom": this.sharpHorizontalLineThickness / 2, //makes the line sit atop the bar line instead of below it
                           }
                           
    kSig.append(lineContanerHTML); 
    
    
    
    let lineContainer = kSig.children().last();//find container just added
    lineContainer.css(lineContainerCSS); //apply css to it
    
    let width = $(this.bar.reference).height() / 3; //width of the line, slightly less the than the width of the Key Signature so there is a gap between sharps/flats
    let lineHTML = '<div class="line line1"></div>';
    
    let lineCSS = {"width" : width + "px",
                   "height": this.sharpHorizontalLineThickness + "px",
                   "background-color":"black",
                    
                  }
                  
    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
    
  }
  //bottom horizontal line
  secondSharpLine(keySignature){
    let kSig = $(keySignature); //target to append container too
    
    let lineContanerHTML = '<div class="line-container line-container2"></div>';
    let topOffset = $(this.bar.reference).height() / 4; //same as the distance between lines
    
    let lineContainerCSS = {"height": "0",
                            "transform":"rotate(-10deg)",
                            "position": "relative",
                            "top": topOffset - (this.sharpHorizontalLineThickness / 2), //subtract half the thickness of the line so it sits atop the bar line
                           }
                           
    kSig.append(lineContanerHTML); 
    
    
    
    let lineContainer = kSig.children().last();//find container just added
    lineContainer.css(lineContainerCSS); //apply css to it
    
    let width = $(this.bar.reference).height() / 3; //width of the line, slightly less the than the width of the Key Signature so there is a gap between sharps/flats
    let lineHTML = '<div class="line line2"></div>';
    
    let lineCSS = {"width" : width + "px",
                   "height": this.sharpHorizontalLineThickness + "px",
                   "background-color":"black",
                    
                  }
                  
    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
    
  }
  
  thirdSharpLine(keySignature){
    let kSig = $(keySignature); //target to append container too
    
    
    let widthOfHorizontalLine = $(this.bar.reference).height() / 3;
    
    let lengthOfVerticalLine = $(this.bar.reference).height() / 2;
    
    let lineContanerHTML = '<div class="line-container line-container3"></div>';
    let topOffset = $(this.bar.reference).height() / 4; //same as the distance between lines
    
    let lineContainerCSS = {"height": "0",
                            "position": "relative",
                            "bottom": lengthOfVerticalLine / 4, //subtract half the thickness of the line so it sits atop the bar line
                            "left": widthOfHorizontalLine / 5,
                           }
                           
    kSig.append(lineContanerHTML); 
    
    
    
    let lineContainer = kSig.children().last();//find container just added
    lineContainer.css(lineContainerCSS); //apply css to it
    
    let lineHTML = '<div class="line line3"></div>';
    
    let lineCSS = {"width" : this.sharpVerticalLineThickness + "px",
                   "height": lengthOfVerticalLine + "px",
                   "background-color":"black",
                    
                  }
                  
    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
    
  }
  
  fourthSharpLine(keySignature){
    let kSig = $(keySignature); //target to append container too
    
    
    let widthOfHorizontalLine = $(this.bar.reference).height() / 3;
    
    let lengthOfVerticalLine = $(this.bar.reference).height() / 2;
    
    let lineContanerHTML = '<div class="line-container line-container4"></div>';
    let topOffset = $(this.bar.reference).height() / 4; //same as the distance between lines
    
    let lineContainerCSS = {"height": "0",
                            "position": "relative",
                            "bottom": lengthOfVerticalLine / 4, //subtract half the thickness of the line so it sits atop the bar line
                            "left": (widthOfHorizontalLine / 5) * 3,
                           }
                           
    kSig.append(lineContanerHTML); 
    
    
    
    let lineContainer = kSig.children().last();//find container just added
    lineContainer.css(lineContainerCSS); //apply css to it
    
    let lineHTML = '<div class="line line4"></div>';
    
    let lineCSS = {"width" : this.sharpVerticalLineThickness + "px",
                   "height": lengthOfVerticalLine + "px",
                   "background-color":"black",
                    
                  }
                  
    lineContainer.append(lineHTML);
    lineContainer.children().css(lineCSS);
    
  }
  
  sharpsDictionary(index) {
    let dictionary = [-0.5, 1, -1, 0.5, 2, 0, 1.5];
    
    if(this.instrument.clef === "bass") { //bass clef moves everything down a whole line or space
      return dictionary[index] + 1;
    }
    
    return dictionary[index];
  }
  
  
  drawFlat(){
    let container = $(this.keySignatureContainerReference); //key sig container
    let newestElement = container.children().last();
    
    this.flatHead(newestElement);
    this.flatStem(newestElement);
    
  }
  
  flatHead(keySignature){
    let newestElement = $(keySignature);
    let flatHeadContainerHTML = '<div class="flat-head-container"></div>';
    
    let flatHeadContainerCSS = {"height":"0px",
                                //"transform": "rotate(-20deg)",
                                 
                                }
                  
    newestElement.append(flatHeadContainerHTML);
    
    let flatHeadContainer = newestElement.children().last();
    flatHeadContainer.css(flatHeadContainerCSS);
    
    let flatHeadHTML = '<div class="flat-head"></div>';
    
    let height = $(this.bar.reference).height() / 4; //size of space between lines
    
    let flatHeadCSS = {"border": "1px solid black",
                       "height": height + "px",
                       "width": height * 0.80 + "px",
                       "border-width": (height / 4) + "px " + (height / 2.5) + "px " + (height / 8) + "px " + (height / 8) + "px",
                       "border-radius": (height * 1.15) + "px " + ((height * 1.15) / 2) + "px " + (height * 1.15) + "px " + "0px",
                       "box-sizing":"border-box",
                       
                       // (height / 4) + "px " + (height / 3) + "px " + (height / 8) + "px " + (height / 8) + "px"
                      
                       
                      }
    flatHeadContainer.append(flatHeadHTML);
    let flatHead = flatHeadContainer.children();
    
    flatHead.css(flatHeadCSS);
  }
  
  flatStem(keySignature){
    let newestElement = $(keySignature);
    let flatStemContainerHTML = '<div class="flat-stem-container"></div>';
    
    let flatStemContainerCSS = {"height":"0px",
                                 
                                }
                  
    newestElement.append(flatStemContainerHTML);
    
    let flatStemContainer = newestElement.children().last();
    flatStemContainer.css(flatStemContainerCSS);
    
    let flatStemHTML = '<div class="flat-stem"></div>';
    
    let height = $(this.bar.reference).height() / 4; //size of space between lines
    
    let flatStemCSS = {"background-color": "black",
                       "height": (height * 2.5) + "px",
                       "width": (height / 4) + "px",
                       "position":"relative",
                       "bottom": (height * 1.5) + "px"

                       
                      }
    flatStemContainer.append(flatStemHTML);
    let flatHead = flatStemContainer.children();
    
    flatHead.css(flatStemCSS);
  }
  
  
  flatsDictionary(index) {
    let dictionary = [1.5, 0, 2, 0.5, 2.5, 1, 3];
    
    if(this.instrument.clef === "bass") { //bass clef moves everything down a whole line or space
      return dictionary[index] + 1;
    }
    
    return dictionary[index];
    

  }
}

export default KeySignature;