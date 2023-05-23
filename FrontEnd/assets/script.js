const url = 'http://localhost:5678/api/'

// Import token when logged in
let token = window.localStorage.getItem('token')

// Access to API depending on types and methods
async function fetchData(type, method, bodyObject) {

    const options = {
        method: method,
        headers: {
        'Accept': 'application/json'
        },
        body: bodyObject
    }

    // Change the headers depending on the method of the API
    if (method === 'DELETE' || method === 'POST') { options.headers['Authorization'] = `Bearer ${token}`}

    const response = await fetch(url + type, options);
    if (response.ok === true){
        if (method === 'GET') {
            const data = await response.json()
            return data
        } else {
            return response
        }
    } else {
        alert("Impossible de communiquer avec l'API")
    }
}

// Access to API /works
async function loadWorks() {
    return await fetchData('works', 'GET')
}
// Access to API /categories
async function loadCateg() {
    return await fetchData('categories', 'GET')
}

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

        // Create <div> containing modal gallery buttons
        const modalGalleryBtn = document.createElement("div")
        modalGalleryBtn.classList.add('js-modal-gallery-btn')

        if (type === 'gallery') {
            projectName.innerText = work.title
            projectFigure.appendChild(projectName)

            // Create <figure> child element into the gallery section
            galleryDiv.appendChild(projectFigure)
        }

        if (type === 'modal') {
            projectName.innerText = 'editer'
            projectFigure.appendChild(projectName)

            // Create delete button in modal ONLY
            const deleteBtn = document.createElement("button")
            deleteBtn.classList.add('delete-btn')
            const deleteIcon = document.createElement("i")
            deleteIcon.classList.add('fa-solid', 'fa-trash-can')
            deleteBtn.appendChild(deleteIcon)
            deleteBtn.addEventListener('click', async (e) => {
                const workId = work.id
                fetchData(`works/${workId}`, 'DELETE')
                projectFigure.remove()
                closeModal(e)
                await initializeGallery()
            })
            modalGalleryBtn.appendChild(deleteBtn)
            projectFigure.appendChild(modalGalleryBtn)

            // Create <figure> child element into the modal section
            modalGallery.appendChild(projectFigure)
        }
    }

    // Create move button in modal and FIRST image ONLY
    if (type === 'modal') {
        const modalGalleryElem = document.querySelectorAll('#js-modal-gallery figure')
        const modalGalleryArr = Array.from(modalGalleryElem)
        
        const moveBtn = document.createElement("button")
        moveBtn.classList.add('move-btn')
        const moveIcon = document.createElement("i")
        moveIcon.classList.add('fa-solid', 'fa-up-down-left-right')
        moveBtn.appendChild(moveIcon)
        moveBtn.addEventListener('click', () => {
            alert('Fonctionnalité non disponible pour le moment')
        })
        modalGalleryArr[0].querySelector('.js-modal-gallery-btn').appendChild(moveBtn)
    }
}

async function initializeGallery(){
    let works = await loadWorks()
    createGallery(works, 'gallery')
}

// Create filters for projects
async function createFilters() {
    let categories = await loadCateg()

    const filtersList = document.querySelector(".filters-list")

    // Create the "all" filter button first
    let filterBtn = document.createElement("li")
    filterBtn.classList.add("filter-btn", "active-btn")
    filterBtn.setAttribute('id', 'all-filters')
    filterBtn.innerText = 'Tous'
    filtersList.appendChild(filterBtn)
    filterBtn.addEventListener("click", filterEvent)

    // Looping array to create the remaining filters
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

// Function on click for filters
async function filterEvent(e) {
    let works = await loadWorks()
    const filterId = await e.target.getAttribute('id')
    const categoriesFilter = Array.from(document.querySelectorAll('.filters-list li'))

    for (let categoryFilter of categoriesFilter) {
        const categoryId = categoryFilter.getAttribute('id')
        if (filterId == categoryId) {
            categoryFilter.classList.add('active-btn')
        } else {
            categoryFilter.classList.remove('active-btn')
        }
    }

    // Return filtered array on click, return entire works if "all" filter is clicked
    if (filterId != 'all-filters') {
        const filteredWorks = await works.filter(work => work.categoryId == filterId)
        createGallery(filteredWorks, 'gallery')
    } else {
        createGallery(works, 'gallery')
    }
}

// Function to get the categories in Modal form
async function getCategoriesSelect(){
    let categories = await loadCateg()
    const categorySelect = document.getElementById('work-category')

    for (let category of categories) {
        const categoryOption = document.createElement('option')
        categoryOption.value = category.id
        categoryOption.id = category.id
        categoryOption.innerText = category.name
        categorySelect.appendChild(categoryOption)
    }
}

// Switch modal div
const submitBtn = document.getElementById('submit-btn')
submitBtn.addEventListener('click', () => {
    const modalEditMode = document.getElementById('js-modal-edit')
    const modalSubmitMode = document.getElementById('js-modal-form')
    modalEditMode.classList.add('hidden')
    modalSubmitMode.classList.add('visible')

    // Submit work function, Fetch POST
    const submitForm = document.getElementById('submit-form')
    submitForm.addEventListener('submit', submitWork)
})

// Submit work function, Fetch POST
async function submitWork(e) {
    e.preventDefault()

    const formFile = document.getElementById('work-file')
    const formTitle = document.getElementById('work-title').value
    const formCat = document.getElementById('work-category').value
    const intCat = parseInt(formCat)

    // Checking if all inputs are defined
    if (!formFile || !formTitle || !formCat) {
        alert('Veuillez renseigner tous les champs')
    } else {
        // Create FormData object with input values
        const formData = new FormData()
        formData.append('image', formFile.files[0])
        formData.append('title', formTitle)
        formData.append('category', formCat)

        await fetchData('works', 'POST', formData)

        // Closes modal and refreshing gallery
        closeModal(e)
        await initializeGallery()
    }
}

// Displays edit mode and all hidden elements if logged in / token exists
function adminView() {
    if (token != null) {
        displayAdmin()
        logOut()
    } 
}

// Function logout() when logged in
function logOut() {
    const logBtn = document.getElementById('log-btn')
    logBtn.innerText = 'logout'
    logBtn.addEventListener('click', (e) => {
        e.preventDefault()
        window.localStorage.removeItem('token')
        window.location.reload()
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
    await createGallery(works, 'modal')
}

const closeModal = function (e) {
    e.preventDefault()
    modalMain.classList.add('modal-hidden')
    modalMain.classList.remove('visible')
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

// Main function when the website is loading
async function initProject() {
    initializeGallery()
    createFilters()
    getCategoriesSelect()
    adminView()
}

window.onload = () => {
    initProject()
}