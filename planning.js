// Le nom de votre fichier JSON
const fichierJson = 'data.json'; 
const select = document.getElementById('event-select'); 
const txtAfficher = document.getElementById('txtAfficher');
const boutonChangement = document.getElementById('boutonChangement');
const imgLogoListe = document.getElementById('imgLogoListe');
const listepara = document.getElementById('listepara');
const datepara = document.getElementById('datepara');




let donneesEvents = {};

fetch(fichierJson)
    .then(response => {
        // Vérifier si la réponse est OK (statut 200)
        if (!response.ok) {
            throw new Error(`Erreur de chargement: ${response.status}`);
        }
        // Convertir la réponse en objet JavaScript
        return response.json(); 
    })
    .then(data => {
        // 1. Récupérer l'objet contenant tous les événements (petit-déjeuner, repas-du-midi, etc.)
        const tousLesEvents = data.events;

        donneesEvents = tousLesEvents; //on stock les donnees dans une variable

        // 2. Utiliser Object.entries() pour itérer sur les paires Clé/Valeur de l'objet
        Object.entries(tousLesEvents).forEach(([nomEvent, info]) => {
            
            // nomEvent = "petit-dejeuner", "repas-du-midi", etc.
            // info = tableau des objets {liste: "...", date: "..."}
            
            
            const option = document.createElement('option'); //creation des options de selection

            option.textContent = nomEvent; 
            //option.classList.add(nomEvent);
            select.appendChild(option);
            
            
        });
    })
    .catch(error => {
        // Gérer les erreurs de chargement ou de parsing
        console.error("Problème avec l'opération fetch:", error);
        // Utiliser la liste pour afficher l'erreur, comme prévu dans l'HTML
        if (liste) {
            liste.innerHTML = `<p style="color: red;">Erreur lors du chargement ou du traitement des données.</p>`;
        }
    });

function affichage (valeurSelectionnee,indice) {
    const elt = donneesEvents[valeurSelectionnee][indice];

    listepara.innerHTML = '';
    datepara.innerHTML = '';
    imgLogoListe.innerHTML = '';

    imgLogoListe.src = `assets/Logo${elt.listes}.jpg`
    listepara.textContent = elt.listes;
    datepara.textContent = elt.date;
}

let valeurSelectionnee = "petit-dejeuner";
let nbEvt = 2;
let indice = 0;

select.addEventListener('change', function() {
    valeurSelectionnee = this.value; 
    nbEvt = 0;
    donneesEvents[valeurSelectionnee].forEach(detail =>
    {
        nbEvt ++;
    }
    );

    // affichage du premier evt
    affichage(valeurSelectionnee,0);    
});

boutonChangement.addEventListener('click',function(){
    
    indice ++;
    if (indice >= nbEvt)
    {
        indice = 0;
    }
    affichage(valeurSelectionnee,indice);
    
})
