const express = require('express');
const app = express();
const shelterRoutes = require('./routes/shelters');
const dogRoutes = require('./routes/dogs');
const adminRoutes = require('./routes/admin');
const testRoutes = require('./routes/testRoutes');



app.use('/shelters', shelterRoutes);
app.use('/dogs', dogRoutes);
app.use('/admin', adminRoutes)
app.use('/tests', testRoutes);

app.listen(3000, () => {
    console.log('Serving app on localhost:3000')
})
