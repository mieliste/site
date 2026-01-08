import { initBees, bees } from './beeSystem.js';
import { startCloudSystem, spawnImageFlowers, initGrass } from './environment.js';
import { createParticles } from './effects.js';
import {setupButterflies} from './butterfly.js';
import {setupBearEasterEgg} from './bear.js';
// ================= EASTER EGG OURS =================

// Dans ton fichier JS principal (ex: index.js)
export function setupSunEasterEgg() {
    const sun = document.querySelector('.sun-container');
    let sunClickCount = 0;
    let clickTimer;

    sun.addEventListener('click', () => {
        sunClickCount++;
        
        // On réinitialise le compteur si l'utilisateur met trop de temps entre les clics
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { sunClickCount = 0; }, 2000);

        if (sunClickCount === 5) {
            console.log("Secret débloqué ! En route pour Flappy Bee...");
            window.location.href = 'flappy-bee.html'; // Redirection vers le jeu
        }
    });
}



document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation
    startCloudSystem();
    spawnImageFlowers(10);
    initBees(5);
    initGrass();
    setupBearEasterEgg();
    setupButterflies();
    setupSunEasterEgg();

    const main = document.querySelector('main');
    const vueInterieure = document.getElementById('interieur-ruche');

    // 2. Gestionnaire de clics unique (Délégation)
    main.addEventListener('click', (e) => {
        
        // --- CLIC SUR LA RUCHE ---
        const ruche = e.target.closest('.ruche-image');
        if (ruche) {
            vueInterieure.classList.add('active');
            main.classList.add('ruche-ouverte');
            return;
        }

        // --- CLIC SUR UN NUAGE ---
        const cloud = e.target.closest('.cloud-svg');
        if (cloud) {
            const rect = cloud.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            createParticles(15, rect.left - mainRect.left + rect.width/2, rect.bottom - mainRect.top, 'raindrop');
            return;
        }

        // --- CLIC SUR UNE FLEUR ---
        const flower = e.target.closest('.scattered-flower');
        if (flower) {
            flower.classList.add('is-shaking-flower');
            setTimeout(() => flower.classList.remove('is-shaking-flower'), 300);
            
            const rect = flower.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            const x = rect.left - mainRect.left + rect.width/2;
            const y = rect.top - mainRect.top + rect.height/2;

            createParticles(6, x, y, 'falling-petal');
            
            // Colère des abeilles
            bees.forEach(bee => {
                const dist = Math.hypot(bee.pos.x - x, bee.pos.y - y);
                if (bee.isPollinating && dist < 60) bee.becomeAngry();
            });
            return;
        }

        // --- CLIC SUR UN ARBRE ---
        const tree = e.target.closest('.tree');
        if (tree) {
            tree.classList.add('is-shaking');
            setTimeout(() => tree.classList.remove('is-shaking'), 400);
            
            const rect = tree.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            createParticles(8, rect.left - mainRect.left + rect.width/2, rect.top - mainRect.top + 40, 'falling-leaf');
        }
    });

    // Bouton retour (Sortir de la ruche)
    document.getElementById('btn-retour').addEventListener('click', () => {
        vueInterieure.classList.remove('active');
        main.classList.remove('ruche-ouverte');
    });

    
});

