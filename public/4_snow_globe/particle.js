class Particle{
    constructor(position) {
        this.radius = 10;
        this.position = position
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0.1)
    }

    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);        
    }

    draw(){
        fill(255)
        ellipse(this.position.x, this.position.y, 2*this.radius);
    }

    checkCollision(particle){
        // if the magnitude of the difference of the two position vectors is greater than 2*r, they are collding
        const {collision, diff} = this.isColliding(particle);
        if(collision) {
            // only update this vector's speed
            // since we call update on everything before draw, the other particle will be updated in its own loop
            this.onFrictionSurface();
            let scale = this.velocity.mag()/diff.mag() *0.8;
            this.velocity = diff.mult(scale);
        }
    }  
    
    isColliding(particle){
        let diff = this.position.copy().sub(particle.position);
        let diffMag = diff.mag();
        return {collision: diffMag < 2*this.radius, diff: diff}
    }

    onFrictionSurface(){
        if(this.velocity.mag() < 0.5) {
            this.velocity = createVector(0, 0);
        }
    }

    shake(){
        // give it a random velocity vector
        this.velocity = createVector(10*random(-1, 1), 10*random(-1,1))
    }
}