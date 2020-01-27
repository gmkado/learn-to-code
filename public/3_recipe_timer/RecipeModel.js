// See https://www.taniarascia.com/javascript-mvc-todo-app/
class RecipeModel{
  constructor() {
    this.steps = [];
  }

  addStep() {
    let newstep = { instruction: "", timeSec: 0, timeLeftSec:0};
    this.steps.push(newstep);
  }

  // Loop through all the steps and sum the time
  getTotalSeconds(){
    return this.steps.map(s => s.timeSec).reduce((t1, t2) => t1 + t2, 0);
  }

  decrementCurrentStep() {
    // TODO: find the earliest step with nonzero timeleft and decrement it
    
  }
}

class RecipesModel {
  constructor() {
    let sampleRecipe = new RecipeModel();
    sampleRecipe.steps = [
      { instruction: "abc", timeSec: 60, timeLeftSec: 60, isComplete:false},
      { instruction: "def", timeSec: 60, timeLeftSec: 60, isComplete:false}
    ];
    this.recipes = [sampleRecipe];      
    this.currentTime = 0;
  }

  addRecipe () {
    let newrecipe = new RecipeModel();
    this.recipes.push(newrecipe);
    this.handleChange();
  }

  deleteRecipe (recipe) {
    this.recipes = this.arrayRemove(this.recipes, recipe);
    this.handleChange();
  }

  addStep (recipe) {
    recipe.addStep();
    this.handleChange();
  }

  // total time is the max recipe time
  getTotalSeconds() {
    // ... is spread syntax https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return Math.max(...this.recipes.map(r => r.getTotalSeconds()));
  }

  bindOnChange(handler) {
    this.handleChange = handler;
  }  


  updateCurrentTime(currentCountdownSec) {
    this.recipes.forEach(r => {
      // translate to elapsed time in the recipe
      let recipeTimeElapsed = r.getTotalSeconds() - currentCountdownSec;
      if(recipeTimeElapsed < 0){
        // we havent gotten here yet, so still counting down...
      }else{
        r.decrementCurrentStep()
      }
    });

    this.handleChange();
  }

  // utility function to remove element from array
  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele != value;
    });
  }
}