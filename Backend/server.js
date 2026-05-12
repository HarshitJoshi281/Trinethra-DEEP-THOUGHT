const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
    const transcript = req.body.transcript;

    console.log("Transcript:", transcript);

    // later AI response will come here
    const analysis = {
        score: 7,
        evidence: [
            "Very proactive",
            "Communication needs improvement"
        ]
    };

    res.json(analysis);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});