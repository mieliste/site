
const members = document.querySelectorAll('.membre');
const fiche = document.getElementById('fiche-membre');

members.forEach(member => {
    member.addEventListener('click', () => {
        // 1. On cherche l'élément h3
        const h3Element = member.querySelector('h3');
        
        // 2. On récupère le texte seulement s'il existe, sinon on met un texte par défaut
        const role = h3Element ? h3Element.innerText : "Membre de la ruche"; 
        
        const nom = member.dataset.nom || "Abeille anonyme";
        const photo = member.querySelector('img').src;
        const desc = member.dataset.desc || "Une abeille passionnée de l'école.";

        document.getElementById('fiche-nom').innerText = nom;
        document.getElementById('fiche-role').innerText = role;
        document.getElementById('fiche-photo').src = photo;
        document.getElementById('fiche-desc').innerText = desc;

        fiche.classList.add('active');
    });
});
// ... reste du code de fermeture ...


// On utilise getElementById car c'est un ID (#), pas une classe (.)
const closeBtn = document.getElementById("close-fiche"); 

// On vérifie que le bouton existe bien avant d'ajouter l'écouteur

closeBtn.addEventListener('click', () => {
    fiche.classList.remove('active');
});

// Optionnel : Fermer la fiche si on clique sur l'arrière-plan (l'overlay)
fiche.addEventListener('click', (e) => {
    if (e.target === fiche) {
        fiche.classList.remove('active');
    }
});