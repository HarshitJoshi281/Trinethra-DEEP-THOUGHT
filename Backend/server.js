const express = require("express");
const cors = require("cors");

const app = express();

const rubricData = require("./rubric.json");

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {

    try {

        const transcript = req.body.transcript;

        // validation
        if (!transcript) {
            return res.status(400).json({
                error: "Transcript is required"
            });
        }

        // AI prompt
        const prompt = `
You are an expert supervisor feedback analyzer.

Use the following rubric and KPI definitions
to analyze the transcript.

RUBRIC:
${JSON.stringify(rubricData.rubric)}

ASSESSMENT DIMENSIONS:
${JSON.stringify(rubricData.assessmentDimensions)}

KPI DEFINITIONS:
${JSON.stringify(rubricData.kpis)}

Analyze the transcript and return ONLY valid JSON.

IMPORTANT:
- Do not return markdown
- Do not write explanations
- Do not add extra text
- Return only pure JSON

Required JSON structure:

{
  "evidence": [
    {
      "quote": "text",
      "type": "positive/negative/neutral"
    }
  ],

  "rubricScore": number,

  "scoreJustification": "text",

  "kpiMapping": [
    "text"
  ],

  "gapAnalysis": [
    "text"
  ],

  "followUpQuestions": [
    "text"
  ]
}

Transcript:
${transcript}
`;

        // request to Ollama
        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "llama3.2",
                    prompt: prompt,
                    stream: false
                })
            }
        );

        // convert response
        const data = await response.json();

        // AI raw response
        const aiText = data.response;

        console.log("AI RESPONSE:");
        console.log(aiText);

        // parse JSON safely
        const analysis = JSON.parse(aiText);

        // send to frontend
        res.json(analysis);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to analyze transcript"
        });
    }

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});