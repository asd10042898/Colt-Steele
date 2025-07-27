const form = document.querySelector('#shelterForm');
const input = document.querySelector('#catName');
const list = document.querySelector('#cats');

form.addEventListener('submit', function(e) {
    e.preventDefault(e)
    const newLi = document.createElement('li');
    newLi.append(`${input.value}`);
    list.append(newLi);
    input.value = '';
})