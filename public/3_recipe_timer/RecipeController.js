class RecipeController {
  constructor(model, view) {    
    this.model = model;
    this.view = view;
    model.bindOnChange(this.handleModelChange);
    view.bindAddRecipe(this.handleAddRecipe);
    view.bindDeleteRecipe(this.handleDeleteRecipe);
    view.bindStartStopTimer(this.handleStartPause);
    view.bindReset(this.handleReset);

    //this.injectRecipe(); // for easier debugging
    this.reset();
  }

  injectRecipe(){
    let sampleRecipe = this.model.addRecipe();
    sampleRecipe.addStep("abc", 10);
    //sampleRecipe.addStep("def", 60);
  }

  // we need to use arrow key to get the appropriate 'this'
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  handleAddRecipe = () => {
    this.model.addRecipe();
  };

  handleDeleteRecipe = recipe => {
    this.model.deleteRecipe(recipe);
  };
  handleModelChange = () => {
    this.view.displayRecipes(this.model, this);
  };
  
  handleStartPause = () => {
    if(!this.cooking) {
      // first time after reset, so reset the current time
      this.currentTimeSec = this.model.getTotalSeconds();
      this.cooking = true;
    }

    if (this.paused) {
      // start
      this.paused = false;
      this.timerId = setInterval(this.onTick, 1000);
      this.view.setResetVisible(false); 
      this.onTick();  // this updates the ui immediately instead of waiting for the first tick
    }  else{
      // pause cooking and show the reset button
      clearInterval(this.timerId);
      this.paused = true;
      this.view.updateStartText(this.currentTimeSec);
      this.view.setResetVisible(true);
      this.handleModelChange();
    }  
  };  

  handleReset = ()=>{
    this.reset();
  }

  reset(){
    clearInterval(this.timerId); // stop the timer
    this.model.reset();
    this.view.reset();
    
    this.cooking = false;
    this.paused = true;
    this.handleModelChange();
  }

  onTick = () => {   
    // update the time
    this.view.updatePauseText(this.currentTimeSec);
    this.model.updateCurrentTime(this.currentTimeSec);
    this.currentTimeSec--;

    if (this.currentTimeSec < 0) {
      clearInterval(this.timerId); // stop timer
      this.view.done();
    }
  };
}
const app = new RecipeController(new RecipesModel(), new RecipeView());
