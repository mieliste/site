const nav = document.querySelector(".nav")
const menuIcon = document.querySelector(".menu-icon")
menuIcon.addEventListener('click',()=>{
nav.classList.toggle('mobile-menu')
console.log("salut")
})

const ruche = document.querySelector(".ruche-image");


const btnRetour = document.getElementById('btn-retour');
const vueInterieure = document.getElementById('interieur-ruche');

// Quand on clique sur la ruche
ruche.addEventListener('click', () => {
    vueInterieure.classList.add('active'); // Le CSS gère l'apparition
});

// Quand on clique sur "Sortir"
btnRetour.addEventListener('click', () => {
    vueInterieure.classList.remove('active'); // Le CSS gère la disparition
});