document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const startScreen = document.getElementById("start-screen");
    const countdownEl = document.getElementById("countdown");
    const choicesGrid = document.getElementById("choices-grid");
    const message = document.getElementById("message");
    const historyList = document.getElementById("history-list");
    
    let userScore = 0;
    let compScore = 0;

    // START BUTTON LOGIC
    startBtn.onclick = () => {
        startScreen.classList.add("hidden");
        message.innerText = "Ready...";
        
        // Start 3-2-1
        countdownEl.classList.remove("hidden");
        let count = 3;
        countdownEl.innerText = count;

        let timer = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.innerText = count;
            } else if (count === 0) {
                countdownEl.innerText = "GO! ✨";
            } else {
                clearInterval(timer);
                countdownEl.classList.add("hidden");
                choicesGrid.classList.remove("hidden"); // Show buttons ONLY now
                message.innerText = "Pick your move!";
            }
        }, 800);
    };

    // CHOICE LOGIC
    document.querySelectorAll(".choice").forEach(btn => {
        btn.onclick = () => {
            const userChoice = btn.id;
            const options = ["rock", "paper", "scissors"];
            const compChoice = options[Math.floor(Math.random() * 3)];
            
            choicesGrid.classList.add("hidden"); // Hide buttons immediately after click
            
            let resultText = "";
            if (userChoice === compChoice) {
                resultText = "Tie! 🎀";
                message.innerText = `It's a draw! (${userChoice})`;
            } else if (
                (userChoice === "rock" && compChoice === "scissors") ||
                (userChoice === "paper" && compChoice === "rock") ||
                (userChoice === "scissors" && compChoice === "paper")
            ) {
                userScore++;
                document.getElementById("user-score").innerText = userScore;
                resultText = "Win! ✨";
                message.innerText = `You won! ${userChoice} beats ${compChoice}`;
            } else {
                compScore++;
                document.getElementById("comp-score").innerText = compScore;
                resultText = "Loss 🌸";
                message.innerText = `CPU won! ${compChoice} beats ${userChoice}`;
            }

            // Update History
            const li = document.createElement("li");
            li.innerText = `${resultText} (You: ${userChoice} | CPU: ${compChoice})`;
            historyList.prepend(li);

            // Show Start Button again for next round
            setTimeout(() => {
                startScreen.classList.remove("hidden");
                startBtn.innerText = "Play Next Round ✨";
            }, 1200);
        };
    });

    document.getElementById("reset").onclick = () => location.reload();
});