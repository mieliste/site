export function setupButterflies() {
    const main = document.querySelector('main');
    const butterflies = document.querySelectorAll('.butterfly');
    
    if (!main || butterflies.length === 0) return;

    butterflies.forEach(butterfly => {
        const bWidth = 50; 
        
        let pos = {
            x: Math.random() * (main.clientWidth - bWidth),
            y: Math.random() * (main.clientHeight - bWidth)
        };
        
        let target = { ...pos };
        let speed = 1.5 + Math.random() * 2;

        function move() {

            const dx = target.x - pos.x;
            const dy = target.y - pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);


            if (dist < 10) {
                target.x = Math.random() * (main.clientWidth - bWidth);
                target.y = Math.random() * (main.clientHeight - bWidth);
            }

            const angle = Math.atan2(dy, dx);
            
            const jitter = (Math.random() - 0.5) * 4;

            pos.x += Math.cos(angle) * speed + jitter;
            pos.y += Math.sin(angle) * speed + jitter;

            if (pos.x < 0) pos.x = 0;
            if (pos.y < 0) pos.y = 0;
            if (pos.x > main.clientWidth - bWidth) pos.x = main.clientWidth - bWidth;
            if (pos.y > main.clientHeight - bWidth) pos.y = main.clientHeight - bWidth;

            const scaleX = (dx > 0) ? 1 : -1;

            butterfly.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scaleX(${scaleX})`;

            requestAnimationFrame(move);
        }

        move();
    });
}