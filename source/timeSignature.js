class TimeSignature {
  constructor(bar, top, bottom){
    this.bar = bar;
    this.top = top;
    this.bottom = bottom;
    
    this.timeSignatureContainerReference;
    this.timeSignatureTopReference;
    this.timeSignatureBottomReference;
    
    this.initialize();
    
  }
  
  initialize(){
    this.removeOldTimeSignature();
    
    this.printTimeSignatureContainer();
    this.setTimeSignatureContainerReference();
    this.setTimeSignatureContainerCSS();
    
    this.printTimeSignatureTop();
    this.setTimeSignatureTopReference();
    this.setTimeSignatureTopCSS();
    
    this.printTimeSignatureBottom();
    this.setTimeSignatureBottomReference();
    this.setTimeSignatureBottomCSS();
    
    
  }
  
  //this needs to be public so it can be called from the bar method to removed a time signature
  removeOldTimeSignature(){ //removes the old time signature if one exists
    let bar = $(this.bar.reference);
    let oldTimeSignature = bar.children(".time-signature-container");
    
    if (oldTimeSignature.length > 0) {
      oldTimeSignature.remove();
    }
  }
  
  private

  
  printTimeSignatureContainer(){
    let bar = $(this.bar.reference);
    let html = '<div class="time-signature-container"></div>'
    //bar.append(html);
    
    if (bar.children(".key-signature-container").length > 0) {
      bar.children(".key-signature-container").after(html);
    }
    else if(bar.children(".clef").length > 0) {
      bar.children(".clef").after(html);
    }
    else {
      bar.children(".line-container").last().after(html);
    }
    
  }
  
  setTimeSignatureContainerReference(){
    let bar = $(this.bar.reference);
    let container = bar.children(".time-signature-container");
    this.timeSignatureContainerReference = container;
  }
  
  setTimeSignatureContainerCSS() {
    let container = $(this.timeSignatureContainerReference);
    let padding = $(this.bar.reference).height() / 5;
    let containerCSS = {"display": "inline-block",
                        "height": "100%",
                        "vertical-align": "top",
                        "padding-left": padding + "px",
                        "padding-right": padding * 2 + "px",
                        "position":"relative", //makes it sit above the lines
                        
                       }
                       
    container.css(containerCSS);
                       
  }
  
  
  
  printTimeSignatureTop(){
    let timeSignatureContainer = $(this.timeSignatureContainerReference);
    let html = '<p class="time-signature-top">' + this.top + '</p>'
    
    timeSignatureContainer.append(html);
    
  }
  
  setTimeSignatureTopReference(){
    let timeSignatureContainer = $(this.timeSignatureContainerReference);
    let top =  timeSignatureContainer.children(".time-signature-top");
    this.timeSignatureTopReference = top;
  }
  
  setTimeSignatureTopCSS() {
    let top = $(this.timeSignatureTopReference);
    
    let lineHeight = $(this.bar.reference).height() / 2;
    let topCSS = {"display": "inline-block",
                  "vertical-align": "top",
                  "margin": "0px",
                  "font-weight": "800",
                  "line-height": lineHeight + "px",
                  "font-size": lineHeight * 1.50 + "px",
                  "display": "block",
                  
                 }
                       
    top.css(topCSS);
                       
  }
  
  printTimeSignatureBottom(){
    let timeSignatureContainer = $(this.timeSignatureContainerReference);
    let html = '<p class="time-signature-bottom">' + this.bottom + '</p>'
    
    timeSignatureContainer.append(html);
    
  }
  
  setTimeSignatureBottomReference(){
    let timeSignatureContainer = $(this.timeSignatureContainerReference);
    let bottom =  timeSignatureContainer.children(".time-signature-bottom");
    this.timeSignatureTopReference = bottom;
  }
  
  setTimeSignatureBottomCSS() {
    let bottom = $(this.timeSignatureTopReference);
    
    let lineHeight = $(this.bar.reference).height() / 2;
    let bottomCSS = {"display": "inline-block",
                  "vertical-align": "top",
                  "margin": "0px",
                  "font-weight": "800",
                  "line-height": lineHeight + "px",
                  "font-size": lineHeight * 1.50 + "px",
                  "display": "block",
                  
                 }
                       
    bottom.css(bottomCSS);
                       
  }
  
}

export default TimeSignature;
