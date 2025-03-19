// Themen für die Fächer
const topics = [
    { 
        subject: "Deutsch", 
        title: "Das oder Dass", 
        description: "Lerne den Unterschied zwischen <strong>das</strong> und <strong>dass</strong>.<br><br>" +
                     "<strong>'das':</strong> Wird als Artikel ('das Haus'), Pronomen ('das ist schön') oder Relativpronomen ('das Buch, das ich lese') verwendet.<br>" +
                     "<strong>'dass':</strong> Ist eine Konjunktion und leitet Nebensätze ein ('Ich hoffe, dass du kommst').<br><br>" +
                     "<strong>Beispiel:</strong><br>" +
                     "- Das Buch, <strong>das</strong> ich lese, ist spannend.<br>" +
                     "- Ich hoffe, <strong>dass</strong> du morgen Zeit hast."
    },
    { 
        subject: "Deutsch", 
        title: "Kommasetzung", 
        description: "Übe die wichtigsten Kommaregeln im Deutschen:<br><br>" +
                     "<strong>1. Aufzählungen:</strong><br>" +
                     "Beispiel: Ich mag Äpfel, Bananen und Orangen.<br><br>" +
                     "<strong>2. Nebensätze:</strong><br>" +
                     "Beispiel: Ich hoffe, dass du kommst.<br><br>" +
                     "<strong>3. Infinitivgruppen:</strong><br>" +
                     "Beispiel: Er beschloss, früh aufzustehen.<br><br>" +
                     "<strong>Tipp:</strong> Lies den Satz laut vor. Oft hilft das, die richtige Stelle für ein Komma zu finden."
    },
    { 
        subject: "Deutsch", 
        title: "Prosa analysieren", 
        description: "Erfahre, wie du Prosatexte analysierst:<br><br>" +
                     "<strong>1. Erzählperspektive:</strong><br>" +
                     "Ist der Erzähler allwissend, personal oder neutral?<br><br>" +
                     "<strong>2. Stilmittel:</strong><br>" +
                     "Achte auf Metaphern, Vergleiche, Personifikationen usw.<br><br>" +
                     "<strong>3. Handlung:</strong><br>" +
                     "Was passiert? Gibt es Wendepunkte oder Konflikte?<br><br>" +
                     "<strong>Beispiel:</strong><br>" +
                     "In Franz Kafkas 'Die Verwandlung' wird die innere Zerrissenheit des Protagonisten durch die Metamorphose symbolisiert."
    },
    { 
        subject: "Deutsch", 
        title: "Wortarten und Pronomen", 
        description: "Lerne die verschiedenen Wortarten und Pronomen zu erkennen:<br><br>" +
                     "<strong>1. Nomen:</strong><br>" +
                     "Beispiel: Der Hund, die Katze, das Haus.<br><br>" +
                     "<strong>2. Verben:</strong><br>" +
                     "Beispiel: laufen, springen, denken.<br><br>" +
                     "<strong>3. Adjektive:</strong><br>" +
                     "Beispiel: schön, groß, schnell.<br><br>" +
                     "<strong>4. Pronomen:</strong><br>" +
                     "- <strong>Personalpronomen:</strong> ich, du, er, sie.<br>" +
                     "- <strong>Reflexivpronomen:</strong> mich, dich, sich.<br>" +
                     "- <strong>Relativpronomen:</strong> der, die, das.<br><br>" +
                     "<strong>Tipp:</strong> Übe, indem du Sätze analysierst und die Wortarten markierst."
    },
    { 
        subject: "Mathe", 
        title: "Noch keine Themen verfügbar", 
        description: "Die Themen für Mathe werden bald hinzugefügt. Bleib dran!"
    },
    { 
        subject: "Englisch", 
        title: "Noch keine Themen verfügbar", 
        description: "Die Themen für Englisch werden bald hinzugefügt. Bleib dran!"
    }
];

// Elemente aus dem DOM
const topicsContainer = document.getElementById('topics');
const searchInput = document.getElementById('searchInput');
const navButtons = document.querySelectorAll('nav button');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

// Aktuelles Fach (Standard: alle)
let currentSubject = "alle";

// Themen anzeigen
function displayTopics(filteredTopics) {
    topicsContainer.innerHTML = ''; // Vorherige Inhalte löschen
    filteredTopics.forEach((topic, index) => {
        const topicElement = document.createElement('div');
        topicElement.classList.add('topic');
        topicElement.innerHTML = `
            <h2>${topic.title}</h2>
            <p>${topic.description.substring(0, 100)}...</p>
            <span class="subject-label">${topic.subject}</span>
        `;
        topicElement.addEventListener('click', () => openModal(topic));
        topicsContainer.appendChild(topicElement);
    });
}

// Modal öffnen
function openModal(topic) {
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="subject-label">${topic.subject}</span>
            <span id="modal-close" class="modal-close">&times;</span>
        </div>
        <h2>${topic.title}</h2>
        <p>${topic.description}</p>
    `;
    modal.style.display = 'flex';

    // Event Listener für das Schließen des Modals
    document.getElementById('modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Filter anwenden
function filterTopics() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTopics = topics.filter(topic => {
        const matchesSearch = topic.title.toLowerCase().includes(searchTerm) || topic.description.toLowerCase().includes(searchTerm);
        return matchesSearch;
    });
    displayTopics(filteredTopics);
}

// Event Listener für die Suche
searchInput.addEventListener('input', filterTopics);

// Event Listener für die Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Aktives Fach setzen
        currentSubject = button.getAttribute('data-subject');

        // Aktive Klasse aktualisieren
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Themen filtern (nur nach Fach, nicht nach Suche)
        if (currentSubject === "alle") {
            displayTopics(topics);
        } else {
            const filteredTopics = topics.filter(topic => topic.subject.toLowerCase() === currentSubject);
            displayTopics(filteredTopics);
        }
    });
});

// Initial alle Themen anzeigen
displayTopics(topics);