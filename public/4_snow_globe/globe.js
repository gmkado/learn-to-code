class Globe {
  constructor(radius) {
    this.radius = radius;
    this.particles = [];
  }

  update() {
    this.particles.forEach(p1 => {
			p1.update();
			
			this.checkGlobeCollision(p1);

			this.particles.forEach(p2 => {
				if(p1 != p2) {
					p1.checkCollision(p2);
				}
			});
    });
  }

	checkGlobeCollision(particle) {
		if (this.outOfBounds(particle)) {
			particle.onFrictionSurface();

			// redirect the particles velocity vector
			let vel = particle.velocity;
			let pos = particle.position;
			let scale = vel.mag() / pos.mag() * 0.8;
			particle.velocity = createVector(-pos.x, -pos.y).mult(scale);
		}
	}

  draw() {
    // draw the globe
		ellipse(0, 0, 2*this.radius);

    this.particles.forEach(particle => {
      particle.draw();
    });
  }

  addParticle(pos) {
		// don't allow interfering particles
		let newParticle = new Particle(pos);
		if(this.outOfBounds(newParticle)) {
			return;
		}

		for(var p of this.particles) {
			const {collision, _} = p.isColliding(newParticle);
			if(collision) {
				return;
			}
		}

		// no collisions, so add it to the list
    this.particles.push(newParticle);
	}
	
	outOfBounds(particle) {
		// the particle is out of bounds if the position vector magnitude is greater than the radius
		return particle.position.mag() > this.radius - particle.radius;
	}

	shake(){
		this.particles.forEach(p => {
			p.shake();
		});
	}
}
