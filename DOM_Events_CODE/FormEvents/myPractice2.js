const form = document.querySelector('#tweetForm');
const input = document.querySelectorAll('input');
const list = document.querySelector('#tweets');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const newTweet = document.createElement('li');
    const bold = document.createElement('b');
    newTweet.append(bold, ` - ${input[1].value}`);
    bold.append(`${input[0].value}`);
    list.append(newTweet);
    input[0].value = '';
    input[1].value = '';
})