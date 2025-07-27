const newJokes = document.querySelector('#jokes')
const button = document.querySelector('button')


const addNewJokes = async () => {
    const jokeText = await getDadJoke();
    const newLi = document.createElement('li');
    newLi.append(jokeText);
    newJokes.append(newLi);
}

const getDadJoke = async () => {
    try {
        const config = { headers: { Accept: 'application/json' } };
        const res = await axios.get('https://icanhazdadjoke.com/', config);
        return res.data.joke;
    } catch (e) {
        return "There's no jokes!"
    }
    
}

button.addEventListener('click', addNewJokes)

