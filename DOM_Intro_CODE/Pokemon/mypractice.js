//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png
const container = document.querySelector('#container');
const baseURL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"

for (let i = 1; i <= 151; i++) {
    
    const pokemon = document.createElement('div');
    pokemon.classList.add('pokemon');
    const num = document.createElement('span');
    num.innerText = `#${i}`;
    const img = document.createElement('img');
    img.src = `${baseURL}${i}.png`;
    

    container.appendChild(pokemon)
    pokemon.appendChild(img)
    pokemon.appendChild(num)
}

