# Snow globe
- Start: 2020/01/31
- End: 2020/02/01
- Total time = 4 hrs
## Key learnings
### P5
This page used the processing library, so the main learnings were syntax for p5 and how the setup and draw loops work, how matrix manipulations like translate and rotate work, and how things are drawn to the canvas.

### Collision detection
This was easier than I thought it would be, simple geometry and length constraints.  Defining the behavior in object members and then applying these behaviors to large sets of objects is really cool to see, the larger interaction looks much more intricate and complex than the equations actually are. 

I also liked how you can play with the properties of the collision with sliders, so you can play with how much energy is lost with each collision.

## Todo
- The physics don't really resemble the flakes in a real snow globe.  Would be good to look at how that works
- Collision vectors aren't actually reflected, they're drawn to make the math simple (i.e. globe collisions just point towards the center, particle collisions point towards eachother) and don't follow momentum laws (momentum of the system is not conserved, particles maintain their original velocity).  There's no force balance either so things can get stuck on odd parts of the globe.  Its faked physics to make things look real, but there's obvious places where this breaks down.  
- particles get stuck outside the borders.  Collisions should be more rigidly enforced