const nav = document.querySelector(".nav")
const menuIcon = document.querySelector(".menu-icon")
menuIcon.addEventListener('click',()=>{
nav.classList.toggle('mobile-menu')
console.log("salut")
})

const ruche = document.querySelector(".ruche-image");
const btnRetour = document.getElementById('btn-retour');
const vueInterieure = document.getElementById('interieur-ruche');
const mainElement = document.querySelector('main');
// Quand on clique sur la ruche
ruche.addEventListener('click', () => {
    vueInterieure.classList.add('active'); // Le CSS gère l'apparition
    mainElement.classList.add('ruche-ouverte');
});

// Quand on clique sur "Sortir"
btnRetour.addEventListener('click', () => {
    vueInterieure.classList.remove('active'); // Le CSS gère la disparition
    mainElement.classList.remove('ruche-ouverte');
});


const seed = 40; 

function seededRandom(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
}

const myRandom = seededRandom(seed); // On crée notre propre "Math.random" basé sur la seed



const field = document.querySelector('.grass-field');
const grassCount = 60; // Tu peux ajuster le nombre de brins ici

for (let i = 0; i < grassCount; i++) {
    const grass = document.createElement('div');
    grass.classList.add('grass');

    // --- RANDOMISATION ---
    
    // 1. Position horizontale (de 0 à 100%)
    const posX = myRandom() * 100;
    
    // 2. Taille aléatoire (entre 20px et 50px)
    const height = 20 + myRandom() * 30;
    
    // 3. Délai d'animation aléatoire (pour que tout ne bouge pas en même temps)
    const delay = myRandom() * -5; // Valeur négative pour qu'ils aient déjà commencé à bouger
    
    // 4. Opacité/Couleur légère (pour donner de la profondeur)
    const brightness = 80 + myRandom() * 40;

    // Appliquer les styles
    grass.style.left = `${posX}%`;
    grass.style.height = `${height}px`;
    grass.style.animationDelay = `${delay}s`;
    grass.style.filter = `brightness(${brightness}%)`;

    field.appendChild(grass);
}


// main.addEventListener('mousemove', (e) => {
//     target.x = e.clientX;
//     target.y = e.clientY;
// });

// --- Fonction pour faire apparaître un nuage ---
function spawnCloud(isInitial = false) {
    const main = document.querySelector('main');
    if (!main) return;

    const cloud = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cloud.setAttribute("viewBox", "0 0 100 60");
    cloud.classList.add("cloud-svg");
    cloud.innerHTML = `<path d="M10,40 Q0,40 0,30 Q0,10 20,10 Q30,-5 50,5 Q70,-5 80,10 Q100,10 100,30 Q100,40 90,40 Q90,55 70,55 Q50,65 30,55 Q10,55 10,40 Z" fill="white"/>`;

    // Paramètres aléatoires existants...
    const top = Math.random() * 45; 
    const duration = 60 + Math.random() * 60;
    const opacity = 0.6 + Math.random() * 0.4;
    // On stocke l'échelle de base dans une variable CSS pour le survol
    const baseScale = 0.5 + Math.random() * 0.7;

    cloud.style.setProperty('--rand-top', `${top}%`);
    cloud.style.setProperty('--rand-duration', `${duration}s`);
    // IMPORTANT : On définit l'échelle de base ici
    cloud.style.setProperty('--base-scale', baseScale);
    cloud.style.opacity = opacity;

    if (isInitial) {
        const randomDelay = Math.random() * duration;
        cloud.style.animationDelay = `-${randomDelay}s`;
    }

    main.appendChild(cloud);

    // --- NOUVEAU : GESTION DU CLIC POUR LA PLUIE ---
    cloud.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche de cliquer sur des trucs derrière

        // Petit effet visuel : on assombrit le nuage brièvement quand il pleut
        cloud.style.filter = "brightness(0.7)";
        setTimeout(() => { cloud.style.filter = ""; }, 300);

        // On génère entre 15 et 25 gouttes
        const rainCount = 15 + Math.floor(Math.random() * 10);
        
        // On récupère la position exacte du nuage en mouvement
        const rect = cloud.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();
        
        // Position de départ relative au main
        const startXBase = rect.left - mainRect.left;
        // Les gouttes partent du bas du nuage
        const startY = rect.bottom - mainRect.top - 15; 

        for (let i = 0; i < rainCount; i++) {
            // On répartit les gouttes sur la largeur du nuage
            const dropX = startXBase + Math.random() * rect.width;
            createRainDrop(dropX, startY);
        }
    });

    cloud.addEventListener('animationend', () => cloud.remove());
}

// --- Fonction pour créer une goutte de pluie ---
function createRainDrop(x, y) {
    const main = document.querySelector('main');
    const drop = document.createElement('div');
    drop.classList.add('raindrop');
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;

    // Vitesse de chute légèrement aléatoire
    const duration = 1 + Math.random() * 0.4;
    drop.style.setProperty('--rain-duration', `${duration}s`);
    
    // Petit délai aléatoire pour que ça ne tombe pas en bloc
    drop.style.animationDelay = `${Math.random() * 0.2}s`;

    main.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove());
}

// ... Le reste de tes fonctions startCloudSystem, etc. reste pareil ...

function startCloudSystem() {
    // 1. On génère 8 nuages immédiatement répartis sur l'écran
    for (let i = 0; i < 8; i++) {
        spawnCloud(true);
    }

    // 2. On continue d'en faire apparaître de nouveaux par la gauche
    const nextSpawn = () => {
        const time = 8000 + Math.random() * 10000;
        setTimeout(() => {
            spawnCloud(false); // isInitial = false pour qu'ils partent bien de la gauche
            nextSpawn();
        }, time);
    };
    nextSpawn();
}


function spawnImageFlowers(count) {
    const main = document.querySelector('main'); //
    if (!main) return;

    const flowerImages = [
        'assets/fleur/image.png',
        'assets/fleur/image1.png',
        'assets/fleur/image2.png'
    ];

    for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        
        // On utilise myRandom() pour choisir l'image
        const randomIndex = Math.floor(myRandom() * flowerImages.length);
        img.src = flowerImages[randomIndex];
        
        // On applique la classe CSS pour le balancement
        img.classList.add('scattered-flower');

        // --- POSITIONNEMENT DÉTERMINISTE ---
        
        // On restreint la zone de semis entre 35% et 85% du haut
        const bottom = 5 + myRandom() * 30; 
        const left = myRandom() * 95; 

        // Taille et délai basés sur la seed
        const scale = 0.4 + myRandom() * 0.8; 
        const delay = myRandom() * -5;

        // Application des styles via les variables CSS
        img.style.bottom = `${bottom}%`;
        img.style.left = `${left}%`;
        img.style.setProperty('--rand-scale', scale);
        img.style.animationDelay = `${delay}s`;

        main.appendChild(img);
    }
}

// --- Gestion des feuilles + Secousse au clic ---

const trees = document.querySelectorAll('.tree');

trees.forEach(tree => {
    tree.addEventListener('click', (event) => {
        event.stopPropagation();

        // 1. Déclenchement de la secousse
        // On retire la classe au cas où elle y soit déjà (pour reset l'anim)
        tree.classList.remove('is-shaking');
        
        // On force un "reflow" (astuce pour que le navigateur voit le retrait/ajout immédiat)
        void tree.offsetWidth; 
        
        // On ajoute la classe de secousse
        tree.classList.add('is-shaking');

        // On retire la classe après l'animation (0.4s) pour pouvoir recommencer
        setTimeout(() => {
            tree.classList.remove('is-shaking');
        }, 400);

        // 2. Génération des feuilles (ton code précédent)
        const leafCount = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i < leafCount; i++) {
            createFallingLeaf(tree);
        }
    });
});

function createFallingLeaf(containerTree) {
    const leaf = document.createElement('div');
    leaf.classList.add('falling-leaf');

    // On garde la même logique de paramètres aléatoires
    const startLeft = 10 + Math.random() * 80;
    leaf.style.left = `${startLeft}%`;

    const duration = 2 + Math.random() * 3;
    leaf.style.setProperty('--fall-duration', `${duration}s`);

    const delay = Math.random() * 0.3; // Délai plus court pour une réaction immédiate au clic
    leaf.style.animationDelay = `${delay}s`;

    const distance = 180 + Math.random() * 150;
    leaf.style.setProperty('--fall-distance', `${distance}px`);

    const driftX = Math.random() * 120 - 60; 
    leaf.style.setProperty('--fall-drift-x', `${driftX}px`);

    const rotation = Math.random() * 720 - 360;
    leaf.style.setProperty('--fall-rotation', `${rotation}deg`);

    containerTree.appendChild(leaf);

    leaf.addEventListener('animationend', () => {
        leaf.remove();
    });
}


// --- Gestion des fleurs au clic (Délégation d'événement) ---

document.addEventListener('click', (e) => {
    const flower = e.target.closest('.scattered-flower');
    
    if (flower) {
        // 1. Animation de secousse
        flower.classList.remove('is-shaking-flower');
        void flower.offsetWidth; // Reset de l'animation
        flower.classList.add('is-shaking-flower');
        
        // On retire la classe après l'anim pour pouvoir recommencer
        setTimeout(() => flower.classList.remove('is-shaking-flower'), 300);

        // 2. Génération des pétales
        const petalCount = 5 + Math.floor(Math.random() * 5);
        
        // On récupère la position de la fleur par rapport au main
        const rect = flower.getBoundingClientRect();
        const mainRect = document.querySelector('main').getBoundingClientRect();
        
        const startX = rect.left - mainRect.left + rect.width / 2;
        const startY = rect.top - mainRect.top + rect.height / 2;

        for (let i = 0; i < petalCount; i++) {
            createFallingPetal(startX, startY);
        }

        // 3. Interaction avec les abeilles (si elles existent)
        if (window.bees) { // On vérifie si bees est global
            window.bees.forEach(bee => {
                const dist = Math.hypot(bee.pos.x - startX, bee.pos.y - startY);
                if (bee.isPollinating && dist < 60) {
                    bee.becomeAngry();
                }
            });
        }
    }
});

function createFallingPetal(x, y) {
    const main = document.querySelector('main');
    const petal = document.createElement('div');
    petal.classList.add('falling-petal');
    
    // Couleurs variées
    const colors = ['#FFEB3B', '#FFFFFF', '#F48FB1', '#FFD54F'];
    petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Position de départ (centre de la fleur)
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;

    // Paramètres de chute
    const duration = 1 + Math.random() * 1.5;
    const drift = (Math.random() - 0.5) * 100;
    const dist = 50 + Math.random() * 80;
    const rot = Math.random() * 360;

    petal.style.setProperty('--p-duration', `${duration}s`);
    petal.style.setProperty('--p-drift', `${drift}px`);
    petal.style.setProperty('--p-dist', `${dist}px`);
    petal.style.setProperty('--p-rot', `${rot}deg`);

    main.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
}

// Appelle startCloudSystem() dans ton DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    startCloudSystem();
    spawnImageFlowers(10);
    // ... tes autres fonctions (abeilles, arbres) ...
});