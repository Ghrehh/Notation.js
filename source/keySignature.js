class KeySignature {
  constructor(bar){
    this.bar = bar;
    this.instrument = this.bar.instrument;
    
    this.numberOf = 7; //number of sharps or flats 0-7
    this.typeOf = "sharps"; //sharps or flats
    
    this.keySignatureContainerClassName = "key-signature-container";
    this.keySignatureContainerReference;
    
    this.keySignatureClassName = "key-signature";
    
    this.sharpClassName = "sharp"
    
    this.initialize();
    
    
    //element heirarchy
    
    //div key-signature-container (holds all the sharp/flats)
      //div key-signature
        //sharp(1-4) (lines)
        
  }
  
  private
  
  initialize(){
    this.appendKeyContainer();
    this.setKeyContainerReference();
    this.setKeyContainerCSS();
    
    for(let i = 0; i < this.numberOf; i++) {
      
      this.appendKey();
      this.keyCSS();
      
      if(this.typeOf === "sharps") {
        this.drawSharp();
      }
      else if(this.typeOf === "flats") {
        
      }
      else {
        throw "valid type of keysignature was not passed, the valid paramaters are either 'sharps' or 'flats'";
      }
    }
    
    
  }
  
  //containers the keysignature
  appendKeyContainer(){
    let keyContainerHTML = '<div class="' + this.keySignatureContainerClassName + '"></div>'
    let targetBar = $(this.bar.reference);
    
    targetBar.append(keyContainerHTML);
  }
  
  setKeyContainerReference(){
    let bar = $(this.bar.reference);
    let target = bar.children("." + this.keySignatureContainerClassName);
    
    this.keySignatureContainerReference = target;
  }
  
  setKeyContainerCSS(){

    let style = {"display":"inline-block",
                "height": "100%",
                "vertical-align": "top",
              };
              
    $(this.keySignatureContainerReference).css(style);
    
    
  }
  
  appendKey(){
    let keyHTML = '<div class"' + this.keySignatureClassName + '"></div>';
    let container = $(this.keySignatureContainerReference);
    
    container.append(keyHTML); //append new sharp
    
    
  }
  
  keyCSS(){
    let container = $(this.keySignatureContainerReference);
    let newestElement = container.children().last(); //get the newly added element
    
    let width = $(this.bar.reference).height() / 2.5;
    
    let style = {"display":"inline-block",
                //"background-color":"black",
                "border":"1px solid black",
                "vertical-align": "top",
                "width": width + "px",
                
                }
                
                
    newestElement.css(style);
  }
  
  drawSharp(){
    let container = $(this.keySignatureContainerReference); //key sig container
    let newestElement = container.children().last(); //latest instance of "key sig" which holds each sharp or flat
    
    this.firstSharpLine(newestElement);
    this.secondSharpLine(newestElement);
    this.thirdSharpLine(newestElement);
    this.fourthSharpLine(newestElement);
  }
  
  firstSharpLine(keySignature){
    let kSig = $(keySignature);
    
    let lineHTML = '<div class="line line1"></div>';
  }
  
  secondSharpLine(keySignature){
    let kSig = $(keySignature);
    
    let lineHTML = '<div class="line line2"></div>';
    
  }
  
  thirdSharpLine(keySignature){
    let kSig = $(keySignature);
    
    let lineHTML = '<div class="line line3"></div>';
    
  }
  
  fourthSharpLine(keySignature){
    let kSig = $(keySignature);
    
    let lineHTML = '<div class="line line4"></div>';
    
  }
}

export default KeySignature;