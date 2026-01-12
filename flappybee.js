// flappybee.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const heroBeeSVG = document.getElementById('hero-bee');
    const beeBodyHero = document.getElementById('bee-body-hero');
    const scoreEl = document.getElementById('score');
    const startScreen = document.getElementById('start-screen');
    const endScreen = document.getElementById('game-over-screen');

    if (!canvas || !heroBeeSVG) return;

    // --- Configuration & Variables ---
    const COMIC_INSULTS = ["$@%#!", "ZUT!", "OUCH!", "NOM D'UN...!", "GRRR!", "BOUM!"];
    let gameActive = false;
    let gameStarted = false;
    let score = 0;
    let frame = 0;
    let lastPipeHeight = window.innerHeight / 2;
    let obstacles = [];

    // Paramètres physiques de l'abeille
    let bee = { 
        x: 100, 
        y: window.innerHeight / 2, 
        w: 60, h: 40, 
        velocity: 0, 
        gravity: 0.4, 
        jump: -7,
        angle: 0
    };

    // --- Gestion Responsive du Canvas ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (!gameStarted) bee.y = canvas.height / 2;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Cycle de Vie du Jeu ---
    function startGame() {
        if (gameActive) return;
        gameStarted = true;
        gameActive = true;
        
        // Reset visuel et données
        heroBeeSVG.style.display = 'block';
        beeBodyHero.setAttribute('fill', '#FFD966'); 
        startScreen.style.display = 'none';
        endScreen.style.display = 'none';
        
        resetGameData();
        draw(); 
    }

    function resetGameData() {
        score = 0;
        scoreEl.innerText = "0";
        bee.y = canvas.height / 2;
        bee.velocity = 0;
        bee.angle = 0;
        obstacles = [];
        frame = 0;
        lastPipeHeight = canvas.height / 2;
    }

    // Gestion de la collision "colère" avant Game Over
    function triggerAngryState() {
        if (!gameActive) return;
        gameActive = false;

        // Effets visuels de l'accueil
        beeBodyHero.setAttribute('fill', '#ff4444'); 
        
        const bubble = document.createElement('div');
        bubble.classList.add('angry-bubble');
        bubble.innerText = COMIC_INSULTS[Math.floor(Math.random() * COMIC_INSULTS.length)];
        bubble.style.left = `${bee.x}px`;
        bubble.style.top = `${bee.y - 30}px`;
        document.getElementById('game-container').appendChild(bubble);

        // Délai pour laisser voir l'insulte avant l'écran final
        setTimeout(() => {
            bubble.remove();
            endScreen.style.display = 'block';
        }, 1000);
    }

    // --- Logique du Moteur de Jeu ---
    function createObstacle() {
        const gap = 180; 
        const minHeight = 80;
        const maxShift = 250; 
        
        let newHeight = lastPipeHeight + (Math.random() * maxShift * 2 - maxShift);
        if (newHeight < minHeight) newHeight = minHeight;
        if (newHeight > canvas.height - gap - minHeight) newHeight = canvas.height - gap - minHeight;

        lastPipeHeight = newHeight;
        obstacles.push({ x: canvas.width, y: 0, w: 60, h: newHeight, scored: false });
        obstacles.push({ x: canvas.width, y: newHeight + gap, w: 60, h: canvas.height - (newHeight + gap) });
    }

    function update() {
        if (!gameActive) return;

        bee.velocity += bee.gravity;
        bee.y += bee.velocity;

        // Rotation de l'abeille selon la vitesse
        bee.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bee.velocity * 0.1));
        heroBeeSVG.style.transform = `translate(${bee.x}px, ${bee.y}px) rotate(${bee.angle * 57.29}deg)`;

        // Particules de traînée (style accueil)
        if (frame % 6 === 0) createTrailParticle(bee.x, bee.y + 20);

        if (frame % 100 === 0) createObstacle();

        obstacles.forEach((obs, index) => {
            obs.x -= 3;

            // Détection de collision
            if (bee.x < obs.x + obs.w && bee.x + bee.w > obs.x &&
                bee.y < obs.y + obs.h && bee.y + bee.h > obs.y) {
                triggerAngryState();
            }

            // Calcul du score
            if (!obs.scored && obs.x + obs.w < bee.x) {
                if (index % 2 === 0) {
                    score++;
                    scoreEl.innerText = score;
                    obs.scored = true;
                }
            }
        });

        // Nettoyage obstacles hors écran
        obstacles = obstacles.filter(obs => obs.x + obs.w > 0);

        if (bee.y + bee.h > canvas.height || bee.y < 0) triggerAngryState();
        frame++;
    }

    // --- Rendu Graphique ---
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessin des Obstacles (Troncs)
        ctx.fillStyle = '#5D4037';
        obstacles.forEach(obs => {
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        });

        if (gameActive) {
            update();
            requestAnimationFrame(draw);
        } else if (gameStarted) {
            drawGameOverPanel();
        }
    }

    function drawGameOverPanel() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.shadowBlur = 0; 

        // Titre Game Over
        ctx.font = "bold 60px Quicksand, Arial";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);

        // Score Inviolable (dessiné sur canvas)
        ctx.font = "bold 24px Quicksand, Arial";
        ctx.fillStyle = "#fffbeb";
        ctx.fillText("SCORE :", canvas.width / 2 - 20, canvas.height / 2);

        ctx.fillStyle = "#fff";
        ctx.fillText(score, canvas.width / 2 + 40, canvas.height / 2);
    }

    function createTrailParticle(x, y) {
        const p = document.createElement('div');
        p.classList.add('bee-trail-particle');
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        document.getElementById('game-container').appendChild(p);
        setTimeout(() => p.remove(), 800);
    }

    // --- Contrôles ---
    const jumpAction = (e) => {
        if (gameActive) {
            bee.velocity = bee.jump;
            if (e.type === 'touchstart') e.preventDefault();
        }
    };

    window.addEventListener('keydown', (e) => { if (e.code === 'Space') jumpAction(e); });
    window.addEventListener('mousedown', jumpAction);
    window.addEventListener('touchstart', jumpAction, { passive: false });

    // Boutons Interface
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', startGame);
    document.getElementById('exit-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});