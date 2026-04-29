let num1, num2, correctAnswer;
let score = 0;
let wrongScore = 0;
let totalAttempts = 0;

window.onload = function() {
    const problemEl = document.getElementById('problem');
    const answerInput = document.getElementById('answer');
    const scoreEl = document.getElementById('score');
    const wrongEl = document.getElementById('wrong-score');
    const totalEl = document.getElementById('total');
    const impactEl = document.getElementById('impact-msg');
    const historyList = document.getElementById('history-list');

    function generateProblem() {
        num1 = Math.floor(Math.random() * 11) + 2;
        num2 = Math.floor(Math.random() * 11) + 2;
        correctAnswer = num1 * num2;
        problemEl.innerText = num1 + " × " + num2;
        answerInput.value = '';
        answerInput.focus();
    }

    function triggerImpact(isCorrect) {
        const className = isCorrect ? 'flash-correct' : 'flash-incorrect';
        document.body.classList.add(className);

        impactEl.innerText = isCorrect ? "Way to go, Katie! ✨" : "Almost! Try the next one 🎀";
        impactEl.style.color = isCorrect ? "#2e7d32" : "#c2185b";

        setTimeout(() => {
            document.body.classList.remove(className);
        }, 300);
    }

    answerInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && answerInput.value !== "") {
            const userAnswer = parseInt(answerInput.value);
            const isCorrect = (userAnswer === correctAnswer);

            totalAttempts++;
            if (isCorrect) {
                score++;
            } else {
                wrongScore++;
            }

            scoreEl.textContent = score;
            wrongEl.textContent = wrongScore;
            totalEl.textContent = totalAttempts;

            triggerImpact(isCorrect);

            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = isCorrect 
                ? `<span class="history-success">🌸</span> ${num1}×${num2}=${userAnswer}` 
                : `<span class="history-fail">🎀</span> ${num1}×${num2} (Was ${correctAnswer})`;
            historyList.insertBefore(item, historyList.firstChild);

            generateProblem();
        }
    });

    generateProblem();
};

function showResults() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    document.getElementById('res-total').textContent = totalAttempts;
    document.getElementById('res-correct').textContent = score;
    document.getElementById('res-wrong').textContent = wrongScore;
    const percent = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;
    document.getElementById('res-percent').textContent = percent;
}
