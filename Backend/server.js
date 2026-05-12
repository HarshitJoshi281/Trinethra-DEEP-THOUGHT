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
        console.log("Transcript:",transcript);

        // AI prompt
        const prompt = `You are an expert supervisor feedback analyzer.

Analyze the transcript using this rubric:

1-3:
Needs Attention
- no initiative
- disengaged
- directionless

4-6:
Productive Executor
- reliable
- completes assigned tasks
- consistent execution

7-10:
Problem Solver / Systems Builder
- identifies problems proactively
- builds systems/tools/processes
- improves business operations
- drives measurable impact

IMPORTANT:
Difference between 6 and 7:
6 = executes assigned work well
7 = independently identifies problems and creates solutions

Business KPIs:
- lead_generation
- lead_conversion
- upselling
- cross_selling
- nps
- pat
- tat
- quality

Return ONLY valid JSON.

Required format:

{
  "evidence": [
    {
      "quote": "text",
      "type": "positive/negative/neutral"
    }
  ],
  "rubricScore": number,
  "scoreJustification": "text",
  "kpiMapping": ["text"],
  "gapAnalysis": ["text"],
  "followUpQuestions": ["text"]
  Return STRICT valid JSON only.

Rules:
- No markdown
- No comments
- No explanations
- No broken words
- No trailing commas
- Ensure JSON.parse() can parse the output
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
                    model: "phi3",
                    prompt: prompt,
                    stream: false,
                     format: "json",
                     options: {
        num_predict: 400,
        temperature:0.2
    }

                })
            }
        );

        // convert response
        const data = await response.json();

        // AI raw response
        const aiText = data.response;

        console.log("AI RESPONSE:");
        console.log(aiText);

      let cleanedText = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\/\/.*$/gm, "")
    .trim();

     try {

    const analysis = JSON.parse(cleanedText);

    res.json(analysis);

} catch(parseError) {

    console.log("JSON Parse Error");

    console.log(parseError);

    res.json({
        error: "AI returned invalid JSON",
        rawResponse: cleanedText
    });
}

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