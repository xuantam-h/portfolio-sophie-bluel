const url = 'http://localhost:5678/api/'

// Access to API depending on types
async function fetchData(type) {
    const response = await fetch(url + type);
    const data = await response.json();
    return data;
}

async function loadWorks() {
    return await fetchData('works')
}

async function loadCateg() {
    return await fetchData('categories')
}

const galleryDiv = document.querySelector(".gallery");

async function createGallery(arr) {

    let works = await loadWorks()

    // Loop the array and create <figure> for each element
    for (let i = 0; i < works.length; i++){
        const projectFigure = document.createElement("figure")
        const projectImg = document.createElement("img")

        // Create <img> element and fill the attributes src, alt
        projectImg.src = works[i].imageUrl
        projectImg.alt = works[i].title
        projectFigure.appendChild(projectImg)

        // Create <figcaption> element and fill the element
        const projectName = document.createElement("figcaption")
        projectName.innerText = works[i].title
        projectFigure.appendChild(projectName)

        // Create <figure> child element into the gallery section
        galleryDiv.appendChild(projectFigure)
    }
}

createGallery()

// Access to API /categories
async function loadCateg() {
    const r = await fetch("http://localhost:5678/api/categories")
    if (r.ok === true){
        return r.json();
    }
    throw new Error("Impossible de contacter le serveur")
}

loadCateg().then(categories => {    

    const filtersList = document.querySelector(".filters-list")

    for (const category of categories){
        let filterBtn = document.createElement("li")
        filterBtn.classList.add("filter-btn")
        filterBtn.innerText = category.name
        filterBtn.setAttribute('id', category.id)
        filterBtn.addEventListener("click", filterEvent)
        filtersList.appendChild(filterBtn)
    }

})

async function filterEvent(e) {
    let works = await loadWorks()
    const filterId = await e.target.getAttribute('id')
    const filteredWorks = await works.filter(work => work.categoryId === filterId)
    console.log(filteredWorks)
}

function createElem(el, container){
    const newElem = document.createElement(el)
    const containerDiv = document.querySelector(container)
    containerDiv.appendChild(newElem)
}

/*
async function filterWorks() {
    .filter(work => work.categoryId === filterId)
}
*/