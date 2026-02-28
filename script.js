let questions = [
    {
        topic: "grammar",
        question: "Choose the correct sentence:",
        options: ["She go to school.", "She goes to school."],
        answer: 1
    },
    {
        topic: "comprehension",
        question: "What is the synonym of 'Happy'?",
        options: ["Sad", "Joyful"],
        answer: 1
    }
];

let currentQuestion = 0;
let score = 0;
let selectedTopic = "";
let timeLeft = 30;
let timerInterval;

function startQuiz() {
    selectedTopic = document.getElementById("topic").value;
    document.getElementById("quizSection").style.display = "block";
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    let filteredQuestions = questions.filter(q => q.topic === selectedTopic);
    let q = filteredQuestions[currentQuestion];

    document.getElementById("question").innerText = q.question;
    let optionsHtml = "";

    q.options.forEach((option, index) => {
        optionsHtml += `<button onclick="selectAnswer(${index})">${option}</button><br>`;
    });

    document.getElementById("options").innerHTML = optionsHtml;
}

function selectAnswer(index) {
    let filteredQuestions = questions.filter(q => q.topic === selectedTopic);
    if (index === filteredQuestions[currentQuestion].answer) {
        score++;
    }
}

function nextQuestion() {
    currentQuestion++;
    let filteredQuestions = questions.filter(q => q.topic === selectedTopic);

    if (currentQuestion < filteredQuestions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(timerInterval);
    document.getElementById("quizSection").style.display = "none";
    document.getElementById("result").innerText =
        "Your Score: " + score;

    saveToLocalStorage();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft === 0) {
            showResult();
        }
    }, 1000);
}

function saveToLocalStorage() {
    let name = document.getElementById("studentName").value;

    let result = {
        name: name,
        topic: selectedTopic,
        score: score
    };

    localStorage.setItem("quizResult", JSON.stringify(result));
}
