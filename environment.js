function createSeededRandom(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}


const grassRandom = createSeededRandom(7); 
const flowerRandom = createSeededRandom(14);


export function initGrass() {
    const field = document.querySelector('.grass-field');
    if (!field) return;
    
    const grassCount = 60;
    for (let i = 0; i < grassCount; i++) {
        const grass = document.createElement('div');
        grass.classList.add('grass');

        const posX = grassRandom() * 100;
        const height = 20 + grassRandom() * 30;
        const delay = grassRandom() * -5;
        const brightness = 80 + grassRandom() * 40;

        grass.style.left = `${posX}%`;
        grass.style.height = `${height}px`;
        grass.style.animationDelay = `${delay}s`;
        grass.style.filter = `brightness(${brightness}%)`;

        field.appendChild(grass);
    }
}

function spawnCloud(isInitial = false) {
    const main = document.querySelector('main');
    if (!main) return;

    const cloud = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cloud.setAttribute("viewBox", "0 0 100 60");
    cloud.classList.add("cloud-svg");
    cloud.innerHTML = `<path d="M10,40 Q0,40 0,30 Q0,10 20,10 Q30,-5 50,5 Q70,-5 80,10 Q100,10 100,30 Q100,40 90,40 Q90,55 70,55 Q50,65 30,55 Q10,55 10,40 Z" fill="white"/>`;

    const top = Math.random() * 45; 
    const duration = 60 + Math.random() * 60;
    const opacity = 0.6 + Math.random() * 0.4;
    const baseScale = 0.5 + Math.random() * 0.7;

    cloud.style.setProperty('--rand-top', `${top}%`);
    cloud.style.setProperty('--rand-duration', `${duration}s`);
    cloud.style.setProperty('--base-scale', baseScale);
    cloud.style.opacity = opacity;

    if (isInitial) {
        const randomDelay = Math.random() * duration;
        cloud.style.animationDelay = `-${randomDelay}s`;
    }

    main.appendChild(cloud);
    cloud.addEventListener('animationend', () => cloud.remove());
}

export function startCloudSystem() {
    for (let i = 0; i < 8; i++) {
        spawnCloud(true);
    }

    const nextSpawn = () => {
        const time = 8000 + Math.random() * 10000;
        setTimeout(() => {
            spawnCloud(false);
            nextSpawn();
        }, time);
    };
    nextSpawn();
}

export function spawnImageFlowers(count) {
    const main = document.querySelector('main');
    if (!main) return;

    const trees = document.querySelectorAll('.tree');
    let obstacleRects = Array.from(trees).map(tree => tree.getBoundingClientRect());

    const cave = document.getElementById('cave-entrance');
    if (cave) {
        obstacleRects.push(cave.getBoundingClientRect());
    }
    
    const mainRect = main.getBoundingClientRect();

    const flowerImages = [
        'assets/fleur/image.png',
        'assets/fleur/image1.png',
        'assets/fleur/image2.png'
    ];

    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let validPosition = false;
        let finalLeft, finalBottom;

        while (!validPosition && attempts < 20) { 
            const bottomPercent = 5 + flowerRandom() * 30; 
            const leftPercent = flowerRandom() * 95; 
            
            const flowerX = mainRect.left + (mainRect.width * (leftPercent / 100));
            const flowerY = mainRect.bottom - (mainRect.height * (bottomPercent / 100));

           
            const collides = obstacleRects.some(rect => {
            
                const margin = 15; 
                return (
                    flowerX > rect.left - margin &&
                    flowerX < rect.right + margin &&
                    flowerY > rect.top - margin &&
                    flowerY < rect.bottom + margin
                );
            });

            if (!collides) {
                validPosition = true;
                finalLeft = leftPercent;
                finalBottom = bottomPercent;
            }
            attempts++;
        }

        if (validPosition) {
            const img = document.createElement('img');
            const randomIndex = Math.floor(flowerRandom() * flowerImages.length);
            img.src = flowerImages[randomIndex];
            img.classList.add('scattered-flower');

            const scale = 0.4 + flowerRandom() * 0.8; 
            const delay = flowerRandom() * -5;

            img.style.bottom = `${finalBottom}%`;
            img.style.left = `${finalLeft}%`;
            img.style.setProperty('--rand-scale', scale);
            img.style.animationDelay = `${delay}s`;

            main.appendChild(img);
        } else {
            console.warn("Impossible de placer une fleur après 20 tentatives.");
        }
    }
}

export function getFlowerPositions() {
    const flowerElements = document.querySelectorAll('.scattered-flower');
    return Array.from(flowerElements).map(f => ({
        x: f.offsetLeft + f.clientWidth / 2,
        y: f.offsetTop + f.clientHeight / 2,
        element: f
    }));
}