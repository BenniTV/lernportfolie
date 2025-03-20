// Grundlegende Hilfsfunktionen
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Funktion zum Anzeigen verschiedener Fachbereiche
function showSubjects(subject) {
    const subjects = ['deutsch', 'mathe', 'geschichte'];
    
    subjects.forEach(sub => {
        document.getElementById(sub).style.display = sub === subject ? 'block' : 'none';
    });
    
    // Aktualisiere die aktiven Links
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('onclick').includes(subject));
    });
}

// Pronomen-Funktionen
let pronomenQuestions = [];
let currentPronomenQuestionIndex = 0; // Umbenannt
let timerInterval;



function loadQuestion(index) {
    const question = pronomenQuestions[index];
    const questionsContainer = document.getElementById('pronomen-questions');
    const nextButton = document.getElementById('next-button');

    // Überprüfen, ob das Element existiert
    if (!questionsContainer) {
        console.error("Das Element 'pronomen-questions' wurde nicht gefunden.");
        return;
    }

    // Stoppe einen eventuell laufenden Timer
    stopTimer();

    // Frage und Antworten anzeigen
    questionsContainer.innerHTML = `
        <div class="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <h5 class="text-lg font-bold text-purple-700 mb-2">${index + 1}. ${question.text}</h5>
            <div id="answers-container" class="space-y-2"></div>
        </div>
    `;

    const answersContainer = document.getElementById('answers-container');
    if (!answersContainer) {
        console.error("Das Element 'answers-container' wurde nicht gefunden.");
        return;
    }

    const shuffledAnswers = shuffleArray([...question.answers]);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 w-full mb-2';
        button.setAttribute('data-correct', answer.correct);
        // Setze das data-explanation Attribut nur für die korrekte Antwort
        if (answer.correct && question.explanation) {
            button.setAttribute('data-explanation', question.explanation);
        }
        button.innerText = answer.text;
        button.onclick = function () {
            checkAnswer(button);
        };
        answersContainer.appendChild(button);
    });

    // Buttons initialisieren
    const controlsContainer = document.getElementById('pronomen-controls');
    if (controlsContainer) {
        controlsContainer.style.display = 'block';
    }
    if (nextButton) {
        nextButton.disabled = true;
    }
}

function checkAnswer(button) {
    const isCorrect = button.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-green-500', 'text-white');
        button.innerText = 'Richtig!';
    } else {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-red-500', 'text-white');
        button.innerText = 'Falsch!';
    }

    // Deaktiviere alle Buttons nach der Auswahl
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Zeige die korrekte Antwort und Erklärung an
    markCorrectAnswer(button.parentElement.id);
    
    // Aktiviere den "Weiter"-Button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.disabled = false;
    }
}

function startTimer(duration, onTimeUp) {
    const timerElement = document.getElementById('pronomen-timer');
    const timerDisplay = document.getElementById('timer-countdown');
    
    if (!timerElement || !timerDisplay) {
        console.error("Timer-Elemente nicht gefunden");
        return;
    }
    
    let timeLeft = duration;
    
    // Timer anzeigen
    timerElement.style.display = 'block';
    timerDisplay.textContent = timeLeft;
    
    // Interval starten und speichern
    clearInterval(timerInterval); // Vorherigen Timer stoppen
    
    timerInterval = setInterval(function() {
        timeLeft--;
        
        // Timer aktualisieren
        timerDisplay.textContent = timeLeft;
        
        // Timer beenden, wenn Zeit abgelaufen
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            onTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const timerElement = document.getElementById('pronomen-timer');
    if (timerElement) {
        timerElement.style.display = 'none';
    }
}

// Funktion zum Markieren der richtigen Antwort
function markCorrectAnswer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID '${containerId}' nicht gefunden.`);
        return;
    }
    
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.getAttribute('data-correct') === 'true') {
            button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
            button.classList.add('bg-green-500', 'text-white');
            // Häkchen zur Beschriftung hinzufügen
            button.innerText = button.innerText.includes('✓') ? button.innerText : button.innerText + " ✓";
            
            // Falls eine Erklärung vorhanden ist, diese anzeigen
            const explanation = button.getAttribute('data-explanation');
            if (explanation) {
                // Prüfen, ob schon ein Erklärungselement existiert (um Dopplungen zu vermeiden)
                if (!button.nextElementSibling || !button.nextElementSibling.classList.contains('explanation')) {
                    const explanationDiv = document.createElement('div');
                    explanationDiv.className = 'explanation mt-2 text-sm text-green-800';
                    explanationDiv.innerText = explanation;
                    button.parentNode.insertBefore(explanationDiv, button.nextSibling);
                }
            }
        } else {
            button.classList.add('opacity-50');
        }
    });
}

// Navigation zwischen Themen
function showSubjects(subject) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === subject) {
            section.style.display = 'block'; // Zeige die gewünschte Sektion
        } else {
            section.style.display = 'none'; // Verstecke alle anderen Sektionen
        }
    });
}

// Funktion zum Anzeigen der Deutsch-Themen
function showDeutschTopic(topic) {
    const topics = document.querySelectorAll('#deutsch > .topic');
    const preview = document.getElementById('deutsch-preview');

    if (topic === 'preview') {
        preview.style.display = 'block';
        topics.forEach(div => {
            div.style.display = 'none';
        });
    } else {
        preview.style.display = 'none';
        topics.forEach(div => {
            div.style.display = div.id === topic ? 'block' : 'none';
        });
    }

    // Themenspezifische Funktionen aufrufen
    if (topic === 'pronomen') {
        loadPronomenQuestions();
    } else if (topic === 'wortarten') {
        loadWortartenQuestions();
    } else if (topic === 'prosa-analyse') {
        loadProsamQuestions();
    } else if (topic === 'dasunddass') {
        loadDasunddassQuestions();
    } else if (topic === 'stilmittel') {
        loadStilmittelQuestions();
    }
}

// Suchfunktion
function search() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const sections = document.querySelectorAll('section');
    let found = false;

    sections.forEach(section => {
        const articles = section.querySelectorAll('article');
        let sectionHasMatch = false;

        articles.forEach(article => {
            const text = article.textContent.toLowerCase();
            if (text.includes(query)) {
                article.style.display = 'block';
                sectionHasMatch = true;
                found = true;
            } else {
                article.style.display = 'none';
            }
        });

        section.style.display = sectionHasMatch ? 'block' : 'none';
    });

    if (!found) {
        alert('Kein passendes Thema gefunden.');
    }
}

// Das oder dass - Lösungen anzeigen
function toggleAnswers() {
    const answersDiv = document.getElementById('answers');
    const feedbackDiv = document.getElementById('feedback');
    
    feedbackDiv.style.display = 'none';
    
    if (answersDiv.style.display === 'none' || answersDiv.style.display === '') {
        answersDiv.style.display = 'block';
    } else {
        answersDiv.style.display = 'none';
    }
}

function checkAnswer(button) {
    const isCorrect = button.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-green-500');
        button.innerText = 'Richtig!';
    } else {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-red-500');
        button.innerText = 'Falsch!';
    }

    // Deaktiviere alle Buttons nach der Auswahl
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Aktiviere den "Weiter"-Button
    let nextButton;
    let timerDuration = 10;
    
    if (button.closest('#pronomen-questions')) {
        nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        // Starte den Timer für Pronomen
        console.log("Starte Pronomen-Timer"); // Debug-Ausgabe
        startTimer(timerDuration, () => {
            if (nextButton) {
                nextButton.click();
            }
        });
    } 
    else if (button.closest('#prosa-questions')) {
        nextButton = document.getElementById('prosa-next-button');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        // Starte den Timer für Prosa
        console.log("Starte Prosa-Timer"); // Debug-Ausgabe
        startProsaTimer(timerDuration, () => {
            if (nextButton) {
                nextButton.click();
            }
        });
    }
}

// Wortarten überprüfen
function checkWortarten() {
    const correctAnswers = {
        'answer-wortart1': 'artikel',
        'answer-wortart2': 'adjektiv',
        'answer-wortart3': 'nomen'
    };
    
    let feedback = '<p><strong>Ergebnisse:</strong></p><ul>';
    let correct = 0;
    
    for (let i = 1; i <= 3; i++) {
        const userAnswer = document.getElementById('answer-wortart' + i).value;
        const correctAnswer = correctAnswers['answer-wortart' + i];
        
        if (userAnswer === correctAnswer) {
            feedback += `<li>Wort ${i}: <span style="color: green;">Richtig!</span></li>`;
            correct++;
        } else {
            feedback += `<li>Wort ${i}: <span style="color: red;">Falsch.</span> Die richtige Antwort ist <strong>${correctAnswer}</strong>.</li>`;
        }
    }
    
    feedback += `</ul><p>Du hast ${correct} von 3 Wortarten richtig bestimmt.</p>`;
    
    const feedbackDiv = document.getElementById('wortarten-feedback');
    feedbackDiv.innerHTML = feedback;
    feedbackDiv.style.display = 'block';
}

// Pronomen überprüfen
function checkPronomenUebung() {
    const correctAnswers = {
        'pronomen-answer1': 'personal',
        'pronomen-answer2': 'possessiv',
        'pronomen-answer3': 'demonstrativ'
    };
    
    const answerLabels = {
        'personal': 'Personalpronomen',
        'possessiv': 'Possessivpronomen',
        'demonstrativ': 'Demonstrativpronomen',
        'relativ': 'Relativpronomen',
        'reflexiv': 'Reflexivpronomen',
        'interrogativ': 'Interrogativpronomen'
    };
    
    let feedback = '<p><strong>Ergebnisse:</strong></p><ul>';
    let correct = 0;
    
    for (let i = 1; i <= 3; i++) {
        const userAnswer = document.getElementById('pronomen-answer' + i).value;
        const correctAnswer = correctAnswers['pronomen-answer' + i];
        
        if (userAnswer === correctAnswer) {
            feedback += `<li>Satz ${i}: <span style="color: green;">Richtig!</span> Das ist ein ${answerLabels[correctAnswer]}.</li>`;
            correct++;
        } else {
            feedback += `<li>Satz ${i}: <span style="color: red;">Falsch.</span> Die richtige Antwort ist "${answerLabels[correctAnswer]}".</li>`;
        }
    }
    
    feedback += `</ul><p>Du hast ${correct} von 3 Pronomen richtig bestimmt.</p>`;
    
    const feedbackDiv = document.getElementById('pronomen-feedback');
    feedbackDiv.innerHTML = feedback;
    feedbackDiv.style.display = 'block';
}


// Beispielsätze mit markierten Wörtern und ihren Wortarten - reduziert auf 3 Beispiele
const wortartenExamples = [
    {
        text: "<span class='word'>Der</span> <span class='word'>kleine</span> <span class='word'>Junge</span> <span class='word'>läuft</span> <span class='word'>schnell</span> <span class='word'>über</span> <span class='word'>den</span> <span class='word'>Spielplatz</span>.",
        words: [
            {word: "Der", type: "artikel"},
            {word: "kleine", type: "adjektiv"},
            {word: "Junge", type: "nomen"},
            {word: "läuft", type: "verb"},
            {word: "schnell", type: "adverb"},
            {word: "über", type: "präposition"},
            {word: "den", type: "artikel"},
            {word: "Spielplatz", type: "nomen"}
        ]
    },
    {
        text: "<span class='word'>Unsere</span> <span class='word'>Katze</span> <span class='word'>jagt</span> <span class='word'>heimlich</span> <span class='word'>hinter</span> <span class='word'>dem</span> <span class='word'>Zaun</span>.",
        words: [
            {word: "Unsere", type: "pronomen"},
            {word: "Katze", type: "nomen"},
            {word: "jagt", type: "verb"},
            {word: "heimlich", type: "adverb"},
            {word: "hinter", type: "präposition"},
            {word: "dem", type: "artikel"},
            {word: "Zaun", type: "nomen"}
        ]
    },
    {
        text: "<span class='word'>Heute</span> <span class='word'>erzählte</span> <span class='word'>meine</span> <span class='word'>Freundin</span> <span class='word'>von</span> <span class='word'>ihrer</span> <span class='word'>Reise</span>.",
        words: [
            {word: "Heute", type: "adverb"},
            {word: "erzählte", type: "verb"},
            {word: "meine", type: "pronomen"},
            {word: "Freundin", type: "nomen"},
            {word: "von", type: "präposition"},
            {word: "ihrer", type: "pronomen"},
            {word: "Reise", type: "nomen"}
        ]
    }
];

// Fragenkatalog für das/dass - reduziert auf 7 Fragen
const dasOderDassQuestions = [
    {
        id: 1,
        text: "Ich glaube, ___ es morgen regnen wird.",
        correct: "dass",
        explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
    },
    {
        id: 2,
        text: "___ Auto, ___ du gekauft hast, ist sehr schnell.",
        correct: ["Das", "das"],
        explanation: ["Das erste 'Das' ist ein Artikel.", "Das zweite 'das' ist ein Relativpronomen."]
    },
    {
        id: 3,
        text: "Er wusste nicht, ___ er den Schlüssel verloren hatte.",
        correct: "dass",
        explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
    },
    {
        id: 4,
        text: "___ Haus am Ende der Straße gehört meinem Onkel.",
        correct: "Das",
        explanation: "Es handelt sich um einen Artikel."
    },
    {
        id: 5,
        text: "Es ist wichtig, ___ du pünktlich kommst.",
        correct: "dass",
        explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
    },
    {
        id: 6,
        text: "___ ist genau ___, was ich brauche.",
        correct: ["Das", "das"],
        explanation: ["Das erste 'Das' ist ein Demonstrativpronomen.", "Das zweite 'das' ist ein Relativpronomen."]
    },
    {
        id: 7,
        text: "Sie sagt, ___ sie morgen nicht kommen kann.",
        correct: "dass",
        explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
    }
];

// Hilfsfunktion zum Mischen von Arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Funktion zum Laden der Prosa-Analyse Fragen
function loadProsamQuestions() {
    const questionsContainer = document.getElementById('prosa-questions');
    const controlsContainer = document.getElementById('prosa-controls');
    const nextButton = document.getElementById('prosa-next-button');
    const skipButton = document.getElementById('prosa-skip-button');

    prosaQuestions = shuffleArray([
        {
            text: "Welche Erzählperspektive hat ein Ich-Erzähler?",
            answers: [
                { text: "Der Erzähler ist selbst eine Figur in der Geschichte", correct: true },
                { text: "Der Erzähler weiß alles über alle Figuren", correct: false },
                { text: "Der Erzähler beschreibt nur, was er sehen kann", correct: false }
            ]
        },
        {
            text: "Wie erkennt man eine direkte Charakterisierung?",
            answers: [
                { text: "Die Figur wird direkt beschrieben (z. B. 'Er ist mutig')", correct: true },
                { text: "Man erfährt nur durch Handlungen, wie die Figur ist", correct: false },
                { text: "Die Figur wird gar nicht beschrieben", correct: false }
            ]
        },
        {
            text: "Was ist eine Personifikation?",
            answers: [
                { text: "Wenn Dinge oder Tiere menschliche Eigenschaften bekommen", correct: true },
                { text: "Ein Vergleich mit 'wie'", correct: false },
                { text: "Ein anderes Wort für Metapher", correct: false }
            ]
        },
        {
            text: "Was passiert in der Exposition einer Geschichte?",
            answers: [
                { text: "Einführung von Figuren, Ort und Thema", correct: true },
                { text: "Der spannendste Moment der Geschichte", correct: false },
                { text: "Das Ende der Geschichte", correct: false }
            ]
        },
        {
            text: "Was ist ein Leitmotiv?",
            answers: [
                { text: "Ein wiederkehrendes Symbol oder Thema", correct: true },
                { text: "Die Hauptfigur einer Geschichte", correct: false },
                { text: "Der wichtigste Satz in einer Geschichte", correct: false }
            ]
        },
        {
            text: "Was ist eine Rückblende?",
            answers: [
                { text: "Ein Sprung in die Vergangenheit", correct: true },
                { text: "Eine Vorhersage über die Zukunft", correct: false },
                { text: "Ein besonders spannender Moment", correct: false }
            ]
        },
        {
            text: "Was ist eine Metapher?",
            answers: [
                { text: "Ein bildhafter Ausdruck ohne 'wie'", correct: true },
                { text: "Ein Vergleich mit 'wie'", correct: false },
                { text: "Eine wörtliche Beschreibung", correct: false }
            ]
        },
        {
            text: "Was bedeutet ein offenes Ende?",
            answers: [
                { text: "Die Geschichte wird nicht vollständig aufgelöst", correct: true },
                { text: "Alle Fragen werden am Ende beantwortet", correct: false },
                { text: "Die Geschichte endet mit einem Happy End", correct: false }
            ]
        },
        {
            text: "Was ist eine Erzählzeit?",
            answers: [
                { text: "Die Zeit, die man braucht, um eine Geschichte zu lesen", correct: true },
                { text: "Die Zeit, in der die Geschichte spielt", correct: false },
                { text: "Die Anzahl der Kapitel einer Geschichte", correct: false }
            ]
        },
        {
            text: "Was ist der Höhepunkt einer Geschichte?",
            answers: [
                { text: "Der spannendste oder wichtigste Moment", correct: true },
                { text: "Die Einführung der Figuren", correct: false },
                { text: "Das Ende der Geschichte", correct: false }
            ]
        },
        {
            text: "Was ist der Unterschied zwischen innerer und äußerer Handlung?",
            answers: [
                { text: "Innere Handlung sind Gedanken, äußere sind sichtbare Aktionen", correct: true },
                { text: "Äußere Handlung passiert nur in Träumen", correct: false },
                { text: "Es gibt keinen Unterschied", correct: false }
            ]
        },
        {
            text: "Was ist ein Protagonist?",
            answers: [
                { text: "Die Hauptfigur der Geschichte", correct: true },
                { text: "Der Gegenspieler der Hauptfigur", correct: false },
                { text: "Eine Nebenfigur", correct: false }
            ]
        },
        {
            text: "Was ist eine Kurzgeschichte?",
            answers: [
                { text: "Eine kurze Erzählung mit wenigen Figuren", correct: true },
                { text: "Eine lange Geschichte mit vielen Kapiteln", correct: false },
                { text: "Eine Geschichte, die nur aus Dialogen besteht", correct: false }
            ]
        },
        {
            text: "Was bedeutet 'wörtliche Rede'?",
            answers: [
                { text: "Gesprochene Sätze werden direkt wiedergegeben", correct: true },
                { text: "Die Figuren sprechen nur in Gedanken", correct: false },
                { text: "Es ist ein anderes Wort für Beschreibung", correct: false }
            ]
        },
        {
            text: "Was bedeutet 'innerer Monolog'?",
            answers: [
                { text: "Die Gedanken einer Figur werden direkt wiedergegeben", correct: true },
                { text: "Die Figur spricht mit einer anderen Figur", correct: false },
                { text: "Eine Figur erzählt eine Geschichte", correct: false }
            ]
        },
        {
            text: "Was ist eine Parallelhandlung?",
            answers: [
                { text: "Zwei Handlungen laufen gleichzeitig ab", correct: true },
                { text: "Die Geschichte hat eine Rückblende", correct: false },
                { text: "Ein Kapitel wiederholt sich", correct: false }
            ]
        },
        {
            text: "Was ist eine Pointe?",
            answers: [
                { text: "Ein überraschendes oder lustiges Ende", correct: true },
                { text: "Ein trauriges Ende einer Geschichte", correct: false },
                { text: "Der längste Satz in einer Geschichte", correct: false }
            ]
        },
        {
            text: "Was ist eine Übertreibung (Hyperbel)?",
            answers: [
                { text: "Wenn etwas viel größer oder schlimmer dargestellt wird", correct: true },
                { text: "Wenn zwei Dinge miteinander verglichen werden", correct: false },
                { text: "Wenn eine Geschichte realistisch ist", correct: false }
            ]
        },
        {
            text: "Was ist eine Erzählperspektive?",
            answers: [
                { text: "Die Sichtweise, aus der die Geschichte erzählt wird", correct: true },
                { text: "Die Sprache, in der die Geschichte geschrieben ist", correct: false },
                { text: "Der Ort, an dem die Geschichte spielt", correct: false }
            ]
        },
        {
            text: "Was ist eine Klimax?",
            answers: [
                { text: "Eine Steigerung in der Handlung oder Sprache", correct: true },
                { text: "Eine plötzliche Wendung in der Geschichte", correct: false },
                { text: "Das Ende der Geschichte", correct: false }
            ]
        },
        {
            text: "Was bedeutet 'Ironie'?",
            answers: [
                { text: "Das Gegenteil von dem sagen, was man meint", correct: true },
                { text: "Eine besonders traurige Geschichte", correct: false },
                { text: "Eine alte Geschichte", correct: false }
            ]
        }
    ]);
        
    

    currentProsamQuestionIndex = 0;

    // Lade die erste Frage
    loadProsamQuestion(currentProsamQuestionIndex);

    // Event-Listener für Buttons
    nextButton.onclick = () => {
        stopProsaTimer();
        currentProsamQuestionIndex++;
        if (currentProsamQuestionIndex < prosaQuestions.length) {
            loadProsamQuestion(currentProsamQuestionIndex);
        } else {
            questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
            controlsContainer.style.display = 'none';
        }
    };

    // Überarbeite den Skip-Button für Prosa-Analyse
    skipButton.onclick = () => {
        // Zuerst die richtige Antwort markieren
        markCorrectAnswer('prosa-answers-container');
        
        // Timer starten für die Anzeige der Lösung
        startProsaTimer(10, () => {
            // Nach Ablauf des Timers zur nächsten Frage springen
            stopProsaTimer();
            currentProsamQuestionIndex++;
            if (currentProsamQuestionIndex < prosaQuestions.length) {
                loadProsamQuestion(currentProsamQuestionIndex);
            } else {
                questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
                controlsContainer.style.display = 'none';
            }
        });
        
        // Aktiviere den "Weiter"-Button
        nextButton.disabled = false;
    };
}

// Für Prosa-Aufgaben
function loadProsamQuestion(index) {
    const question = prosaQuestions[index];
    const questionsContainer = document.getElementById('prosa-questions');
    const nextButton = document.getElementById('prosa-next-button');

    // Überprüfen, ob das Element existiert
    if (!questionsContainer) {
        console.error("Das Element 'prosa-questions' wurde nicht gefunden.");
        return;
    }

    // Stoppe einen eventuell laufenden Timer
    stopProsaTimer();

    // Frage und Antworten anzeigen
    questionsContainer.innerHTML = `
        <div class="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <h5 class="text-lg font-bold text-purple-700 mb-2">${index + 1}. ${question.text}</h5>
            <div id="prosa-answers-container" class="space-y-2"></div>
        </div>
    `;

    const answersContainer = document.getElementById('prosa-answers-container');
    if (!answersContainer) {
        console.error("Das Element 'prosa-answers-container' wurde nicht gefunden.");
        return;
    }

    const shuffledAnswers = shuffleArray([...question.answers]);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 w-full mb-2';
        button.setAttribute('data-correct', answer.correct);
        // Setze das data-explanation Attribut nur für die korrekte Antwort
        if (answer.correct && question.explanation) {
            button.setAttribute('data-explanation', question.explanation);
        }
        button.innerText = answer.text;
        button.onclick = function () {
            checkAnswer(button);
        };
        answersContainer.appendChild(button);
    });

    // Buttons initialisieren
    document.getElementById('prosa-controls').style.display = 'block';
    nextButton.disabled = true; // Deaktiviert den "Weiter"-Button, bis eine Antwort ausgewählt wurde
}

// Timer für Prosa-Analyse Fragen
let prosaTimerInterval;

function startProsaTimer(duration, onTimeUp) {
    const timerElement = document.getElementById('prosa-timer');
    const timerDisplay = document.getElementById('prosa-countdown');
    
    if (!timerElement || !timerDisplay) {
        console.error("Prosa-Timer-Elemente nicht gefunden");
        return;
    }
    
    let timeLeft = duration;
    
    // Timer anzeigen
    timerElement.style.display = 'block';
    timerElement.innerHTML = 'Zeit bis zur nächsten Frage: <span id="prosa-countdown">' + timeLeft + '</span> Sekunden';
    
    // Interval starten und speichern
    clearInterval(prosaTimerInterval); // Vorherigen Timer stoppen
    
    prosaTimerInterval = setInterval(function() {
        timeLeft--;
        
        // Timer aktualisieren
        document.getElementById('prosa-countdown').textContent = timeLeft;
        
        // Timer beenden, wenn Zeit abgelaufen
        if (timeLeft <= 0) {
            clearInterval(prosaTimerInterval);
            onTimeUp();
        }
    }, 1000);
}

function stopProsaTimer() {
    clearInterval(prosaTimerInterval);
    const timerElement = document.getElementById('prosa-timer');
    if (timerElement) {
        timerElement.style.display = 'none';
    }
}

// Wortarten Fragen
let wortartenQuestions = [];
let currentWortartenQuestionIndex = 0;

// Funktion zum Laden der Wortarten Fragen
function loadWortartenQuestions() {
    const questionsContainer = document.getElementById('wortarten-questions');
    const controlsContainer = document.getElementById('wortarten-controls');
    const nextButton = document.getElementById('wortarten-next-button');
    const skipButton = document.getElementById('wortarten-skip-button');

    if (!questionsContainer) {
        console.error("Element 'wortarten-questions' nicht gefunden!");
        return;
    }

    // Beispiel-Fragen
    wortartenQuestions = shuffleArray([
        {
            text: "Welche Wortart ist 'schnell' im Satz 'Der Hund läuft schnell'?",
            answers: [
                { text: "Adverb", correct: true },
                { text: "Adjektiv", correct: false },
                { text: "Verb", correct: false }
            ]
        },
        {
            text: "Zu welcher Wortart gehört 'weil' im Satz 'Ich gehe nach Hause, weil es regnet'?",
            answers: [
                { text: "Konjunktion", correct: true },
                { text: "Präposition", correct: false },
                { text: "Adverb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'schöne' im Satz 'Das schöne Haus steht am Berg'?",
            answers: [
                { text: "Adjektiv", correct: true },
                { text: "Adverb", correct: false },
                { text: "Nomen", correct: false }
            ]
        },
        {
            text: "Zu welcher Wortart gehört 'neben' im Satz 'Die Katze sitzt neben dem Hund'?",
            answers: [
                { text: "Präposition", correct: true },
                { text: "Konjunktion", correct: false },
                { text: "Adverb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'Freundschaft' im Satz 'Freundschaft ist wichtig'?",
            answers: [
                { text: "Nomen", correct: true },
                { text: "Adjektiv", correct: false },
                { text: "Pronomen", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'hüpfen' im Satz 'Der Frosch kann hoch hüpfen'?",
            answers: [
                { text: "Verb", correct: true },
                { text: "Nomen", correct: false },
                { text: "Adverb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'dieser' im Satz 'Dieser Hund ist süß'?",
            answers: [
                { text: "Pronomen", correct: true },
                { text: "Nomen", correct: false },
                { text: "Adjektiv", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'groß' im Satz 'Das große Haus steht am See'?",
            answers: [
                { text: "Adjektiv", correct: true },
                { text: "Adverb", correct: false },
                { text: "Konjunktion", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'heute' im Satz 'Heute scheint die Sonne'?",
            answers: [
                { text: "Adverb", correct: true },
                { text: "Nomen", correct: false },
                { text: "Verb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'außer' im Satz 'Alle kamen zur Party, außer Lisa'?",
            answers: [
                { text: "Präposition", correct: true },
                { text: "Konjunktion", correct: false },
                { text: "Adjektiv", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'ah!' im Satz 'Ah! Jetzt verstehe ich es!'?",
            answers: [
                { text: "Interjektion", correct: true },
                { text: "Adverb", correct: false },
                { text: "Verb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'müde' im Satz 'Ich bin heute sehr müde'?",
            answers: [
                { text: "Adjektiv", correct: true },
                { text: "Adverb", correct: false },
                { text: "Nomen", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'nicht' im Satz 'Ich mag das nicht'?",
            answers: [
                { text: "Adverb", correct: true },
                { text: "Verb", correct: false },
                { text: "Nomen", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'unter' im Satz 'Der Ball liegt unter dem Tisch'?",
            answers: [
                { text: "Präposition", correct: true },
                { text: "Konjunktion", correct: false },
                { text: "Adjektiv", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'sie' im Satz 'Sie geht zur Schule'?",
            answers: [
                { text: "Pronomen", correct: true },
                { text: "Nomen", correct: false },
                { text: "Verb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'wenn' im Satz 'Wenn du willst, können wir gehen'?",
            answers: [
                { text: "Konjunktion", correct: true },
                { text: "Adverb", correct: false },
                { text: "Präposition", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'grün' im Satz 'Das grüne Auto fährt schnell'?",
            answers: [
                { text: "Adjektiv", correct: true },
                { text: "Adverb", correct: false },
                { text: "Nomen", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'zum' im Satz 'Ich gehe zum Bäcker'?",
            answers: [
                { text: "Präposition", correct: true },
                { text: "Konjunktion", correct: false },
                { text: "Adjektiv", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'und' im Satz 'Ich mag Äpfel und Bananen'?",
            answers: [
                { text: "Konjunktion", correct: true },
                { text: "Adverb", correct: false },
                { text: "Pronomen", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'plötzlich' im Satz 'Plötzlich begann es zu regnen'?",
            answers: [
                { text: "Adverb", correct: true },
                { text: "Adjektiv", correct: false },
                { text: "Verb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'mein' im Satz 'Das ist mein Auto'?",
            answers: [
                { text: "Pronomen", correct: true },
                { text: "Adjektiv", correct: false },
                { text: "Konjunktion", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'ohne' im Satz 'Ohne Regen ist der Sommer schön'?",
            answers: [
                { text: "Präposition", correct: true },
                { text: "Adjektiv", correct: false },
                { text: "Adverb", correct: false }
            ]
        },
        {
            text: "Welche Wortart ist 'denken' im Satz 'Ich denke an dich'?",
            answers: [
                { text: "Verb", correct: true },
                { text: "Nomen", correct: false },
                { text: "Adverb", correct: false }
            ]
        }
    ]);    

    currentWortartenQuestionIndex = 0;

    // Lade die erste Frage
    loadWortartenQuestion(currentWortartenQuestionIndex);

    // Event-Listener für Buttons
    nextButton.onclick = () => {
        stopWortartenTimer();
        currentWortartenQuestionIndex++;
        if (currentWortartenQuestionIndex < wortartenQuestions.length) {
            loadWortartenQuestion(currentWortartenQuestionIndex);
        } else {
            questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
            controlsContainer.style.display = 'none';
        }
    };

    // Überarbeite den Skip-Button für Wortarten
    skipButton.onclick = () => {
        // Zuerst die richtige Antwort markieren
        markCorrectAnswer('wortarten-answers-container');
        
        // Timer starten für die Anzeige der Lösung
        startWortartenTimer(10, () => {
            // Nach Ablauf des Timers zur nächsten Frage springen
            stopWortartenTimer();
            currentWortartenQuestionIndex++;
            if (currentWortartenQuestionIndex < wortartenQuestions.length) {
                loadWortartenQuestion(currentWortartenQuestionIndex);
            } else {
                questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
                controlsContainer.style.display = 'none';
            }
        });
        
        // Aktiviere den "Weiter"-Button
        nextButton.disabled = false;
    };
}

// Funktion zum Laden einer einzelnen Wortarten-Frage
function loadWortartenQuestion(index) {
    const question = wortartenQuestions[index];
    const questionsContainer = document.getElementById('wortarten-questions');
    const nextButton = document.getElementById('wortarten-next-button');

    // Überprüfen, ob das Element existiert
    if (!questionsContainer) {
        console.error("Das Element 'wortarten-questions' wurde nicht gefunden.");
        return;
    }

    // Stoppe einen eventuell laufenden Timer
    stopWortartenTimer();

    // Frage und Antworten anzeigen
    questionsContainer.innerHTML = `
        <div class="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <h5 class="text-lg font-bold text-purple-700 mb-2">${index + 1}. ${question.text}</h5>
            <div id="wortarten-answers-container" class="space-y-2"></div>
        </div>
    `;

    const answersContainer = document.getElementById('wortarten-answers-container');
    if (!answersContainer) {
        console.error("Das Element 'wortarten-answers-container' wurde nicht gefunden.");
        return;
    }

    const shuffledAnswers = shuffleArray([...question.answers]);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 w-full mb-2';
        button.setAttribute('data-correct', answer.correct);
        // Setze das data-explanation Attribut nur für die korrekte Antwort
        if (answer.correct && question.explanation) {
            button.setAttribute('data-explanation', question.explanation);
        }
        button.innerText = answer.text;
        button.onclick = function () {
            checkWortartenAnswer(button);
        };
        answersContainer.appendChild(button);
    });

    // Buttons initialisieren
    document.getElementById('wortarten-controls').style.display = 'block';
    nextButton.disabled = true; // Deaktiviert den "Weiter"-Button, bis eine Antwort ausgewählt wurde
}

// Funktion zum Überprüfen der Antworten bei Wortarten
function checkWortartenAnswer(button) {
    const isCorrect = button.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-green-500');
        button.innerText = 'Richtig!';
    } else {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-red-500');
        button.innerText = 'Falsch!';
    }

    // Deaktiviere alle Buttons nach der Auswahl
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Aktiviere den "Weiter"-Button
    const nextButton = document.getElementById('wortarten-next-button');
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Starte den Timer für die Anzeige der Lösung
    startWortartenTimer(10, () => {
        if (nextButton) {
            nextButton.click(); // Automatisch zur nächsten Frage springen
        }
    });
}

// Timer für Wortarten-Aufgaben
let wortartenTimerInterval;

function startWortartenTimer(duration, onTimeUp) {
    const timerElement = document.getElementById('wortarten-timer');
    const timerDisplay = document.getElementById('wortarten-countdown');
    
    if (!timerElement || !timerDisplay) {
        console.error("Wortarten-Timer-Elemente nicht gefunden");
        return;
    }
    
    let timeLeft = duration;
    
    // Timer anzeigen
    timerElement.style.display = 'block';
    timerDisplay.textContent = timeLeft;
    
    // Interval starten und speichern
    clearInterval(wortartenTimerInterval); // Vorherigen Timer stoppen
    
    wortartenTimerInterval = setInterval(function() {
        timeLeft--;
        
        // Timer aktualisieren
        timerDisplay.textContent = timeLeft;
        
        // Timer beenden, wenn Zeit abgelaufen
        if (timeLeft <= 0) {
            clearInterval(wortartenTimerInterval);
            onTimeUp();
        }
    }, 1000);
}

function stopWortartenTimer() {
    clearInterval(wortartenTimerInterval);
    const timerElement = document.getElementById('wortarten-timer');
    if (timerElement) {
        timerElement.style.display = 'none';
    }
}

// Funktion zum Markieren der richtigen Antwort inkl. Anzeige der Erklärung
function markCorrectAnswer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID '${containerId}' nicht gefunden.`);
        return;
    }
    
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.getAttribute('data-correct') === 'true') {
            button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
            button.classList.add('bg-green-500', 'text-white');
            // Häkchen zur Beschriftung hinzufügen
            button.innerText = button.innerText.includes('✓') ? button.innerText : button.innerText + " ✓";
            
            // Falls eine Erklärung vorhanden ist, diese anzeigen
            const explanation = button.getAttribute('data-explanation');
            if (explanation) {
                // Prüfen, ob schon ein Erklärungselement existiert (um Dopplungen zu vermeiden)
                if (!button.nextElementSibling || !button.nextElementSibling.classList.contains('explanation')) {
                    const explanationDiv = document.createElement('div');
                    explanationDiv.className = 'explanation mt-2 text-sm text-green-800';
                    explanationDiv.innerText = explanation;
                    button.parentNode.insertBefore(explanationDiv, button.nextSibling);
                }
            }
        } else {
            button.classList.add('opacity-50');
        }
    });
}

// Das und Dass Fragen
let dasunddassQuestions = [];
let currentDasunddassQuestionIndex = 0;

// Funktion zum Laden der Das und Dass Fragen
function loadDasunddassQuestions() {
    const questionsContainer = document.getElementById('dasunddass-questions');
    const controlsContainer = document.getElementById('dasunddass-controls');
    const nextButton = document.getElementById('dasunddass-next-button');
    const skipButton = document.getElementById('dasunddass-skip-button');

    // Beispiel-Fragen basierend auf dem bestehenden dasOderDassQuestions-Array
    dasunddassQuestions = shuffleArray([
        {
            text: "Ich glaube, ___ es morgen regnen wird.",
            answers: [
                { text: "dass", correct: true },
                { text: "das", correct: false }
            ],
            explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
        },
        {
            text: "___ Auto, welches du gekauft hast, ist sehr schnell.",
            answers: [
                { text: "Das", correct: true },
                { text: "Dass", correct: false }
            ],
            explanation: "Hier handelt es sich um einen Artikel vor 'Auto'."
        },
        {
            text: "Er wusste nicht, ___ er den Schlüssel verloren hatte.",
            answers: [
                { text: "dass", correct: true },
                { text: "das", correct: false }
            ],
            explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
        },
        {
            text: "___ Haus am Ende der Straße gehört meinem Onkel.",
            answers: [
                { text: "Das", correct: true },
                { text: "Dass", correct: false }
            ],
            explanation: "Es handelt sich um einen Artikel vor 'Haus'."
        },
        {
            text: "Es ist wichtig, ___ du pünktlich kommst.",
            answers: [
                { text: "dass", correct: true },
                { text: "das", correct: false }
            ],
            explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
        },
        {
            text: "___ ist genau, was ich brauche.",
            answers: [
                { text: "Das", correct: true },
                { text: "Dass", correct: false }
            ],
            explanation: "Es handelt sich um ein Demonstrativpronomen."
        },
        {
            text: "Sie sagt, ___ sie morgen nicht kommen kann.",
            answers: [
                { text: "dass", correct: true },
                { text: "das", correct: false }
            ],
            explanation: "Es handelt sich um eine Konjunktion, die einen Nebensatz einleitet."
        }
    ]);

    currentDasunddassQuestionIndex = 0;

    // Lade die erste Frage
    loadDasunddassQuestion(currentDasunddassQuestionIndex);

    // Event-Listener für Buttons
    nextButton.onclick = () => {
        stopDasunddassTimer();
        currentDasunddassQuestionIndex++;
        if (currentDasunddassQuestionIndex < dasunddassQuestions.length) {
            loadDasunddassQuestion(currentDasunddassQuestionIndex);
        } else {
            questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
            controlsContainer.style.display = 'none';
        }
    };

    // Überarbeite den Skip-Button für Das und Dass
    skipButton.onclick = () => {
        // Zuerst die richtige Antwort markieren
        markCorrectAnswer('dasunddass-answers-container');
        
        // Timer starten für die Anzeige der Lösung
        startDasunddassTimer(10, () => {
            // Nach Ablauf des Timers zur nächsten Frage springen
            stopDasunddassTimer();
            currentDasunddassQuestionIndex++;
            if (currentDasunddassQuestionIndex < dasunddassQuestions.length) {
                loadDasunddassQuestion(currentDasunddassQuestionIndex);
            } else {
                questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
                controlsContainer.style.display = 'none';
            }
        });
        
        // Aktiviere den "Weiter"-Button
        nextButton.disabled = false;
    };
}

// Funktion zum Laden einer einzelnen Das und Dass Frage
function loadDasunddassQuestion(index) {
    const question = dasunddassQuestions[index];
    const questionsContainer = document.getElementById('dasunddass-questions');
    const nextButton = document.getElementById('dasunddass-next-button');

    // Überprüfen, ob das Element existiert
    if (!questionsContainer) {
        console.error("Das Element 'dasunddass-questions' wurde nicht gefunden.");
        return;
    }

    // Stoppe einen eventuell laufenden Timer
    stopDasunddassTimer();

    // Frage und Antworten anzeigen
    const questionText = question.text.replace("___", '<span class="bg-yellow-200 px-1 rounded">___</span>');
    
    questionsContainer.innerHTML = `
        <div class="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <h5 class="text-lg font-bold text-purple-700 mb-2">${index + 1}. ${questionText}</h5>
            <div id="dasunddass-answers-container" class="space-y-2"></div>
        </div>
    `;

    const answersContainer = document.getElementById('dasunddass-answers-container');
    if (!answersContainer) {
        console.error("Das Element 'dasunddass-answers-container' wurde nicht gefunden.");
        return;
    }

    const shuffledAnswers = shuffleArray([...question.answers]);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 w-full mb-2';
        button.setAttribute('data-correct', answer.correct);
        // Setze das data-explanation Attribut nur für die korrekte Antwort
        if (answer.correct && question.explanation) {
            button.setAttribute('data-explanation', question.explanation);
        }
        button.innerText = answer.text;
        button.onclick = function () {
            checkDasunddassAnswer(button);
        };
        answersContainer.appendChild(button);
    });

    // Buttons initialisieren
    document.getElementById('dasunddass-controls').style.display = 'block';
    nextButton.disabled = true; // Deaktiviert den "Weiter"-Button, bis eine Antwort ausgewählt wurde
}

// Funktion zum Überprüfen der Antworten bei Das und Dass
function checkDasunddassAnswer(button) {
    const isCorrect = button.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-green-500');
        button.innerText = 'Richtig!';
    } else {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-red-500');
        button.innerText = 'Falsch!';
    }

    // Deaktiviere alle Buttons nach der Auswahl
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Aktiviere den "Weiter"-Button
    const nextButton = document.getElementById('dasunddass-next-button');
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Starte den Timer für die Anzeige der Lösung
    startDasunddassTimer(10, () => {
        if (nextButton) {
            nextButton.click(); // Automatisch zur nächsten Frage springen
        }
    });
}

// Timer für Das und Dass Fragen
let dasunddassTimerInterval;

function startDasunddassTimer(duration, onTimeUp) {
    const timerElement = document.getElementById('dasunddass-timer');
    const timerDisplay = document.getElementById('dasunddass-countdown');
    
    if (!timerElement || !timerDisplay) {
        console.error("Das und Dass Timer-Elemente nicht gefunden");
        return;
    }
    
    let timeLeft = duration;
    
    // Timer anzeigen
    timerElement.style.display = 'block';
    timerDisplay.textContent = timeLeft;
    
    // Interval starten und speichern
    clearInterval(dasunddassTimerInterval); // Vorherigen Timer stoppen
    
    dasunddassTimerInterval = setInterval(function() {
        timeLeft--;
        
        // Timer aktualisieren
        timerDisplay.textContent = timeLeft;
        
        // Timer beenden, wenn Zeit abgelaufen
        if (timeLeft <= 0) {
            clearInterval(dasunddassTimerInterval);
            onTimeUp();
        }
    }, 1000);
}

function stopDasunddassTimer() {
    clearInterval(dasunddassTimerInterval);
    const timerElement = document.getElementById('dasunddass-timer');
    if (timerElement) {
        timerElement.style.display = 'none';
    }
}

// Funktion zum Laden von Pronomen-Fragen
function loadPronomenQuestions() {
    const questionsContainer = document.getElementById('pronomen-questions');
    const controlsContainer = document.getElementById('pronomen-controls');
    const nextButton = document.getElementById('next-button');
    const skipButton = document.getElementById('skip-button');
    
    if (!questionsContainer) {
        console.error("Element 'pronomen-questions' nicht gefunden!");
        return;
    }

    pronomenQuestions = shuffleArray([
        {
            text: "Welches Pronomen passt? ___ bist mein bester Freund.",
            answers: [
                { text: "Du", correct: true },
                { text: "Ich", correct: false },
                { text: "Er", correct: false }
            ],
            explanation: "„Du“ ist korrekt, weil die angesprochene Person gemeint ist."
        },
        {
            text: "Setze das richtige Pronomen ein: Das ist ___ Hund.",
            answers: [
                { text: "sein", correct: true },
                { text: "ihr", correct: false },
                { text: "unser", correct: false }
            ],
            explanation: "„sein“ ist korrekt, weil es sich auf eine männliche Person bezieht."
        },
        {
            text: "Welches Pronomen ersetzt den Namen? Anna kauft Brot. ___ bezahlt an der Kasse.",
            answers: [
                { text: "Sie", correct: true },
                { text: "Er", correct: false },
                { text: "Es", correct: false }
            ],
            explanation: "„Sie“ ist korrekt, weil es sich auf Anna bezieht."
        },
        {
            text: "Welches Pronomen passt? Ich sehe einen Baum. ___ ist groß.",
            answers: [
                { text: "Er", correct: true },
                { text: "Sie", correct: false },
                { text: "Es", correct: false }
            ],
            explanation: "„Er“ ist korrekt, weil „Baum“ ein maskulines Nomen ist."
        },
        {
            text: "Setze das passende Fragepronomen ein: ___ kommt heute mit?",
            answers: [
                { text: "Wer", correct: true },
                { text: "Was", correct: false },
                { text: "Welches", correct: false }
            ],
            explanation: "„Wer“ fragt nach einer Person."
        },
        {
            text: "Wähle das richtige Relativpronomen: Das ist das Auto, ___ mir gehört.",
            answers: [
                { text: "das", correct: true },
                { text: "welches", correct: false },
                { text: "der", correct: false }
            ],
            explanation: "„das“ ist korrekt, da es sich auf das neutrale Nomen „Auto“ bezieht."
        },
        {
            text: "Welches Pronomen ist ein Possessivpronomen?",
            answers: [
                { text: "mein", correct: true },
                { text: "ich", correct: false },
                { text: "du", correct: false }
            ],
            explanation: "„mein“ zeigt Besitz an, daher ist es ein Possessivpronomen."
        },
        {
            text: "Setze das richtige Pronomen ein: ___ haben viel Spaß gehabt.",
            answers: [
                { text: "Wir", correct: true },
                { text: "Sie", correct: false },
                { text: "Ihr", correct: false }
            ],
            explanation: "„Wir“ ist korrekt für die erste Person Plural."
        },
        {
            text: "Welches Pronomen ersetzt den Namen? Peter spielt Fußball. ___ schießt ein Tor.",
            answers: [
                { text: "Er", correct: true },
                { text: "Sie", correct: false },
                { text: "Es", correct: false }
            ],
            explanation: "„Er“ ist korrekt, weil es sich auf Peter bezieht."
        },
        {
            text: "Welches Demonstrativpronomen passt? Ich nehme ___ Buch.",
            answers: [
                { text: "dieses", correct: true },
                { text: "mein", correct: false },
                { text: "sie", correct: false }
            ],
            explanation: "„dieses“ ist korrekt, weil es auf ein bestimmtes Buch verweist."
        },
        {
            text: "Welches Reflexivpronomen passt? Ich freue ___ auf die Ferien.",
            answers: [
                { text: "mich", correct: true },
                { text: "dich", correct: false },
                { text: "uns", correct: false }
            ],
            explanation: "„mich“ ist korrekt, weil es sich auf das Subjekt „Ich“ bezieht."
        },
        {
            text: "Welches Indefinitpronomen passt? ___ hat meine Tasche genommen!",
            answers: [
                { text: "Jemand", correct: true },
                { text: "Wer", correct: false },
                { text: "Welche", correct: false }
            ],
            explanation: "„Jemand“ ist korrekt, weil es eine unbestimmte Person bezeichnet."
        },
        {
            text: "Welches Personalpronomen passt? Wir gehen ins Kino. ___ kauft die Tickets.",
            answers: [
                { text: "Er", correct: true },
                { text: "Ich", correct: false },
                { text: "Sie", correct: false }
            ],
            explanation: "„Er“ ist korrekt, wenn es sich auf eine Person aus der Gruppe bezieht."
        },
        {
            text: "Welches Pronomen passt? Ich sehe ein Auto. ___ ist rot.",
            answers: [
                { text: "Es", correct: true },
                { text: "Er", correct: false },
                { text: "Sie", correct: false }
            ],
            explanation: "„Es“ ist korrekt, weil „Auto“ ein neutrales Nomen ist."
        },
        {
            text: "Welches Pronomen passt? ___ Fahrrad steht vor dem Haus.",
            answers: [
                { text: "Mein", correct: true },
                { text: "Sein", correct: false },
                { text: "Unser", correct: false }
            ],
            explanation: "„Mein“ zeigt Besitz an, daher ist es ein Possessivpronomen."
        },
        {
            text: "Setze das richtige Pronomen ein: ___ geht ins Kino?",
            answers: [
                { text: "Wer", correct: true },
                { text: "Wen", correct: false },
                { text: "Was", correct: false }
            ],
            explanation: "„Wer“ fragt nach einer Person."
        },
        {
            text: "Welches Relativpronomen passt? Das ist das Mädchen, ___ Fußball spielt.",
            answers: [
                { text: "das", correct: true },
                { text: "welches", correct: false },
                { text: "der", correct: false }
            ],
            explanation: "„das“ ist korrekt, weil es sich auf „Mädchen“ bezieht."
        },
        {
            text: "Welches Reflexivpronomen passt? Er duscht ___ jeden Morgen.",
            answers: [
                { text: "sich", correct: true },
                { text: "ihn", correct: false },
                { text: "ihm", correct: false }
            ],
            explanation: "„sich“ ist korrekt, weil es sich auf das Subjekt „Er“ bezieht."
        },
        {
            text: "Welches Fragepronomen passt? ___ Buch gehört dir?",
            answers: [
                { text: "Welches", correct: true },
                { text: "Was", correct: false },
                { text: "Wer", correct: false }
            ],
            explanation: "„Welches“ fragt nach einem bestimmten Buch."
        },
        {
            text: "Welches Demonstrativpronomen passt? ___ Mann dort ist mein Onkel.",
            answers: [
                { text: "Jener", correct: true },
                { text: "Sein", correct: false },
                { text: "Mein", correct: false }
            ],
            explanation: "„Jener“ zeigt auf eine bestimmte Person."
        }
    ]);
    

    currentPronomenQuestionIndex = 0;

    // Lade die erste Frage
    loadQuestion(currentPronomenQuestionIndex);

    // Event-Listener für Buttons
    if (nextButton) {
        nextButton.onclick = () => {
            stopTimer();
            currentPronomenQuestionIndex++;
            if (currentPronomenQuestionIndex < pronomenQuestions.length) {
                loadQuestion(currentPronomenQuestionIndex);
            } else {
                questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
                if (controlsContainer) {
                    controlsContainer.style.display = 'none';
                }
            }
        };
    }

    // Überarbeite den Skip-Button für Pronomen
    if (skipButton) {
        skipButton.onclick = () => {
            // Zuerst die richtige Antwort markieren
            markCorrectAnswer('answers-container');
            
            // Timer starten für die Anzeige der Lösung
            startTimer(10, () => {
                // Nach Ablauf des Timers zur nächsten Frage springen
                stopTimer();
                currentPronomenQuestionIndex++;
                if (currentPronomenQuestionIndex < pronomenQuestions.length) {
                    loadQuestion(currentPronomenQuestionIndex);
                } else {
                    questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
                    if (controlsContainer) {
                        controlsContainer.style.display = 'none';
                    }
                }
            });
            
            // Aktiviere den "Weiter"-Button
            if (nextButton) {
                nextButton.disabled = false;
            }
        };
    }
}

// Korrigierte Version der pronomenQuestions:
pronomenQuestions = shuffleArray([
    {
        text: "Welches Pronomen passt in den Satz? ___ gehe heute ins Kino.",
        answers: [
            { text: "Ich", correct: true },
            { text: "Du", correct: false },
            { text: "Er", correct: false }
        ],
        explanation: "„Ich“ ist korrekt, da es sich um das Subjekt des Satzes handelt."
    },
    {
        text: "Setze das richtige Pronomen ein: Das ist ___ Buch.",
        answers: [
            { text: "mein", correct: true },
            { text: "dein", correct: false },
            { text: "sein", correct: false }
        ],
        explanation: "„mein“ passt, weil es den Besitz des Buches anzeigt."
    },
    {
        text: "Welches Pronomen passt in den Satz? ___ hat das gesagt?",
        answers: [
            { text: "Wer", correct: true },
            { text: "Was", correct: false },
            { text: "Welcher", correct: false }
        ],
        explanation: "„Wer“ fragt explizit nach der Person, die spricht."
    }
]);

// Stilmittel-Fragen
let stilmittelQuestions = [];
let currentStilmittelQuestionIndex = 0;
let stilmittelTimerInterval;

// Funktion zum Laden der Stilmittel-Fragen
function loadStilmittelQuestions() {
    const questionsContainer = document.getElementById('stilmittel-questions');
    const controlsContainer = document.getElementById('stilmittel-controls');
    const nextButton = document.getElementById('stilmittel-next-button');
    const skipButton = document.getElementById('stilmittel-skip-button');

    if (!questionsContainer) {
        console.error("Element 'stilmittel-questions' nicht gefunden!");
        return;
    }

    stilmittelQuestions = shuffleArray([
        {
            text: "Was ist eine Metapher?",
            answers: [
                { text: "Ein bildhafter Ausdruck ohne 'wie'", correct: true },
                { text: "Ein Vergleich mit 'wie'", correct: false },
                { text: "Eine wörtliche Beschreibung", correct: false }
            ],
            explanation: "Eine Metapher ist ein bildhafter Ausdruck, der ohne Vergleichswörter wie 'wie' auskommt und eine direkte Übertragung darstellt."
        },
        {
            text: "Was ist eine Personifikation?",
            answers: [
                { text: "Wenn unbelebten Dingen menschliche Eigenschaften zugeschrieben werden", correct: true },
                { text: "Ein Vergleich mit 'wie'", correct: false },
                { text: "Eine Übertreibung", correct: false }
            ],
            explanation: "Bei einer Personifikation werden unbelebten Dingen oder abstrakten Begriffen menschliche Eigenschaften zugeschrieben, z.B. 'Die Sonne lacht'."
        },
        {
            text: "Was ist eine Hyperbel?",
            answers: [
                { text: "Eine bewusste Übertreibung", correct: true },
                { text: "Ein Vergleich mit 'wie'", correct: false },
                { text: "Eine Verniedlichung", correct: false }
            ],
            explanation: "Eine Hyperbel ist eine starke, bewusste Übertreibung, um etwas zu betonen, z.B. 'Ich habe tausendmal gefragt'."
        },
        {
            text: "Was ist ein Vergleich?",
            answers: [
                { text: "Eine Gegenüberstellung mit 'wie' oder 'als'", correct: true },
                { text: "Eine Übertreibung", correct: false },
                { text: "Eine Verneinung", correct: false }
            ],
            explanation: "Ein Vergleich stellt zwei Dinge mit Hilfe von 'wie' oder 'als' gegenüber, z.B. 'stark wie ein Löwe'."
        },
        {
            text: "Was ist eine Alliteration?",
            answers: [
                { text: "Mehrere Wörter beginnen mit dem gleichen Laut", correct: true },
                { text: "Eine Redewendung", correct: false },
                { text: "Eine Übertreibung", correct: false }
            ],
            explanation: "Bei einer Alliteration beginnen mehrere aufeinanderfolgende Wörter mit demselben Buchstaben, z.B. 'Milch macht müde Männer munter'."
        },
        {
            text: "Was ist eine Anapher?",
            answers: [
                { text: "Wiederholung eines Wortes am Satzanfang", correct: true },
                { text: "Wiederholung eines Wortes am Satzende", correct: false },
                { text: "Verschachtelung von Sätzen", correct: false }
            ],
            explanation: "Eine Anapher ist die Wiederholung eines Wortes oder einer Wortgruppe am Anfang mehrerer aufeinanderfolgender Sätze oder Verse."
        },
        {
            text: "Was ist eine Antithese?",
            answers: [
                { text: "Gegenüberstellung von Gegensätzen", correct: true },
                { text: "Wiederholung von Wörtern", correct: false },
                { text: "Verniedlichung", correct: false }
            ],
            explanation: "Eine Antithese stellt gegensätzliche Begriffe oder Gedanken gegenüber, z.B. 'Arm und Reich', 'Jung und Alt'."
        },
        {
            text: "Was ist Ironie?",
            answers: [
                { text: "Das Gegenteil dessen sagen, was gemeint ist", correct: true },
                { text: "Eine Verniedlichung", correct: false },
                { text: "Eine Übertreibung", correct: false }
            ],
            explanation: "Bei Ironie sagt man das Gegenteil dessen, was man eigentlich meint, oft um Kritik auszudrücken oder humorvoll zu sein."
        },
        {
            text: "Was ist ein Euphemismus?",
            answers: [
                { text: "Beschönigender Ausdruck für etwas Unangenehmes", correct: true },
                { text: "Eine starke Übertreibung", correct: false },
                { text: "Eine Verneinung", correct: false }
            ],
            explanation: "Ein Euphemismus ist ein beschönigender Ausdruck für etwas Unangenehmes oder Tabuhaftes, z.B. 'entschlafen' statt 'sterben'."
        },
        {
            text: "Was ist ein Oxymoron?",
            answers: [
                { text: "Verbindung zweier sich widersprechender Begriffe", correct: true },
                { text: "Eine Verneinung", correct: false },
                { text: "Eine Übertreibung", correct: false }
            ],
            explanation: "Ein Oxymoron verbindet zwei sich eigentlich widersprechende Begriffe zu einem neuen Ausdruck, z.B. 'beredtes Schweigen' oder 'bittersüß'."
        },
        {
            text: "Was ist eine Ellipse?",
            answers: [
                { text: "Auslassung von Satzteilen, die ergänzt werden können", correct: true },
                { text: "Hinzufügen von Wörtern", correct: false },
                { text: "Umstellung von Satzteilen", correct: false }
            ],
            explanation: "Eine Ellipse ist die Auslassung von Satzteilen, die vom Leser ergänzt werden können, z.B. 'Ich nach Hause' statt 'Ich gehe nach Hause'."
        },
        {
            text: "Was ist ein Parallelismus?",
            answers: [
                { text: "Wiederholung gleicher syntaktischer Strukturen", correct: true },
                { text: "Gegensätzliche Aussagen", correct: false },
                { text: "Verneinung einer Aussage", correct: false }
            ],
            explanation: "Ein Parallelismus ist die Wiederholung gleicher syntaktischer Strukturen in aufeinanderfolgenden Sätzen oder Satzteilen."
        },
        {
            text: "Was ist ein Pleonasmus?",
            answers: [
                { text: "Sprachliche Dopplung mit gleicher Bedeutung", correct: true },
                { text: "Verschachtelung von Sätzen", correct: false },
                { text: "Trennung von zusammengehörigen Wörtern", correct: false }
            ],
            explanation: "Ein Pleonasmus ist eine sprachliche Dopplung mit gleicher Bedeutung, z.B. 'weißer Schimmel' oder 'alter Greis'."
        },
        {
            text: "Was ist eine Onomatopöie?",
            answers: [
                { text: "Lautmalerei/Nachahmung von Geräuschen", correct: true },
                { text: "Bildhafte Beschreibung", correct: false },
                { text: "Übertreibung", correct: false }
            ],
            explanation: "Eine Onomatopöie ahmt Geräusche durch Wörter nach, z.B. 'zischen', 'brummen', 'tick-tack'."
        },
        {
            text: "Was ist ein Chiasmus?",
            answers: [
                { text: "Überkreuzstellung von Satzgliedern", correct: true },
                { text: "Wiederholung von Wörtern", correct: false },
                { text: "Bildhafte Beschreibung", correct: false }
            ],
            explanation: "Ein Chiasmus ist die überkreuzte Anordnung von Satzgliedern, z.B. 'Die Kunst ist lang, und kurz ist unser Leben'."
        }
    ]);

    currentStilmittelQuestionIndex = 0;

    // Lade die erste Frage
    loadStilmittelQuestion(currentStilmittelQuestionIndex);

    // Event-Listener für Buttons
    nextButton.onclick = () => {
        stopStilmittelTimer();
        currentStilmittelQuestionIndex++;
        if (currentStilmittelQuestionIndex < stilmittelQuestions.length) {
            loadStilmittelQuestion(currentStilmittelQuestionIndex);
        } else {
            questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
            controlsContainer.style.display = 'none';
        }
    };

    skipButton.onclick = () => {
        // Zuerst die richtige Antwort markieren
        markCorrectAnswer('stilmittel-answers-container');
        
        // Timer starten für die Anzeige der Lösung
        startStilmittelTimer(10, () => {
            stopStilmittelTimer();
            currentStilmittelQuestionIndex++;
            if (currentStilmittelQuestionIndex < stilmittelQuestions.length) {
                loadStilmittelQuestion(currentStilmittelQuestionIndex);
            } else {
                questionsContainer.innerHTML = '<p class="text-green-500 font-bold">Alle Fragen beantwortet!</p>';
                controlsContainer.style.display = 'none';
            }
        });
        
        // Aktiviere den "Weiter"-Button
        nextButton.disabled = false;
    };
}

function loadStilmittelQuestion(index) {
    const question = stilmittelQuestions[index];
    const questionsContainer = document.getElementById('stilmittel-questions');
    const nextButton = document.getElementById('stilmittel-next-button');

    if (!questionsContainer) {
        console.error("Das Element 'stilmittel-questions' wurde nicht gefunden.");
        return;
    }

    // Stoppe einen eventuell laufenden Timer
    stopStilmittelTimer();

    // Frage und Antworten anzeigen
    questionsContainer.innerHTML = `
        <div class="bg-gray-100 p-4 rounded-lg shadow mb-6">
            <h5 class="text-lg font-bold text-purple-700 mb-2">${index + 1}. ${question.text}</h5>
            <div id="stilmittel-answers-container" class="space-y-2"></div>
        </div>
    `;

    const answersContainer = document.getElementById('stilmittel-answers-container');
    if (!answersContainer) {
        console.error("Das Element 'stilmittel-answers-container' wurde nicht gefunden.");
        return;
    }

    const shuffledAnswers = shuffleArray([...question.answers]);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 w-full mb-2';
        button.setAttribute('data-correct', answer.correct);
        if (answer.correct && question.explanation) {
            button.setAttribute('data-explanation', question.explanation);
        }
        button.innerText = answer.text;
        button.onclick = function () {
            checkStilmittelAnswer(button);
        };
        answersContainer.appendChild(button);
    });

    // Buttons initialisieren
    document.getElementById('stilmittel-controls').style.display = 'block';
    nextButton.disabled = true;
}

function checkStilmittelAnswer(button) {
    const isCorrect = button.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-green-500', 'text-white');
        button.innerText = 'Richtig!';
    } else {
        button.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        button.classList.add('bg-red-500', 'text-white');
        button.innerText = 'Falsch!';
    }

    // Deaktiviere alle Buttons nach der Auswahl
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Zeige die korrekte Antwort und Erklärung an
    markCorrectAnswer(button.parentElement.id);
    
    // Aktiviere den "Weiter"-Button
    const nextButton = document.getElementById('stilmittel-next-button');
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Starte den Timer für die Anzeige der Lösung
    startStilmittelTimer(10, () => {
        if (nextButton) {
            nextButton.click();
        }
    });
}

function startStilmittelTimer(duration, onTimeUp) {
    const timerElement = document.getElementById('stilmittel-timer');
    const timerDisplay = document.getElementById('stilmittel-countdown');
    
    if (!timerElement || !timerDisplay) {
        console.error("Stilmittel-Timer-Elemente nicht gefunden");
        return;
    }
    
    let timeLeft = duration;
    
    // Timer anzeigen
    timerElement.style.display = 'block';
    timerDisplay.textContent = timeLeft;
    
    // Interval starten und speichern
    clearInterval(stilmittelTimerInterval);
    
    stilmittelTimerInterval = setInterval(function() {
        timeLeft--;
        
        // Timer aktualisieren
        timerDisplay.textContent = timeLeft;
        
        // Timer beenden, wenn Zeit abgelaufen
        if (timeLeft <= 0) {
            clearInterval(stilmittelTimerInterval);
            onTimeUp();
        }
    }, 1000);
}

function stopStilmittelTimer() {
    clearInterval(stilmittelTimerInterval);
    const timerElement = document.getElementById('stilmittel-timer');
    if (timerElement) {
        timerElement.style.display = 'none';
    }
}

