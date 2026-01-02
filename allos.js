import { createParticles } from './effects.js';

const dripContainer = document.querySelector('.honey-drip-container');
const main = document.querySelector('main');

if (dripContainer) {
    dripContainer.addEventListener('click', (e) => {
        // On récupère la position du clic par rapport au haut du document
        const mainRect = main.getBoundingClientRect();
        const x = e.clientX - mainRect.left;
        
        // On fait tomber les gouttes depuis le point de clic (startY = 0)
        // 'honey-drop' doit être défini dans ton effects.js
        createParticles(4, x, 0, 'honey-drop');
    });
}