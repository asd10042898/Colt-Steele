const btn = document.querySelector('button');
const randomRGB = document.querySelector('h1');

btn.addEventListener('click', () => {
    const newColor = radomColor()
    total = newColor.total;
    document.body.style.backgroundColor = newColor.color;
    randomRGB.innerText = `${newColor.color}`;
    if(total <= 200) {
        randomRGB.style.color = 'white';
    }
})

const radomColor = function () {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return {
        color: `rgb(${r}, ${g}, ${b})`,
        total: r+g+b
    }
}