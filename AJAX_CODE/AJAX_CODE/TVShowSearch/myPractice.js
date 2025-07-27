const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const searchResult = form.elements.query.value;
    const config = {params : {q : searchResult}}
    const res = await axios.get(`http://api.tvmaze.com/search/shows`, config);
    searchIMG(res.data);
    form.elements.query.value = '';
})

const searchIMG = (shows) => {
    for (let result of shows) {
        if (result.show.image) {
            const div = document.createElement('div')
            const img = document.createElement('IMG')
            const p = document.createElement('p')
            document.body.append(div)
            div.append(p)
            div.append(img)
            img.src = result.show.image.medium
            p.innerText = result.show.name
        }
    } 
}