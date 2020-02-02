class Particle{
    constructor(position) {
        this.radius = 10;
        this.position = position
        this.velocity = createVector(0, 0);
        this.grounded = false; // are we attached to the border?
        this.rotation = 0;
    }

    update(){

        let acceleration = createVector(0, gravitySlider.value());
        let randomGen = () => random(-1, 1) * randomnessSlider.value();
        acceleration.add(createVector(randomGen(), randomGen())); // add a little randomness
        this.position.add(this.velocity);
        this.velocity.add(acceleration);
        let sign = this.velocity.x < 0 ? -1 : 1; 
        this.rotation = sign* this.velocity.mag();       
    }

    draw(){
        if(this.grounded){
            fill(0, 0, 255)
        }else{
            fill(255)
        }

        ellipse(this.position.x, this.position.y, 2*this.radius);
        push();
        // translate to the lower left corner
        translate(this.position.x, this.position.y);
        rotate(this.rotation);
        textAlign(CENTER, CENTER);
        text('🐧', 0, 0);
        pop();
    }

    checkCollision(particle){
        // if the magnitude of the difference of the two position vectors is greater than 2*r, they are collding
        const {collision, diff} = this.isColliding(particle);
        if(collision) {            
            // only if the colliding particle is grounded, try thresholding.  This prevents floating particles
            if(particle.grounded) {
                this.thresholdVelocity();
                if(this.velocity.mag() === 0){
                    // now we're collided with a particle that is also grounded
                    this.grounded = true;
                    return;
                }  
            }
            // only update this vector's speed, since we call update on everything before draw, the other particle will be updated in its own loop
            let scale = this.velocity.mag()/diff.mag() *lossySlider.value();
            this.velocity = diff.mult(scale);
        }
    }  
    
    
    /**
     *Check if another particle is colliding with this one
     *
     * @param {Particle} particle
     * @returns {Object} collisionInfo
     * @returns {boolean} collisionInfo.collision - is this particle colliding
     * @returns {Vector} collisionInfo.diff - the vector resulting from the operation this-particle
     * @memberof Particle
     */
    isColliding(particle){
        let diff = this.position.copy().sub(particle.position);
        let diffMag = diff.mag();
        return {collision: diffMag < 2*this.radius, diff: diff}
    }

    
    /**
     *Apply thresholding to the velocity vector to prevent jittery particles
     *
     * @memberof Particle
     */
    thresholdVelocity(){
        if(this.velocity.mag() < 0.5) {
            this.velocity = createVector(0, 0);
        }
    }

    
    /**
     *Shake things up by applying a random velocity
     *
     * @memberof Particle
     */
    shake(){
        // give it a random velocity vector
        this.velocity = createVector(10*random(-1, 1), 10*random(-1,1))
    }
}