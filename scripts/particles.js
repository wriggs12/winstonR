const PARTICLE_COLOR = "142, 202, 230";
const PARTICLE_DENSITY_AREA = 900 * 900;
const PARTICLE_BASE_COUNT = 50;
const LINK_DISTANCE = 160;
const LINK_OPACITY = 0.15;
const GRAB_DISTANCE = 180;
const GRAB_OPACITY = 0.25;
const SPEED = 0.6;

const initParticles = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

    const canvas = document.getElementById("particles-bg");
    if (!canvas)
        return;

    const ctx = canvas.getContext("2d");
    const pointer = { x: null, y: null };
    let particles = [];
    let width = 0;
    let height = 0;

    const random = (min, max) => min + Math.random() * (max - min);

    const makeParticle = () => {
        const angle = Math.random() * Math.PI * 2;

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * SPEED,
            vy: Math.sin(angle) * SPEED,
            radius: random(1, 2.5),
            opacity: random(0.15, 0.4)
        };
    };

    const resize = () => {
        const ratio = window.devicePixelRatio || 1;

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        const count = Math.round(PARTICLE_BASE_COUNT * (width * height) / PARTICLE_DENSITY_AREA);

        while (particles.length < count)
            particles.push(makeParticle());

        particles.length = Math.max(count, 1);
    };

    const move = (particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -particle.radius)
            particle.x = width + particle.radius;
        else if (particle.x > width + particle.radius)
            particle.x = -particle.radius;

        if (particle.y < -particle.radius)
            particle.y = height + particle.radius;
        else if (particle.y > height + particle.radius)
            particle.y = -particle.radius;
    };

    const drawLink = (ax, ay, bx, by, opacity) => {
        ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            move(particle);

            for (let j = i + 1; j < particles.length; j++) {
                const other = particles[j];
                const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

                if (distance < LINK_DISTANCE)
                    drawLink(particle.x, particle.y, other.x, other.y, LINK_OPACITY * (1 - distance / LINK_DISTANCE));
            }

            if (pointer.x !== null) {
                const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);

                if (distance < GRAB_DISTANCE)
                    drawLink(particle.x, particle.y, pointer.x, pointer.y, GRAB_OPACITY * (1 - distance / GRAB_DISTANCE));
            }

            ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    });
    window.addEventListener("pointerleave", () => {
        pointer.x = null;
        pointer.y = null;
    });

    resize();
    requestAnimationFrame(draw);
};

document.addEventListener("DOMContentLoaded", initParticles);
