const fakeRequest = (url) => {
    return new Promise((resolve, reject) => {
        const rand = Math.random();
        setTimeout(() => {
            if (rand > 0.7) {
                resolve('Your Fake Data Here');
            }
            reject('Request Error');
        }, 3000)
    })
}

fakeRequest('/dogs/1')
    .then((data) => {
        console.log('Done the Request')
        console.log('data is:', data)
    })
    .catch((err) => {
        console.log("Oh NO", err)
    })