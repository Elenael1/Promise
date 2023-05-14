const { default: axios } = require("axios");
const { debounce } = require("debounce");
import Notiflix from "notiflix"

const URL = "https://jsonplaceholder.typicode.com";
const resources = "/photos"

const refs = {
    posts: document.querySelector('.posts'),
    q: document.querySelector('.q'),
    loadMore: document.querySelector('.button')
};

let dataLimit = 10;
let page = 1;

async function getData(q = 'car', page = 1, limit = 10) {
    const responce = await axios.get(
        `${URL}${resources}?q = ${q}&_page=${page}&_limit=${limit}`
    );
    const data = await responce.data;
    return data;
}

async function postMarkup(data) {
    // const data = await getData();
    const markUp = data.map(({ url }) => {
        return `<img src="${url}"/>`;
    }).join(" ");
    refs.posts.insertAdjacentHTML("beforeend", markUp)
}

window.addEventListener("load", onLoad)

async function onLoad(e) {
    const data = await getData();
    postMarkup(data);
}

refs.loadMore.addEventListener('click', onClick)

async function onClick(e) {
    const pageLimit = 110 / dataLimit;
    page += 1;

    if (page <= pageLimit) {
        refs.loadMore.style.display = 'block';
        const data = await getData(page);
        postMarkup(data);
    } else {
        refs.loadMore.style.display = 'none';
    }

}

refs.q.addEventListener("input", debounce(onInput, 300))

async function onInput(e) {
    const value = e.target.value.trim();
    console.log('value', value);
    if (!value) {
        Notiflix.Notify.info("Enter text")
    }
    const data = getData(value);
    postMarkup(data)
}

// FETCH 

// async function getData() {
//     const responce = await fetch(
//         `${URL}${resources}?_page=1&_limit=20`
//     );
//     console.log(await responce.json());
// }
// getData();