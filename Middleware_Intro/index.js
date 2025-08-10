const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'))

app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
})

app.use('/dogs', (req, res, next) => {
    console.log('I Love Dogs');
    next();
})

const VerifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'nice') {
        next();
    }
    res.send('SORRY YOU NEED A PASSWORD');
}

// app.use((req, res, next) => {
//     console.log("This is my first middleware");
//     return next();
// })

// app.use((req, res, next) => {
//     console.log("This is my second middleware");
//     next();
// })


app.get('/', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('HOME PAGE')
})

app.get('/dogs', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('WOOF WOOF')
})

app.get('/secret', VerifyPassword, (req, res) => {
    res.send('THIS IS THE SECRET PAGE')
})


app.use((req, res) => {
    res.status(404).send("NOT FOUND!!!")
})

app.listen(3000, () => {
    console.log('App is Running on localhost:3000')
})