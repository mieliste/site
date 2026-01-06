// function createHoneyDrop() {
//     const container = document.querySelector('.honey-drip-container');
//     if (!container) return;

//     const drop = document.createElement('div');
//     drop.classList.add('honey-drop-falling');

//     // Position horizontale aléatoire (de 0 à 100% de la largeur)
//     const randomX = Math.random() * 100;
//     drop.style.left = `${randomX}%`;

//     // Taille légèrement variée pour plus de réalisme
//     const scale = 0.5 + Math.random();
//     drop.style.transform = `scale(${scale})`;

//     // Vitesse de chute aléatoire (entre 3s et 6s)
//     const duration = 3 + Math.random() * 3;
//     drop.style.animationDuration = `${duration}s`;

//     container.appendChild(drop);

//     // Suppression automatique de l'élément à la fin de l'animation
//     drop.addEventListener('animationend', () => {
//         drop.remove();
//     });
// }

// // Lancer une goutte à des intervalles aléatoires (toutes les 2 à 5 secondes)
// function startHoneyDrops() {
//     const nextDrop = () => {
//         createHoneyDrop();
//         const delay = 2000 + Math.random() * 3000;
//         setTimeout(nextDrop, delay);
//     };
//     nextDrop();
// }

// // Démarrer le système une fois la page chargée
// document.addEventListener('DOMContentLoaded', startHoneyDrops);


// function spawnRealisticDrop() {
//     const container = document.querySelector('.honey-drip-container');
//     if (!container) return;

//     // Coordonnées X des pics de ton SVG (à ajuster selon ton dessin)
//     const peaks = [10, 25, 37, 50, 65, 82, 91]; 
//     const randomPeak = peaks[Math.floor(Math.random() * peaks.length)];

//     const drop = document.createElement('div');
//     drop.classList.add('honey-drop-complex');
    
//     // Positionnement précis sur un pic
//     drop.style.left = `${randomPeak}%`;
    
//     // On ajuste le top pour que la goutte démarre pile au bout du pic
//     // (Ajuster la valeur en pixels selon la longueur de tes pics SVG)
//     drop.style.top = "180px"; 

//     container.appendChild(drop);

//     // Nettoyage de la mémoire
//     drop.addEventListener('animationend', () => {
//         drop.remove();
//     });
// }

// // On lance une goutte toutes les 4 à 7 secondes pour ne pas surcharger
// setInterval(spawnRealisticDrop, 4000 + Math.random() * 3000);