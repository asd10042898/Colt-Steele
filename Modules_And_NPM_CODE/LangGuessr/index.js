const franc = require("franc");
const langs = require("langs");
const colors = require("colors");

const input = process.argv[2];
const langCode = franc(input);
const e = "Sorry, we can't find out, please try another one."

if (langCode === 'und') {
    console.log(e.red)
} else {
    const langName = langs.where("3", langCode);
    console.log(langName.name);
}



// 'Alle menslike wesens word vry'
// 'এটি একটি ভাষা একক IBM স্ক্রিপ্ট'