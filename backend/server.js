require("dotenv").config();

const express = require("express");
const supabase = require("./src/config/supabase");

const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Cryptocode Backend Running");
});

app.get("/profiles", async(req, res) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*");

    if (error) return res.status(500).json(error);

    res.json(data);
});

// routes connect
app.use("/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});