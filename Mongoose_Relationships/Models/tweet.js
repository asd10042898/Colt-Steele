const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/relationshipsDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Mongo connection open');
    })
    .catch(err => {
        confsole.log('Mongo connection error');
        console.log(err);
    })


const userSchema = new Schema({
    username: String,
    age: Number
})

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User'}
})

const User = model('User', userSchema);
const Tweet = model('Tweet', tweetSchema);


// const makeTweets = async() => {
//     // const user = new User({ username: 'chickenFace', age: 5 });
//     const user = await User.findOne({ username: 'chickenFace' });
//     const tweet2 = new Tweet({ text: 'I am another tweet', likes: 5 });
//     tweet2.user = user;
//     tweet2.save();
// }

// makeTweets();

const findTweet = async() => {
    const t = await Tweet.findOne({}).populate('user', 'username');
    console.log(t);
}

findTweet();