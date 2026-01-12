
const members = document.querySelectorAll('.membre');
const fiche = document.getElementById('fiche-membre');

members.forEach(member => {
    member.addEventListener('click', () => {

        const h3Element = member.querySelector('h3');

        const nom = member.dataset.nom || "Abeille anonyme";
        const photo = member.querySelector('img').src;
        const desc = member.dataset.desc || "description";
        const role = member.dataset.role || "membre";
        const num = member.dataset.num || "non renseigné";

        document.getElementById('fiche-nom').innerText = nom;
        document.getElementById('fiche-role').innerText = role;
        document.getElementById('fiche-photo').src = photo;
        document.getElementById('fiche-tel').innerText = num;
        document.getElementById('fiche-tel').href = `tel:${num}`;
     
        fiche.classList.add('active');
    });
});


const closeBtn = document.getElementById("close-fiche"); 


closeBtn.addEventListener('click', () => {
    fiche.classList.remove('active');
});

fiche.addEventListener('click', (e) => {
    if (e.target === fiche) {
        fiche.classList.remove('active');
    }
});