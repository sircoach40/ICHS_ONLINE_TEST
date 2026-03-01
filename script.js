let questions = [
{
question: "What is 5 + 5?",
options: ["8", "10", "12"],
answer: "10"
},
{
question: "Capital of France?",
options: ["Paris", "London", "Berlin"],
answer: "Paris"
}
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;

function goToQuiz() {
if (!document.getElementById("fullName").value) {
alert("Please enter your details");
return;
}

document.getElementById("page1").classList.remove("active");
document.getElementById("page2").classList.add("active");

startTimer();
loadQuestion();
}

function loadQuestion() {
let q = questions[currentQuestion];
let html = `<p>${q.question}</p>`;

q.options.forEach(option => {
html += `
<div class="option">
<input type="radio" name="answer" value="${option}">
${option}
</div>`;
});

document.getElementById("questionBox").innerHTML = html;
}

function submitQuiz() {
let selected = document.querySelector('input[name="answer"]:checked');
if (!selected) {
alert("Select an answer");
return;
}

if (selected.value === questions[currentQuestion].answer) {
score++;
}

currentQuestion++;

if (currentQuestion < questions.length) {
loadQuestion();
} else {
finishQuiz();
}
}

function finishQuiz() {
clearInterval(timer);

document.getElementById("page2").classList.remove("active");
document.getElementById("page3").classList.add("active");

document.getElementById("scoreResult").innerText =
"Your Score: " + score + "/" + questions.length;

let percent = (score / questions.length) * 100;
document.getElementById("progress").innerText =
"Performance: " + percent + "%";

saveOffline();
sendToGoogleSheet();
}

function restartQuiz() {
location.reload();
}

function startTimer() {
timer = setInterval(() => {
timeLeft--;
document.getElementById("timer").innerText = "Time: " + timeLeft;

if (timeLeft <= 0) {
finishQuiz();
}
}, 1000);
}

/* OFFLINE MODE */
function saveOffline() {
let data = {
name: document.getElementById("fullName").value,
email: document.getElementById("email").value,
phone: document.getElementById("phone").value,
score: score
};

localStorage.setItem("quizResult", JSON.stringify(data));
}

/* GOOGLE SHEET CONNECTION */
function sendToGoogleSheet() {
fetch("PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE", {
method: "POST",
mode: "no-cors",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name: document.getElementById("fullName").value,
email: document.getElementById("email").value,
phone: document.getElementById("phone").value,
score: score
})
});
}
