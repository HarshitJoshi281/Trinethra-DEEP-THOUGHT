const analyzeBtn = document.getElementById("analyzeBtn");

analyzeBtn.addEventListener("click", async () => {

    const transcript =
        document.getElementById("transcript").value;

    const response = await fetch(
        "http://localhost:5000/analyze",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                transcript: transcript
            })
        }
    );

    const data = await response.json();

    document.getElementById("result").innerHTML = `
        <h2>Score: ${data.score}</h2>

        <h3>Evidence:</h3>

        <ul>
            ${data.evidence
                .map(item => `<li>${item}</li>`)
                .join("")}
        </ul>
    `;
});
