const subredditData = require("./data.json");
const express = require('express');
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, '/public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))



app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = subredditData[subreddit];
    res.render('subreddit.ejs', {subreddit, ...data});
})

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render("random.ejs", { rand : num});
})

app.get('/cats', (req, res) => {
    const cats = [
        "cat1", "cat2", "cat3"
    ];
    res.render("cats.ejs", { cats });
})

app.get('*', (req, res) => {
    res.render('notfound.ejs',);
})




app.listen(3000, () => {
    console.log("Listening to the 3000");
})








