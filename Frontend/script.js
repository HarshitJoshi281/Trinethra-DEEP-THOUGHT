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
    if (data.error) {

    document.getElementById("result").innerHTML = `
        <h2>AI Error</h2>
        <pre>${data.rawResponse}</pre>
    `;

    return;
}

    document.getElementById("result").innerHTML = `
        <h2>Score: ${data.rubricScore}</h2>

        <h3>Justification:</h3>
        <p>${data.scoreJustification}</p>

        <h3>Evidence:</h3>

        <ul>
            ${data.evidence
                .map(item => `
                    <li>
                        "${item.quote}" - 
                        <b>${item.type}</b>
                    </li>
                `)
                .join("")}
        </ul>

        <h3>KPI Mapping:</h3>

        <ul>
            ${data.kpiMapping
                .map(kpi => `<li>${kpi}</li>`)
                .join("")}
        </ul>

        <h3>Gap Analysis:</h3>

        <ul>
            ${data.gapAnalysis
                .map(gap => `<li>${gap}</li>`)
                .join("")}
        </ul>

        <h3>Follow-up Questions:</h3>

        <ul>
            ${data.followUpQuestions
                .map(question => `<li>${question}</li>`)
                .join("")}
        </ul>
    `;
});
