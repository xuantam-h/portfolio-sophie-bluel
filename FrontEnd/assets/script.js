const url = 'http://localhost:5678/api/'

// Import token when logged in
let token = window.localStorage.getItem('token')

// Access to API depending on types and methods
async function fetchData(type, method) {

    const options = {
        method: method,
        headers: {'accept': 'application/json'}
    }

    // Change the headers depending on the method of the API
    if (method === 'DELETE' || method === 'POST') { options.headers['Authorization'] = `Bearer ${token}`}

    const response = await fetch(url + type, options);
    if (response.ok === true){
        const data = await response.json();
        console.log(data);
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
    const modalGallery = document.getElementById('js-modal-gallery')
    modalGallery.innerHTML = ""

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
            // Create delete button in modal ONLY
            const deleteBtn = document.createElement("button")
            deleteBtn.classList.add('delete-btn')
            const deleteIcon = document.createElement("i")
            deleteIcon.classList.add('fa-solid', 'fa-trash-can')
            deleteBtn.appendChild(deleteIcon)
            deleteBtn.addEventListener('click', () => {
                const workId = work.id
                fetchData(`works/${workId}`, 'DELETE')
            })
            projectFigure.appendChild(deleteBtn)

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

    // Won't be displayed in admin mode
    if (token != null) {
        filtersList.classList.add('hidden')
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
        location.href = 'login.html'
    })
}

// Function to display hidden elements when logged in
function displayAdmin(){
    document.querySelectorAll('.hidden').forEach((element) => {
        element.classList.remove('hidden')
    })
    document.querySelector('header').style.marginTop='100px'
}

// Modal functions
const editBtn = document.getElementById('edit-btn')
const modalMain = document.getElementById('js-modal')
const modalClose = document.getElementById('js-modal-close')

const openModal = async function (e) {
    e.preventDefault()
    modalMain.classList.remove('modal-hidden')
    modalMain.setAttribute('aria-hidden','false')
    modalMain.setAttribute('aria-modal','true')
    modalMain.classList.add('visible')
    document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    let works = await loadWorks()
    createGallery(works, 'modal')
}

const closeModal = function (e) {
    e.preventDefault()
    modalMain.classList.add('modal-hidden')
    modalMain.setAttribute('aria-hidden','true')
    modalMain.removeAttribute('aria-modal')
    modalMain.removeEventListener('click', stopPropagation)
    document.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

// Call openModal() function when edit button is clicked
editBtn.addEventListener('click', openModal)

// Call closeModal() function when close button or modal wrapper are clicked
modalClose.addEventListener('click', closeModal)
modalMain.addEventListener('click', closeModal)