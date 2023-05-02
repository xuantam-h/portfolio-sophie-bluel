const url = 'http://localhost:5678/api/'

// Access to API depending on types
async function fetchData(type) {
    const response = await fetch(url + type);
    const data = await response.json();
    return data;
}
// Access to API /works
async function loadWorks() {
    return await fetchData('works')
}
// Access to API /categories
async function loadCateg() {
    return await fetchData('categories')
}

const galleryDiv = document.querySelector(".gallery");

async function createGallery(arr) {

    let works = await loadWorks()

    // Loop the array and create <figure> for each element
    for (const work of works){
        const projectFigure = document.createElement("figure")
        const projectImg = document.createElement("img")

        // Create <img> element and fill the attributes src, alt
        projectImg.src = work.imageUrl
        projectImg.alt = work.title
        projectFigure.appendChild(projectImg)

        // Create <figcaption> element and fill the element
        const projectName = document.createElement("figcaption")
        projectName.innerText = work.title
        projectFigure.appendChild(projectName)

        // Create <figure> child element into the gallery section
        galleryDiv.appendChild(projectFigure)
    }
}

createGallery()

async function createFilters() {
    let categories = await loadCateg()

    const filtersList = document.querySelector(".filters-list")

    for (const category of categories){
        let filterBtn = document.createElement("li")
        filterBtn.classList.add("filter-btn")
        filterBtn.innerText = category.name
        filterBtn.setAttribute('id', category.id)
        filterBtn.addEventListener("click", filterEvent)
        filtersList.appendChild(filterBtn)
    }
}

createFilters()

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