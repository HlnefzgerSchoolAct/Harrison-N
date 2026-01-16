// Particle Network Animation
(function() {
    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Canvas sizing
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    // Track mouse movement
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Clear mouse position when leaving window
    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    });
    
    // Particle class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 30) + 1;
        }
        
        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        // Update particle position
        update() {
            // Check boundaries and bounce
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            // Mouse interaction - particles move away from cursor
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;
                
                if (this.x > mouse.x) {
                    this.x -= directionX;
                } else {
                    this.x += directionX;
                }
                
                if (this.y > mouse.y) {
                    this.y -= directionY;
                } else {
                    this.y += directionY;
                }
            }
            
            // Normal movement
            this.x += this.directionX;
            this.y += this.directionY;
            
            this.draw();
        }
    }
    
    // Particle array
    let particles;
    
    // Create particles
    function init() {
        particles = [];
        
        // Calculate number of particles based on screen size
        let numberOfParticles = (width * height) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            let color = 'rgba(255, 255, 255, 0.8)';
            
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    // Connect particles with lines
    function connect() {
        let opacityValue = 1;
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                              ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                // Draw line if particles are close enough
                if (distance < (width / 7) * (height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    
                    if (opacityValue < 0) {
                        opacityValue = 0;
                    }
                    
                    ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }
    
    // Initialize and start animation
    init();
    animate();
})();

