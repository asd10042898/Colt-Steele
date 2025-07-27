const express = require("express");
const app = express();

// app.use((req, res) => {
//     console.log("We've got a new request");
//     res.send("<h1>This is my webside</h1>")
// })

app.get("/", (req, res) => {
    res.send("Home Page")
})

app.get("/r/:subreddit", (req, res) => {
    const {subreddit} = req.params
    console.log(subreddit);
    res.send(`This is the ${subreddit} SUBREDDIT`);
})

app.get("/cats", (req, res) => {
    res.send("MEOW")
})

app.get("/cats", (req, res) => {
    res.send("WOOF!!!")
})

app.get("/search", (req, res) => {
    const { q } = req.query;
    res.send(`You're searching: ${q}`);
})

app.get("*", (req, res) => {
    res.send("I don't know that path")
})

app.listen(3000, () => {
    console.log("Listening On PORT 3000!")
})