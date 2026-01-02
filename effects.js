// effects.js
export function createParticles(count, startX, startY, type) {
    const main = document.querySelector('main');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add(type); // 'raindrop', 'falling-leaf', or 'falling-petal'
        
        p.style.left = `${startX + (Math.random() - 0.5) * 50}px`;
        p.style.top = `${startY}px`;

        // Paramètres personnalisés selon le type
        if (type === 'raindrop') {
            p.style.setProperty('--rain-duration', `${1 + Math.random() * 0.4}s`);
        } else if (type === 'falling-leaf') {
            p.style.setProperty('--fall-duration', `${2 + Math.random() * 2}s`);
            p.style.setProperty('--fall-distance', `${150 + Math.random() * 100}px`);
            p.style.setProperty('--fall-drift-x', `${(Math.random() - 0.5) * 100}px`);
            p.style.setProperty('--fall-rotation', `${Math.random() * 720}deg`);
        }
        else if (type === 'falling-petal') {
            p.style.setProperty('--p-duration', `${1.5 + Math.random() * 1}s`);
            p.style.setProperty('--p-dist', `${80 + Math.random() * 100}px`);
            p.style.setProperty('--p-drift', `${(Math.random() - 0.5) * 120}px`);
            p.style.setProperty('--p-rot', `${Math.random() * 360}deg`);
            
            const colors = ['#FFEB3B', '#FFFFFF', '#F48FB1', '#FFD54F'];
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
        else if (type === 'honey-drop') {
            // Le miel tombe très lentement (3 à 5 secondes)
            const duration = 3 + Math.random() * 2;
            p.style.setProperty('--h-duration', `${duration}s`);
            // Chute sur presque toute la hauteur de la page
            p.style.setProperty('--h-dist', `80vh`);
        }
        p.addEventListener('animationend', () => p.remove());
        fragment.appendChild(p);
    }
    main.appendChild(fragment);
}