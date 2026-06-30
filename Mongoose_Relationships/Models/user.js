const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/relationshipsDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Mongo connection open');
    }).catch(err => {
        console.log('Mongo connection error');
        console.log(err)
    })

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: false,
            street: String,
            city: String,
            state: String,
            country: String
        }
    ]
})

const User = mongoose.model('User', userSchema)

const makeUser = async() => {
    const u = new User({
        first: 'Harry4',
        last: 'Potter'
    })
    u.addresses.push({
        street: '123 Sesame St.',
        city: 'New York',
        state: 'NY'
    })
    const res = await u.save();
    console.log(res);
}

makeUser();

// const mongoose = require('mongoose');


// mongoose.connect('mongodb://127.0.0.1:27017/relationshipsDemo', {useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => {
//         console.log('Mongo connection open');
//     })
//     .catch(err => {
//         console.log('Mongo connection error');
//         console.log(err);
//     })


// const userSchema = new mongoose.Schema({
//     first: String,
//     last: String,
//     addresses: [
//         {
//             _id: false,
//             street: String,
//             city:String,
//             state: String,
//             country: String
//         }
//     ]
// })

// const User = mongoose.model('User', userSchema);

// const makeUser = async() => {
//     const u = new User({
//         first: 'Harry2',
//         last: 'Potter'
//     })
//     u.addresses.push({
//         street: '123 Sesame St.',
//         city: 'New York',
//         state: 'NY',
//         country: 'USA'
//     })
//     const res = await u.save();
//     console.log(res);
// }

// makeUser();