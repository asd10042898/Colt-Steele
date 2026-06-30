const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("TESTING ROUTES")
})

router.get('/:id', (req, res) => {
    res.send("ONE TESTING ROUTE")
})

router.get('/:id/edit', (req, res) => {
    res.send("EDIT TESTING ROUTES")
})

router.post('/', (req, res) => {
    res.send("CREATING TESTING ROUTES")
})



module.exports = router;
