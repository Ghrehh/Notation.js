class Bar {
  constructor(instrument, id){
    this.instrument = instrument;
    this.notation = this.instrument.notation;
    this.id = id;
    
    this.containerClassName = "bar-container";
    this.className = "instrument";
    
    this.barContainerHTML = '<div class="' + this.containerClassName + '" id="' + String(this.id) + '"></div>'; //container to be appended if it doesn't already exist
    this.barHTML =  '<div class="' + this.className + '" id="' + String(this.instrument.id) + '">' + this.instrument.name + " - ID: " + String(this.id) + '</div>';
    
    
    //this.initialize(); //need to make this a public method and run it from the instrument class creating it, pushBar is counting the number of bars in the bars array on the isntrument, so it need sto push before it starts
  }
  
  initialize(){
    this.checkIfBarContainerExists(); //checks if the bar container exists, before adding the bar
    this.pushBar();
  }
  
  redraw(){
    
  }
  
  pushBar(){
    console.log("Pushing bar");
    var currentBars = $(this.notation.container + " > ." + this.containerClassName)
    var targetBar = currentBars.eq(this.id); //bar you will be appending to
    targetBar.append(this.barHTML);
    
    $(this.notation.container + " ." + this.className).css(this.getBarCSS())
  }
  
  
  
  
  private
  
  
  //chcecks if a bar container already exists, so multiples do not get added
  checkIfBarContainerExists(){
    var barFound = false;
    var currentBars = $(this.notation.container + " > ." + this.containerClassName)
    
    for (let i = 0; i < currentBars.length; i++) {
      if (currentBars[i].id == this.id) {
        barFound = true;
      }
    }
    
    //if the barcontainer cannot be found, add it to the DOM
    if (barFound === false) {
      this.addBarContainer()
    }
    else {
      console.warn("Bar container already exists")
    }
  }
  
  addBarContainer(){
    $(this.notation.container).append(this.barContainerHTML);
  }
  
  removeBarsFromContainer(target){
    target.html("");
  }
  
  getBarCSS() {
    return {"height": String(this.notation.barHeight) + "px",
            "margin": "4px",
            "padding": "4px 8px"
          }
  }
  
}
export default Bar;