const main = document.querySelector('main');
const NB_BEES = 5;
const bees = [];

// Liste d'insultes style BD
const COMIC_INSULTS = ["$@%#!", "GRRR!", "ZUT!", "#@&%*!", "OUCH!", "NOM D'UN...!", "SCRONGNEUGNEU!"];

let flowers = [];
function updateFlowerPositions() {
    const flowerElements = document.querySelectorAll('.scattered-flower');
    flowers = Array.from(flowerElements).map(f => ({
        x: f.offsetLeft + f.clientWidth / 2,
        y: f.offsetTop + f.clientHeight / 2
    }));
}

let zoneWidth = main.clientWidth;
let zoneHeight = main.clientHeight;

class Bee {
    constructor() {
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element.setAttribute("viewBox", "0 0 120 80");
        this.element.classList.add('flying-bee');
        // Ajout d'un ID unique au corps pour pouvoir changer sa couleur facilement
        this.bodyId = 'bee-body-' + Math.random().toString(36).substr(2, 9);
        this.element.innerHTML = `
            <g class="bee-body">
                <ellipse id="${this.bodyId}" cx="60" cy="40" rx="30" ry="20" fill="#FFD966" stroke="#E07B00" stroke-width="2"/>
                <path d="M45 40 q15 -15 30 0" fill="none" stroke="#E07B00" stroke-width="5" />
                <circle cx="80" cy="35" r="3" fill="#222"/>
            </g>
            <ellipse class="bee-wing wing-l" cx="50" cy="25" rx="15" ry="10" fill="white" opacity="0.8"/>
            <ellipse class="bee-wing wing-r" cx="70" cy="25" rx="15" ry="10" fill="white" opacity="0.8"/>
        `;
        main.appendChild(this.element);

        // Paramètres de vol
        this.speed = 2 + Math.random() * 1.5;
        this.pos = { x: Math.random() * zoneWidth, y: Math.random() * zoneHeight };
        this.target = { x: this.pos.x, y: this.pos.y };
        this.angle = Math.random() * 360;
        this.frameCounter = 0;
        
        this.isPollinating = false;
        this.pollinationTimer = 0;

        // --- NOUVEAUX PARAMÈTRES : COLÈRE ---
        this.isAngry = false;
        this.angerTimer = 0;
        this.bubbleElement = null;

        // Ajout de l'écouteur de clic
        this.element.addEventListener('mousedown', (e) => {
            // On empêche le clic de se propager (par ex: pour ne pas ouvrir la ruche derrière)
            e.stopPropagation(); 
            this.becomeAngry();
        });
    }

    // --- Méthodes de gestion de la colère ---

    becomeAngry() {
        if (this.isAngry) return; // Si déjà énervée, on ne fait rien de plus

        this.isAngry = true;
        // Elle reste énervée environ 2 secondes (120 frames à 60fps)
        this.angerTimer = 120; 
        this.isPollinating = false; // Si elle butinait, elle arrête

        // 1. Changement de couleur en ROUGE
        const bodyPart = this.element.querySelector(`#${this.bodyId}`);
        if (bodyPart) bodyPart.setAttribute('fill', '#ff4444'); // Rouge tomate

        // 2. Création de la bulle
        this.bubbleElement = document.createElement('div');
        this.bubbleElement.classList.add('angry-bubble');
        // Choix d'une insulte aléatoire
        this.bubbleElement.innerText = COMIC_INSULTS[Math.floor(Math.random() * COMIC_INSULTS.length)];
        main.appendChild(this.bubbleElement);
        
        // Positionnement initial de la bulle
        this.updateBubblePosition();
    }

    calmDown() {
        this.isAngry = false;
        
        // 1. Retour à la couleur jaune d'origine
        const bodyPart = this.element.querySelector(`#${this.bodyId}`);
        if (bodyPart) bodyPart.setAttribute('fill', '#FFD966');

        // 2. Suppression de la bulle
        if (this.bubbleElement) {
            this.bubbleElement.remove();
            this.bubbleElement = null;
        }
        
        // Elle repart vers une nouvelle cible
        this.setNewTarget();
    }

    updateBubblePosition() {
        if (this.bubbleElement) {
            // La bulle suit l'abeille, légèrement au-dessus
            this.bubbleElement.style.left = `${this.pos.x}px`;
            this.bubbleElement.style.top = `${this.pos.y - 30}px`;
        }
    }

    // --- Boucle principale ---

    update() {
        // GESTION DE LA COLÈRE (Prioritaire)
        if (this.isAngry) {
            this.angerTimer--;
            
            // Effet de tremblement de colère
            const shakeX = (Math.random() - 0.5) * 8;
            const shakeY = (Math.random() - 0.5) * 8;

            // On garde l'angle actuel mais on ajoute le tremblement
            const radians = this.angle * Math.PI / 180;
            const flip = (Math.cos(radians) < 0) ? -1 : 1;
            this.element.style.transform = `translate(${this.pos.x + shakeX}px, ${this.pos.y + shakeY}px) translate(-50%, -50%) rotate(${this.angle}deg) scaleY(${flip})`;
            
            // La bulle doit suivre le tremblement
            if (this.bubbleElement) {
                 this.bubbleElement.style.left = `${this.pos.x + shakeX}px`;
                 this.bubbleElement.style.top = `${this.pos.y - 30 + shakeY}px`;
            }

            if (this.angerTimer <= 0) {
                this.calmDown();
            }
            return; // On stoppe le reste de la logique de mouvement
        }


        // GESTION DU BUTINAGE (Si pas énervée)
        if (this.isPollinating) {
            this.pollinationTimer--;
            const wiggle = Math.sin(Date.now() * 0.1) * 2;
            this.element.style.transform = `translate(${this.pos.x}px, ${this.pos.y + wiggle}px) translate(-50%, -50%) rotate(${this.angle}deg)`;
            
            if (this.pollinationTimer <= 0) {
                this.isPollinating = false;
                this.setNewTarget();
            }
            return;
        }

        // GESTION DU VOL NORMAL
        const distToTarget = Math.hypot(this.target.x - this.pos.x, this.target.y - this.pos.y);
        
        if (distToTarget < 10) {
            const onFlower = flowers.some(f => f.x === this.target.x && f.y === this.target.y);
            if (onFlower) {
                this.isPollinating = true;
                this.pollinationTimer = 100 + Math.random() * 200;
                return;
            }
            this.setNewTarget();
        }

        const targetAngle = Math.atan2(this.target.y - this.pos.y, this.target.x - this.pos.x) * 180 / Math.PI;
        let diff = targetAngle - this.angle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        this.angle += diff * 0.08;

        const radians = this.angle * Math.PI / 180;
        this.pos.x += Math.cos(radians) * this.speed;
        this.pos.y += Math.sin(radians) * this.speed;

        this.pos.x = Math.max(40, Math.min(this.pos.x, zoneWidth - 40));
        this.pos.y = Math.max(40, Math.min(this.pos.y, zoneHeight - 40));

        this.frameCounter++;
        if (this.frameCounter % 6 === 0) this.createTrailParticle();

        const flip = (Math.cos(radians) < 0) ? -1 : 1;
        this.element.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) translate(-50%, -50%) rotate(${this.angle}deg) scaleY(${flip})`;
    }

    createTrailParticle() {
        if (this.isPollinating || this.isAngry) return; 
        const particle = document.createElement('div');
        particle.classList.add('bee-trail-particle');
        particle.style.left = `${this.pos.x}px`;
        particle.style.top = `${this.pos.y}px`;
        main.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }

    setNewTarget() {
        if (flowers.length > 0 && Math.random() < 0.3) {
            const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
            this.target = { x: randomFlower.x, y: randomFlower.y };
        } else {
            this.target = {
                x: Math.random() * (zoneWidth - 100) + 50,
                y: Math.random() * (zoneHeight - 100) + 50
            };
        }
    }
}

function initBees() {
    updateFlowerPositions();
    for (let i = 0; i < NB_BEES; i++) {
        bees.push(new Bee());
    }
    animate();
}

function animate() {
    zoneWidth = main.clientWidth;
    zoneHeight = main.clientHeight;
    bees.forEach(bee => bee.update());
    requestAnimationFrame(animate);
}

window.addEventListener('load', initBees);
window.addEventListener('resize', updateFlowerPositions);