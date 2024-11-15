const quizData = [
    { question: "What does HTML stand for?", a: "Hyper Trainer Marking Language", b: "Hyper Text Marketing Language", c: "Hyper Text Markup Language", d: "Hyper Text Markup Level", correct: "c" },
    { question: "Which property is used in CSS to change the background color of an element?", a: "background-color", b: "color", c: "bgcolor", d: "background", correct: "a" },
    { question: "How do you select an element with the ID “header” in CSS?", a: "#header", b: ".header", c: "header", d: "*header", correct: "a" },
    { question: "Which of the following is a JavaScript data type?", a: "link", b: "number", c: "style", d: "paragraph", correct: "b" },
    { question: "Which CSS property controls the text size?", a: "font-style", b: "text-size", c: "font-size", d: "text-style", correct: "c" },
    { question: "How do you create a function in JavaScript?", a: "function = myFunction()", b: "function myFunction()", c: "create myFunction()", d: "function:myFunction()", correct: "b" }
];

const quizContainer = document.getElementById('quiz');
const quizContent = document.getElementById('quiz-content');
const startButton = document.getElementById('start');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const submitButton = document.getElementById('submit');
const resetButton = document.getElementById('reset');
const resultContainer = document.getElementById('result');
const timerElement = document.getElementById('time');
const viewResultsButton = document.getElementById('view-results');

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
const userAnswers = Array(quizData.length).fill(null);

function loadQuiz() {
    clearSelections();
    const currentQuestionData = quizData[currentQuestionIndex];

    // Set the question content
    quizContainer.innerHTML = `
        <div class="question">${currentQuestionData.question}</div>
        <label class="answer"><input type="radio" name="answer" value="a" ${userAnswers[currentQuestionIndex] === 'a' ? 'checked' : ''}> ${currentQuestionData.a}</label>
        <label class="answer"><input type="radio" name="answer" value="b" ${userAnswers[currentQuestionIndex] === 'b' ? 'checked' : ''}> ${currentQuestionData.b}</label>
        <label class="answer"><input type="radio" name="answer" value="c" ${userAnswers[currentQuestionIndex] === 'c' ? 'checked' : ''}> ${currentQuestionData.c}</label>
        <label class="answer"><input type="radio" name="answer" value="d" ${userAnswers[currentQuestionIndex] === 'd' ? 'checked' : ''}> ${currentQuestionData.d}</label>
    `;
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;

    resetTimer();

    // Set navigation button visibility
    previousButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline';
    nextButton.style.display = currentQuestionIndex < quizData.length - 1 ? 'inline' : 'none';
    submitButton.style.display = currentQuestionIndex === quizData.length - 1 ? 'inline' : 'none';
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    quizContent.style.display = 'block';
    loadQuiz();
});

function handleTimeUp() {
    alert("Time is up! Moving to the next question.");
    userAnswers[currentQuestionIndex] = getSelectedAnswer();
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuiz();
    } else {
        showResults();
    }
}

function getSelectedAnswer() {
    const answers = document.querySelectorAll('input[name="answer"]');
    let selectedAnswer = null;
    answers.forEach((answer) => {
        if (answer.checked) {
            selectedAnswer = answer.value;
        }
    });
    return selectedAnswer;
}

function clearSelections() {
    const answers = document.querySelectorAll('input[name="answer"]');
    answers.forEach((answer) => {
        answer.checked = false;
    });
}

function showResults() {
    resultContainer.style.display = "block";
    clearInterval(timer);

    timerElement.style.display = "none";
    submitButton.style.display = "none";
    resetButton.style.display = "none";

    // Calculate score
    score = userAnswers.reduce((acc, answer, index) => answer === quizData[index].correct ? acc + 1 : acc, 0);

    // Display result
    quizContainer.innerHTML = "";
    resultContainer.innerHTML = `<p>Quiz submitted successfully!</p><p>Your score is <strong>${score} out of ${quizData.length}.</strong></p>`;
    viewResultsButton.style.display = 'inline';
}

nextButton.addEventListener('click', () => {
    const selectedAnswer = getSelectedAnswer();
    if (selectedAnswer !== null) {
        userAnswers[currentQuestionIndex] = selectedAnswer;
        currentQuestionIndex++;
        clearInterval(timer);
        loadQuiz();
    } else {
        alert("Please select an answer!");
    }
});

previousButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuiz();
    }
});

resetButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.style.display = "none";
    startButton.style.display = 'block';
    quizContent.style.display = 'none';
    userAnswers.fill(null);
    clearInterval(timer);
});

submitButton.addEventListener('click', () => {
    userAnswers[currentQuestionIndex] = getSelectedAnswer();
    submitButton.disabled = true; 
    previousButton.style.display = "none";
    nextButton.style.display = "none";
    showResults();
});

function handleTimeUp() {
    alert("Time is up! Moving to the next question."); // Display alert message

    userAnswers[currentQuestionIndex] = getSelectedAnswer(); // Save the user's answer (if any)
    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < quizData.length) {
        loadQuiz(); // Load the next question
    } else {
        showResults(); // If no more questions, show results
    }
}



viewResultsButton.addEventListener('click', () => {
    quizContainer.classList.add('scroll-enabled');
    quizContainer.innerHTML = ''; // Clear quiz container

    quizData.forEach((questionData, index) => {
        // Wrap each question and answer section in a div
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');

        // Create the question HTML
        let questionHTML = `
            <div class="question">${questionData.question}</div>
            <label class="answer ${questionData.correct === 'a' ? 'green' : ''} ${userAnswers[index] === 'a' && userAnswers[index] !== questionData.correct ? 'red' : ''}">
                <input type="radio" name="answer-${index}" value="a" disabled ${userAnswers[index] === 'a' ? 'checked' : ''}> ${questionData.a}
            </label>
            <label class="answer ${questionData.correct === 'b' ? 'green' : ''} ${userAnswers[index] === 'b' && userAnswers[index] !== questionData.correct ? 'red' : ''}">
                <input type="radio" name="answer-${index}" value="b" disabled ${userAnswers[index] === 'b' ? 'checked' : ''}> ${questionData.b}
            </label>
            <label class="answer ${questionData.correct === 'c' ? 'green' : ''} ${userAnswers[index] === 'c' && userAnswers[index] !== questionData.correct ? 'red' : ''}">
                <input type="radio" name="answer-${index}" value="c" disabled ${userAnswers[index] === 'c' ? 'checked' : ''}> ${questionData.c}
            </label>
            <label class="answer ${questionData.correct === 'd' ? 'green' : ''} ${userAnswers[index] === 'd' && userAnswers[index] !== questionData.correct ? 'red' : ''}">
                <input type="radio" name="answer-${index}" value="d" disabled ${userAnswers[index] === 'd' ? 'checked' : ''}> ${questionData.d}
            </label>
        `;
        
        questionDiv.innerHTML = questionHTML;
        quizContainer.appendChild(questionDiv); // Append to quizContainer
    });

    resultContainer.style.display = "none";
    previousButton.style.display = "none";
    nextButton.style.display = "none";
    submitButton.style.display = "none";
    viewResultsButton.style.display = "none";
    resetButton.style.display = "inline";
});

