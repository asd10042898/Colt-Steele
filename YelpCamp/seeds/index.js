const mongoose = require('mongoose');
const Campground= require("../models/campground")
const {places, descriptors} = require("./seedHelpers")
const cities = require('./cities')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp-maptiler');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDb = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20 +10);
        const camp = new Campground({
            author: '6a06c3c3e634332ef637156e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    "url": "https://res.cloudinary.com/dhmhpswrm/image/upload/v1776688359/YelpCamp/mkeqq9tdsxp8xvnc0osq.jpg",
                    "filename": "YelpCamp/mkeqq9tdsxp8xvnc0osq"
                },
                {
                    "url": "https://res.cloudinary.com/dhmhpswrm/image/upload/v1776688359/YelpCamp/vuikjn2mlmnjobct1fzf.jpg",
                    "filename": "YelpCamp/vuikjn2mlmnjobct1fzf"
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quod.',
            price
        })
        await camp.save()
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})