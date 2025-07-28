const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'))
app.use((req, res, next) => {
    console.log("This is my first middleware");
    next();
})
//123
app.use((req, res, next) => {
    console.log("This is my second middleware");
    next();
})


app.get('/', (req, res) => {
    res.send('HOME PAGE')
})

app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF')
})

app.listen(3000, () => {
    console.log('App is Running on localhost:3000')
})