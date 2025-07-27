const franc = require("franc");
const langs = require("langs");
const colors = require("colors");

const input = process.argv[2]
const lang = franc(input)

if (lang === 'und') {
    console.log("Sorry, we can't find the language! Please try again!".red)
} else {
    // 'Alle menslike wesens word vry'
    // 'Alle menneske er fødde til fridom'
    const langName = langs.where("3", lang).name
    console.log(`The most possibe language is:`.blue, langName.green)
}

