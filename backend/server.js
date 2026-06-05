require("dotenv").config();

const express = require("express");
const supabase = require("./src/config/supabase");

const app = express();

app.get("/", (req, res) => {
    res.send("Cryptocode Backend Running");
});

app.get("/profiles", async(req, res) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});