let flowersClickedCount = 0;
const flowerSelector = '.scattered-flower'; 

export function setupBearEasterEgg() {
    const flowers = document.querySelectorAll(flowerSelector);
    
    flowers.forEach(flower => {
        flower.addEventListener('click', function() {
            if (this.style.pointerEvents === 'none') return;

            this.style.opacity = '0.5';
            this.style.pointerEvents = 'none'; 

            flowersClickedCount++;
            
            if (flowersClickedCount === flowers.length) {
                startBearSequence();
            }
        });
    });
}

function startBearSequence() {
    const bear = document.getElementById('bear-container');
    const bearSvg = bear.querySelector('.bear-svg');
    const pot = bear.querySelector('.honey-pot-css');
    const ruche = document.querySelector('.ruche-image');
    const cave = document.getElementById('cave-entrance');
    const main = document.querySelector('main');
    
    const rucheRect = ruche.getBoundingClientRect();
    const caveRect = cave.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();

    const targetX_Ruche = (rucheRect.left + rucheRect.width / 2) - mainRect.left - (bear.offsetWidth / 2);
    const targetY_Ruche = (rucheRect.top + rucheRect.height / 2) - mainRect.top - (bear.offsetHeight / 2);


    const targetX_Cave = (caveRect.left + caveRect.width / 2) - mainRect.left - (bear.offsetWidth / 2);
    const targetY_Cave = (caveRect.top + caveRect.height / 2) - mainRect.top - (bear.offsetHeight / 2);

    bear.style.transition = 'none'; 
    bear.style.transform = `translate(${targetX_Cave}px, ${targetY_Cave}px)`;
    
    setTimeout(() => {
        bear.style.transition = 'opacity 2s ease-in-out';
        bear.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        bear.classList.add('is-walking');
        bear.style.transition = 'transform 5s linear';
        bear.style.transform = `translate(${targetX_Ruche}px, ${targetY_Ruche}px)`;
    }, 2100);

    setTimeout(() => {
        bear.classList.remove('is-walking');
        pot.classList.add('show-pot'); 
        bearSvg.style.animation = 'bearEat 0.5s ease-in-out infinite alternate';
    }, 7100);

    setTimeout(() => {
        bearSvg.style.animation = '';
        pot.classList.remove('show-pot');
        bear.style.transform = `translate(${targetX_Ruche}px, ${targetY_Ruche}px) scaleX(-1)`; 
        
        setTimeout(() => {
            bear.classList.add('is-walking');
            bear.style.transition = 'transform 5s linear';
            bear.style.transform = `translate(${targetX_Cave}px, ${targetY_Cave}px) scaleX(-1)`;
        }, 500);
    }, 11000);

    setTimeout(() => {
        bear.classList.remove('is-walking');
        bear.style.transition = 'opacity 2s ease-in-out';
        bear.style.opacity = '0';
    }, 16500);

    setTimeout(() => {
     
        flowersClickedCount = 0;
        const flowers = document.querySelectorAll(flowerSelector);
        flowers.forEach(flower => {
            flower.style.opacity = '1';
            flower.style.pointerEvents = 'auto';
        });

        bear.style.transition = 'none';
        bear.style.transform = 'translateX(-150px)';
        bear.style.opacity = '0';
        

        bear.classList.remove('is-walking');
        
        console.log("Système réinitialisé, prêt pour un nouvel Easter Egg !");
    }, 18500);

}
