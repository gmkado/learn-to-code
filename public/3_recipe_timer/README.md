# Recipe Timer
- Start: 2020/01/17
- End: 2020/01/31
- Total time = 3 sessions
## Key learnings
### Javascript
#### Object oriented programming
The whole point of this page is to be able to manage multiple recipes and multiple steps per recipe.

Abstracting out behavior of recipes and steps made it easy to write things like `recipe.delete(step)` and trust that the recipe knew how to do this.

#### MVC
I started out coding this up with all the view code mixed in with the model, but this quickly got unmanageable.  I found myself querying for views all over the place.  It was difficult to see where the logic was since it was buried in a bunch of dom manipulation.

Then I read this article:
https://www.taniarascia.com/javascript-mvc-todo-app/

At first setting up the binding was a little confusing, and I ran into this issue when I didn't use the fat arrow notation with the bound handlers:
https://stackoverflow.com/a/31095976/3525158

But separating this code made it much easier to find things and make changes to the model or view without affecting the other.  Sometimes the lines were blurred on where a change should go, and the elements would bleed into each other.
#### Timers
Since this recipe needed a timer, I managed this by using the javascript `setInterval` method: 

```this.timerId = setInterval(this.onTick, 1000); // start timer```

``` clearInterval(this.timerId); // stop timer ```

### HTML
#### Templates
I used templates to define the html for the recipe/step, and clone that template whenever a new item was created.  I could have built it up in code, but the template made it easy to see what my element would look like by simply removing the `template` wrapper.

### CSS
I bit the bullet and cleaned up my styling on this project.  It was getting out of hand.  I don't like how google firebase brings in its own styling.

#### BEM
I was spending way too much time trying to thing of descriptive and unique names for my css classes.  BEM (Block-Element-Modifier) is a logic-based naming system that makes it easier to look at a descriptor and know exactly what it applies to:
https://seesparkbox.com/foundry/bem_by_example

#### Sass/SCSS
http://thesassway.com/editorial/sass-vs-scss-which-syntax-is-better

The cascading nature of CSS makes it hard to see where styles are coming from, even with the chrome inspection tools.  Sass allows the css to be written in a more heirarchical way.

This stuff is easy to forget so here or some links:

- Really good write-up:
https://sass-guidelin.es/#architecture

- Boilerplate repo https://github.com/HugoGiraudel/sass-boilerplate
- Official (?) docs https://sass-lang.com/guide
- Using @ directives to write mixins: https://thoughtbot.com/blog/sasss-content-directive

The last link I used to BEMify my css, enforcing the block--element--modifier structure:

```
// in mixins.scss
@mixin element($name) {
  @at-root #{&}__#{$name} {
    @content;
  }
}

@mixin modifier($name) {
  @at-root #{&}--#{$name} {
    @content;
  }
}
```

```
// in _3_recipe_timer.scss
.step{
    background-color: lightgrey;
    border-radius: 4px;
    padding: 4px 2px;
    margin: 4px 2px;

    @include element(time-input){
        text-align: right;
        max-width: 50%;
        padding: 0px;
    }
```


#### Form validation
Using forms allowed really easy validation:

```<input type="number" class="step__time-input col" id="step__time" min="1" step="1" required="true"/>```

Then in RecipeView.js:
```
    let step_times = document.querySelectorAll(".step__time");

    return Array.from(step_times)
      .map(t => t.reportValidity())
      .reduce((valid1, valid2) => valid1 && valid2);
```
This validates all the time input fields in two lines of code (could be one line if I didn't care about readability)

## Todo
- State management was messy.  I ended up using separate bools `cooking` and `paused`, and also had special cleanup code for `reset` and `not started`.  I should have recognized that a `STATE` variable would clean things up significantly.  Ideally, the `view` object would just take the `model` and a `state`, and know exactly how to display everything
- I'm not sure if all the timing logic belonged in the `controller`.  It got much messier than I wanted with how the button text was updated.  I think I should have broken the timing aspect out into a separate object and passed it as well to the `view` when the model changed
- This project would have benefited from a UML class diagram
- 