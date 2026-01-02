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

function spawnCloud(isInitial = false) {
    const main = document.querySelector('main');
    if (!main) return;

    const cloud = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cloud.setAttribute("viewBox", "0 0 100 60");
    cloud.classList.add("cloud-svg");
    cloud.innerHTML = `<path d="M10,40 Q0,40 0,30 Q0,10 20,10 Q30,-5 50,5 Q70,-5 80,10 Q100,10 100,30 Q100,40 90,40 Q90,55 70,55 Q50,65 30,55 Q10,55 10,40 Z" fill="white"/>`;

    // Paramètres aléatoires
    const top = Math.random() * 45; 
    const duration = 60 + Math.random() * 60; // Plus lent pour plus de réalisme
    const opacity = 0.4 + Math.random() * 0.4;
    const scale = 0.4 + Math.random() * 0.6;

    cloud.style.setProperty('--rand-top', `${top}%`);
    cloud.style.setProperty('--rand-duration', `${duration}s`);
    cloud.style.opacity = opacity;
    cloud.style.transform = `scale(${scale})`;

    // L'ASTUCE : Si c'est au chargement, on "avance" l'animation aléatoirement
    if (isInitial) {
        const randomDelay = Math.random() * duration;
        cloud.style.animationDelay = `-${randomDelay}s`;
    }

    main.appendChild(cloud);

    cloud.addEventListener('animationend', () => cloud.remove());
}

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

// Appelle startCloudSystem() dans ton DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    startCloudSystem();
    spawnImageFlowers(10);
    // ... tes autres fonctions (abeilles, arbres) ...
});