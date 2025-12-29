const fichierJson = 'data.json'; 
const select = document.getElementById('FormatSelect'); 

const todayButton = document.querySelector(".todayButton");
const datePreviousButton = document.querySelector(".datePrevious");
const dateNextButton = document.querySelector(".dateNext");

const tablesSemaine = document.querySelector('.tablesSemaine');
const tablesJour = document.querySelector('.tableJour');

const date = document.querySelector(".date")


let currentDate;

let donneesEvents = {};


// Retourne la date au format YYYY-MM-DD sans décalage
function getFormatYYYYMMDD(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


async function chargerDonnees() {
    try {
        const reponse = await fetch('data.json');
        if (!reponse.ok) throw new Error("Erreur JSON");

        donneesEvents = await reponse.json();
        
        currentDate = new Date();
        changeDate(0);

        const valeurAuDemarrage = select.value; 
        
        if (valeurAuDemarrage === "jour") {
            tablesJour.classList.remove("tablesHide");
            tablesSemaine.classList.add("tablesHide");
        } else {
            tablesSemaine.classList.remove("tablesHide");
            tablesJour.classList.add("tablesHide");
        }

        printContent(); 

    } catch (erreur) {
        console.error("Erreur :", erreur);
    }
}
chargerDonnees();

function printContent() {
    const mode = select.value;
    const slots = ['matin', 'midi', 'soir'];

    if (mode === "jour") {
        const dateStr = getFormatYYYYMMDD(currentDate);
        slots.forEach(slotName => {
            const nomliste = (donneesEvents[dateStr] && donneesEvents[dateStr][slotName]) || "";
            const LogoListe = nomliste ? `assets/Logo${nomliste}.jpg` : "";
            const imgLogoListe = tablesJour.querySelector(".img" + slotName + "1");
            if (imgLogoListe) imgLogoListe.src = LogoListe;
        });
    } else {
        // --- MODE SEMAINE ---
        // 1. On trouve le LUNDI de la semaine actuelle
        let tempDate = new Date(currentDate);
        const dayNum = tempDate.getDay(); 
        const diffToMonday = (dayNum === 0 ? 6 : dayNum - 1);
        tempDate.setDate(tempDate.getDate() - diffToMonday);

        // 2. On utilise UNE SEULE BOUCLE pour tout remplir (Logos + En-têtes)
        for (let i = 0; i < 7; i++) {
            const dateStr = getFormatYYYYMMDD(tempDate);
            const columnNum = i + 1;

            // Remplissage des Logos
            slots.forEach(slotName => {
                const nomliste = (donneesEvents[dateStr] && donneesEvents[dateStr][slotName]) || "";
                const LogoListe = nomliste ? `assets/Logo${nomliste}.jpg` : "";
                const imgLogoListe = tablesSemaine.querySelector(".img" + slotName + columnNum);

                if (imgLogoListe) {
                    imgLogoListe.src = LogoListe;
                    imgLogoListe.style.display = nomliste ? "block" : "none";
                }
            });

            // MISE À JOUR DES EN-TÊTES (Lun. 22, etc.)
            const headCell = tablesSemaine.querySelector(`.head-${columnNum}`);

            if (headCell) {
                const d = tempDate.getDate();
                const m = tempDate.toLocaleDateString('fr-FR', { weekday: 'short' });
                headCell.innerHTML = `${m} ${d}`;

                // --- CORRECTION DE LA LOGIQUE "TODAY" ---
                const aujourdhui = new Date();
                
                // On compare uniquement le jour, le mois et l'année
                const estAujourdhui = tempDate.toDateString() === aujourdhui.toDateString();

                if (estAujourdhui) {
                    headCell.classList.add("today-header");
                } else {
                    // Important : on enlève la classe si ce n'est pas aujourd'hui 
                    // (pour quand on change de semaine)
                    headCell.classList.remove("today-header");
                }
            }

            // On avance d'un jour pour la colonne suivante
            tempDate.setDate(tempDate.getDate() + 1);
        }
    }
}


function changeDate(day) {
    currentDate.setDate(currentDate.getDate() + day);

    const mode = select.value;

    if (mode === "jour") {
        date.innerHTML = currentDate.toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    } else {
        let dateBegin = new Date(currentDate);
        const dayNum = dateBegin.getDay();
        const diffToMonday = (dayNum === 0 ? 6 : dayNum - 1);
        dateBegin.setDate(dateBegin.getDate() - diffToMonday);

        let dateEnd = new Date(dateBegin);
        dateEnd.setDate(dateBegin.getDate() + 6);

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        date.innerHTML = `${dateBegin.toLocaleDateString('fr-FR', options)} - ${dateEnd.toLocaleDateString('fr-FR', options)}`;
    }
}

datePreviousButton.addEventListener('click', function() {
    const jump = (select.value === "semaine") ? -7 : -1;
    changeDate(jump);
    printContent();
});

dateNextButton.addEventListener('click', function() {
    const jump = (select.value === "semaine") ? 7 : 1;
    changeDate(jump);
    printContent();
});

// Important : Relancer l'affichage quand on change de mode (jour <-> semaine)
select.addEventListener('change', function() {
    let valeurSelectionnee = this.value; 
    if (valeurSelectionnee === "jour") {
        tablesJour.classList.remove("tablesHide");
        tablesSemaine.classList.add("tablesHide");
    } else {
        tablesSemaine.classList.remove("tablesHide");
        tablesJour.classList.add("tablesHide");
    }
    changeDate(0);
    printContent(); // On rafraîchit le contenu immédiatement
});

todayButton.addEventListener('click', function() {
    // 1. On crée une toute nouvelle date (celle de maintenant)
    currentDate = new Date();
    
    // 2. On met à jour l'affichage du texte (le titre de la date)
    changeDate(0); 
    
    // 3. IMPORTANT : On recharge le contenu du planning
    printContent();
    
    console.log("Retour à aujourd'hui :", currentDate);
});