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
    this.view.displayRecipes(this.model);
  };
  handleStartStopTime = () => {
    if (this.view.cooking) {
      this.view.cooking = false;
      clearInterval(this.timerId);
      this.view.updateStartText(this.model.getTotalSeconds());
    }
    else {
      // Check that input fields are valid before starting
      if (this.view.isValid()) {
        this.view.cooking = true;
        this.currentTimeSec = this.model.getTotalSeconds();
        this.timerId = setInterval(this.onTick, 1000);
      }
    }
  };
  onTick = () => {
    // update the time
    this.currentTimeSec--;
    this.view.updateStopText(this.currentTimeSec);
    this.model.updateCurrentTime(this.currentTimeSec);
  };
}
const app = new RecipeController(new RecipesModel(), new RecipeView());
