document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger') as HTMLElement;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Typing Effect
    const textElement = document.querySelector('.typing-text') as HTMLElement;
    const words: string[] = ['AI Student', 'Machine Learning Engineer', 'Data Scientist'];
    let wordIndex: number = 0;
    let charIndex: number = 0;
    let isDeleting: boolean = false;
    let typeSpeed: number = 100;

    function type(): void {
        const currentWord: string = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    if (textElement) {
        type();
    }

    // Scroll Animation Observer
    const observerOptions: IntersectionObserverInit = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    document.querySelectorAll('.project-card, .skill-card, .section-title').forEach(el => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.transform = 'translateY(20px)';
        (el as HTMLElement).style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    const revealObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                (entry.target as HTMLElement).style.opacity = '1';
                (entry.target as HTMLElement).style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-card, .section-title').forEach(el => {
        revealObserver.observe(el);
    });

    // Particle Network Animation
    const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
    
    if (canvas) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        let particlesArray: Particle[];

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors: string[] = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'];

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 2) - 1;
                this.directionY = (Math.random() * 2) - 1;
                this.size = (Math.random() * 2) + 1; // Random size between 1 and 3
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            // Method to draw individual particle
            draw(): void {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Check particle position, check mouse position, move the particle, draw the particle
            update(): void {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Move particle
                this.x += this.directionX * 0.5; // Speed factor
                this.y += this.directionY * 0.5;

                // Draw particle
                this.draw();
            }
        }

        // Create particle array
        function init(): void {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Animation loop
        function animate(): void {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Check if particles are close enough to draw line between them
        function connect(): void {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        // Use the color of particle 'a' for the line, but with opacity
                        // Convert hex to rgb to add opacity
                        const hex = particlesArray[a].color;
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b_val = parseInt(hex.slice(5, 7), 16);
                        
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b_val}, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Resize event
        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        init();
        animate();
    }
});
