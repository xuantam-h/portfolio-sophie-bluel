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
async function createGallery(arr) {
    let works = await arr

    const galleryDiv = document.querySelector(".gallery");
    galleryDiv.innerHTML = ""

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
async function initializeGallery(){
    let works = await loadWorks()
    createGallery(works)
}

initializeGallery()

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
    e.target.classList.toggle('active-btn')
    const filteredWorks = await works.filter(work => work.categoryId == filterId)
    createGallery(filteredWorks)
}

function createElem(el, container){
    const newElem = document.createElement(el)
    const containerDiv = document.querySelector(container)
    containerDiv.appendChild(newElem)
}

// Edit bar only visible if logged
const editBar = document.getElementById('edit-bar')
const token = window.localStorage.getItem('token')

// Displays edit mode and all hidden elemnts if logged in / token exists
if (token != null) {
    document.querySelectorAll('.hidden').forEach((element) => {
        element.classList.remove('hidden')
    })
} 

// Modal

const editBtn = document.getElementById('edit-btn')
const modalMain = document.getElementById('js-modal')
const modalClose = document.getElementById('js-modal-close')
let modal = null

const enableEdit = function () {

}

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal','true')
    modal = target
    modal.addEventListener('click', closeModal)
}

const closeModal = function (e) {
    e.preventDefault()
}

// Call openModal() function when button is clicked
modalBtn.addEventListener('click', () => {
    modalMain.classList.remove('hidden')
    modalMain.classList.add('visible')
})

// Call closeModal() function when close button is clicked
modalClose.addEventListener('click', () => {
    modalMain.classList.remove('visible')
    modalMain.classList.add('hidden')
})

