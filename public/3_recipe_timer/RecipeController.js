class RecipeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.cooking = false;
    model.bindOnChange(this.handleModelChange);
    view.bindAddRecipe(this.handleAddRecipe);
    view.bindAddStep(this.handleAddStep);
    view.bindDeleteRecipe(this.handleDeleteRecipe);
    view.bindStartStopTimer(this.handleStartStopTime);
    this.handleModelChange();
  }
  // we need to use arrow key to get the appropriate 'this'
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  handleAddRecipe = () => {
    this.model.addRecipe();
  };
  handleAddStep = recipe => {
    this.model.addStep(recipe);
  };
  handleDeleteRecipe = recipe => {
    this.model.deleteRecipe(recipe);
  };
  handleModelChange = () => {
    this.view.displayRecipes(this.model, this.cooking);
  };
  handleStartStopTime = () => {
    if (this.model.done) {
      this.model.reset();
    } else {
      if (this.cooking) {
        this.cooking = false;
        clearInterval(this.timerId);
        this.view.updateStartText(this.model.getTotalSeconds());
      } else {
        // Check that input fields are valid before starting
        if (this.view.isValid()) {
          this.cooking = true;
          this.currentTimeSec = this.model.getTotalSeconds();
          this.timerId = setInterval(this.onTick, 1000);
        }
      }
    }
  };  
  onTick = () => {
    if (this.model.done) {
      clearInterval(this.timerId); // stop the timer
      this.view.updateResetText();
      return;
    }

    // update the time
    this.currentTimeSec--;
    this.view.updateStopText(this.currentTimeSec);
    this.model.updateCurrentTime(this.currentTimeSec);
  };
}
const app = new RecipeController(new RecipesModel(), new RecipeView());
