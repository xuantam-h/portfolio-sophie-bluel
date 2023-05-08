const url = 'http://localhost:5678/api/'

// Access to API depending on types
async function fetchData(type) {
    const response = await fetch(url + type);
    if (response.ok === true){
        const data = await response.json();
        return data;
    } else {
        alert("Impossible de communiquer avec l'API")
    }
}

// Access to API /works
async function loadWorks() {
    return await fetchData('works')
}
// Access to API /categories
async function loadCateg() {
    return await fetchData('categories')
}

let gallery

// Function to create projects gallery
async function createGallery(arr, type) {
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

        if (type === 'gallery') {
            // Create <figure> child element into the gallery section
            galleryDiv.appendChild(projectFigure)
        }

        if (type === 'modal') {
            const modalGallery = document.getElementById('js-modal-gallery')
            // Create <figure> child element into the modal section
            modalGallery.appendChild(projectFigure)
        }
    }
}

async function initializeGallery(){
    let works = await loadWorks()
    createGallery(works, 'gallery')
}

initializeGallery()

// Create filters for projects
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
    createGallery(filteredWorks, 'gallery')
}

function createElem(el, container){
    const newElem = document.createElement(el)
    const containerDiv = document.querySelector(container)
    containerDiv.appendChild(newElem)
}

// Import token when logged in
let token = window.localStorage.getItem('token')

// Displays edit mode and all hidden elements if logged in / token exists
if (token != null) {
    displayAdmin()
    logOut()
} 

// Function logout() when logged in
function logOut() {
    const logBtn = document.getElementById('log-btn')
    logBtn.innerText = 'logout'
    logBtn.addEventListener('click', () => {
        window.localStorage.removeItem('token')
        token = ""
        location.href = 'login.html'
    })
}

// Function to display hidden elements when logged in
function displayAdmin(){
    document.querySelectorAll('.hidden').forEach((element) => {
        element.classList.remove('hidden')
    })
}

// Modal functions
const editBtn = document.getElementById('edit-btn')
const modalMain = document.getElementById('js-modal')
const modalClose = document.getElementById('js-modal-close')

const openModal = function (e) {
    e.preventDefault()
    modalMain.classList.remove('modal-hidden')
    modalMain.setAttribute('aria-hidden','false')
    modalMain.setAttribute('aria-modal','true')
    modalMain.classList.add('visible')
    modalMain.addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    e.preventDefault()
    modalMain.classList.add('modal-hidden')
    modalMain.setAttribute('aria-hidden','true')
    modalMain.removeAttribute('aria-modal')
    modalMain.removeEventListener('click', stopPropagation)
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

// Call openModal() function when edit button is clicked
editBtn.addEventListener('click', openModal)

// Call closeModal() function when close button or modal wrapper are clicked
modalClose.addEventListener('click', closeModal)
modalMain.addEventListener('click', closeModal)
