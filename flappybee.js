

// flappybee.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    

    // Vérification de sécurité
    if (!canvas) {
        console.error("Erreur : L'élément <canvas id='gameCanvas'> est introuvable dans le HTML.");
        return;
    }

    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');

    // On adapte le canvas à la taille de la fenêtre
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- Paramètres du jeu ---
    let bee = { 
        x: 100, // On l'avance un peu plus pour mieux voir venir
        y: canvas.height / 2, 
        w: 40, h: 30, 
        velocity: 0, 
        gravity: 0.4, // Gravité un peu plus douce (était 0.5)
        jump: -7      // Saut un peu plus léger (était -8)
    };
    let obstacles = [];
    let frame = 0;
    let score = 0;
    let gameActive = false;
    // Ajoutez cette variable en haut de votre script avec les autres paramètres
    let lastPipeHeight = canvas.height / 2; 

    let gameStarted = false; // Nouvel état

    const startScreen = document.getElementById('start-screen');
    const endScreen = document.getElementById('game-over-screen');

    // --- Fonctions de gestion d'état ---
    function startGame() {
        gameStarted = true;
        gameActive = true;
        startScreen.style.display = 'none';
        endScreen.style.display = 'none';
        resetGameData();
        draw(); // On lance la boucle
    }

    function gameOver() {
        gameActive = false;
        //document.getElementById('final-score').innerText = score;
        endScreen.style.display = 'block';
    }

    function resetGameData() {
        score = 0;
        document.getElementById('score').innerText = "0";
        bee.y = canvas.height / 2;
        bee.velocity = 0;
        obstacles = [];
        frame = 0;
        lastPipeHeight = canvas.height / 2;
    }

    // --- Écouteurs de boutons ---
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', startGame);
    document.getElementById('exit-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });


    function createObstacle() {
        const gap = 180; // Espace vertical entre les poteaux (un peu réduit pour le défi)
        const minHeight = 80;
        
        // --- NOUVELLE LOGIQUE DE GÉNÉRATION SÉCURISÉE ---
        // On définit un écart maximum de montée/descente (ex: 150px)
        const maxShift = 250; 
        
        let newHeight = lastPipeHeight + (Math.random() * maxShift * 2 - maxShift);

        // Sécurité : On reste dans les limites de l'écran
        if (newHeight < minHeight) newHeight = minHeight;
        if (newHeight > canvas.height - gap - minHeight) newHeight = canvas.height - gap - minHeight;

        // On enregistre pour le prochain calcul
        lastPipeHeight = newHeight;

        obstacles.push({ x: canvas.width, y: 0, w: 60, h: newHeight, type: 'top' });
        obstacles.push({ x: canvas.width, y: newHeight + gap, w: 60, h: canvas.height - newHeight - gap, type: 'bottom' });
    }

    function update() {
        if (!gameActive) return;

        bee.velocity += bee.gravity;
        bee.y += bee.velocity;

        if (frame % 100 === 0) createObstacle();

        obstacles.forEach((obs, index) => {
            obs.x -= 3;
            if (bee.x < obs.x + obs.w && bee.x + bee.w > obs.x &&
                bee.y < obs.y + obs.h && bee.y + bee.h > obs.y) {
                gameOver();
            }
            if (obs.x + obs.w < 0) {
                if (index % 2 === 0) { score++; scoreEl.innerText = score; }
                obstacles.splice(index, 1);
            }
        });

        if (bee.y + bee.h > canvas.height || bee.y < 0) gameOver();
        frame++;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessin de l'Abeille
        ctx.fillStyle = '#F67B00';
        ctx.fillRect(bee.x, bee.y, bee.w, bee.h);

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
        // 1. On assombrit légèrement le fond du jeu pour faire ressortir le texte
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Configuration du texte
        ctx.textAlign = "center";
        
        // ON DÉSACTIVE LE GLOW (L'effet de miel décoratif)
        ctx.shadowBlur = 0; 
        ctx.shadowColor = "transparent";

        // Titre "FIN DE RÉCOLTE"
        ctx.font = "bold 60px Quicksand, Arial";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);

         // Sous-titre
        ctx.font = "bold 24px Quicksand, Arial";
        ctx.fillStyle = "#fffbeb";
        ctx.fillText("SCORE :", canvas.width / 2, canvas.height / 2 );

        // Score final (Gros et blanc au centre)
        ctx.font = "bold 24px Quicksand, Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(score, canvas.width / 2 + 60, canvas.height / 2 );

       
    }

    // Contrôles
    window.addEventListener('keydown', (e) => { if (e.code === 'Space') bee.velocity = bee.jump; });
    window.addEventListener('mousedown', () => { bee.velocity = bee.jump; });

});