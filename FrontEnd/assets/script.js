const url = 'http://localhost:5678/api/'
let isLoggedIn 

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

        // Create <div> containing modal gallery buttons
        const modalGalleryBtn = document.createElement("div")
        modalGalleryBtn.classList.add('js-modal-gallery-btn')

        projectName.innerText = work.title
        projectFigure.appendChild(projectName)

        // Create <figure> child element into the gallery section
        galleryDiv.appendChild(projectFigure)
    }
}

async function createGalleryModal(arr) {
    let works = await arr

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

    // Create move button in modal and FIRST image ONLY
        const modalGalleryElem = document.querySelectorAll('#js-modal-gallery figure')
        const modalGalleryArr = Array.from(modalGalleryElem)
        
        const moveBtn = document.createElement("button")
        moveBtn.classList.add('move-btn')
        const moveIcon = document.createElement("i")
        moveIcon.classList.add('fa-solid', 'fa-up-down-left-right')
        moveBtn.appendChild(moveIcon)
        moveBtn.addEventListener('click', () => {
            alert('Fonctionnalité indisponible pour le moment')
        })
        modalGalleryArr[0].querySelector('.js-modal-gallery-btn').appendChild(moveBtn)
}

async function initializeGallery(){
    let works = await loadWorks()
    createGallery(works)
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
    if (isLoggedIn) {
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
        createGallery(filteredWorks)
    } else {
        createGallery(works)
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

// Validation input
let isValidImg = false
let isImg = false
let isTitle = false
let isCategory = false

const formInputValidate = () => {
    const addWorkbtn = document.getElementById('add-work-btn')
    if (isValidImg && isTitle && isCategory){
        addWorkbtn.disabled = false
        addWorkbtn.classList.remove('disabled-btn')
    } else {
        addWorkbtn.disabled = true
        addWorkbtn.classList.add('disabled-btn')
    }
}

// Modal submit work mode
const modalEditMode = () => {
    const modalEditModeDiv = document.getElementById('js-modal-edit')
    const modalSubmitMode = document.getElementById('js-modal-form')
    const backBtn = document.getElementById('js-modal-return')
    backBtn.style.visibility = 'visible'
    modalEditModeDiv.classList.add('hidden')
    modalSubmitMode.classList.add('visible')

    // Submit work function, Fetch POST
    const submitForm = document.getElementById('submit-form')
    submitForm.addEventListener('submit', submitWork)
    const formFile = document.getElementById('work-file')

    formFile.addEventListener('change', () => {
        const filePreviewContainer = document.querySelector('.file-upload-preview')
        const fileUploadForm = document.querySelector('.file-upload-form')
        const previewImg = document.createElement('img')
        const fileMaxSize = 4000000

        // Testing if the uploaded file is bigger than 4MB
        if (formFile.files[0].size > fileMaxSize) {
            alert('Le fichier importé est trop volumineux.')
        } else {
            isValidImg = true
            previewImg.src = URL.createObjectURL(formFile.files[0])
            filePreviewContainer.appendChild(previewImg)
            fileUploadForm.style.display = 'none'
        }
        formInputValidate()
    })

    const formTitle = document.getElementById('work-title') 
    formTitle.addEventListener('input', (e) => {
        const value = e.target.value
        if (isValue(e)) {
            isTitle = true
        } else {
            isTitle = false
        }
        formInputValidate()
    })

    const categorySelect = document.getElementById('work-category')
    categorySelect.addEventListener('change', (e) => {
        if (isValue(e)) {
            isCategory = true
        } else {
            isCategory = false
        }
        formInputValidate()
    })
}

// Checking whether there is a value or not in the input fields
const isValue = (e) => {
    const value = e.target.value
    if (value === "") {
        return false
    } else {
        return true
    }
}

// Switch modal gallery to modal submit
const submitBtn = document.getElementById('submit-btn')
submitBtn.addEventListener('click', modalEditMode)

// Submit work function, Fetch POST
async function submitWork(e) {
    e.preventDefault()
    const formFile = document.getElementById('work-file')
    const formTitle = document.getElementById('work-title').value
    const formCat = document.getElementById('work-category').value
    const errorFeedback = document.getElementById('error-feedback')

    // Checking if all inputs are defined
    if (!formFile.files[0] || !formTitle || !formCat) {
        errorFeedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>Veuillez renseigner tous les champs du formulaire.'
    } else {
        // Create FormData object with input values
        const formData = new FormData()
        formData.append('image', formFile.files[0])
        formData.append('title', formTitle)
        formData.append('category', parseInt(formCat))

        await fetchData('works', 'POST', formData)

        // Closes modal, switch modal gallery and refreshing gallery
        closeModal(e)
        switchModeBack()
        await initializeGallery()
    }
}

function switchModeBack() {
    const modalEditModeDiv = document.getElementById('js-modal-edit')
    const modalSubmitMode = document.getElementById('js-modal-form')
    const backBtn = document.getElementById('js-modal-return')
    backBtn.style.visibility = 'hidden'
    modalSubmitMode.classList.add('hidden')
    modalSubmitMode.classList.remove('visible')
    modalEditModeDiv.classList.remove('hidden')
}

// Check if user is logged in (if token exists)
const checkLogIn = () => {
    if (token != null) {
        isLoggedIn = true
        adminView()
    } else {
        isLoggedIn = false
    }
}

// Displays edit mode if user is logged in
function adminView() {
    if (isLoggedIn) {
        displayAdminElem()
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
function displayAdminElem(){
    document.querySelectorAll('.hidden').forEach((element) => {
        element.classList.remove('hidden')
    })
    document.querySelector('header').style.marginTop='100px'
}

// Modal functions
const editBtn = document.querySelectorAll('.edit-btn')
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
    await createGalleryModal(works)
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

// Call openModal() function when edit buttons are clicked or back button
for (editBtnSingle of editBtn) {
    editBtnSingle.addEventListener('click', openModal)
}

const backBtn = document.getElementById('js-modal-return')
backBtn.addEventListener('click', switchModeBack)

// Call closeModal() function when close button or modal wrapper are clicked
modalClose.addEventListener('click', closeModal)
modalMain.addEventListener('click', closeModal)

// Main function when the website is loading
async function initProject() {
    initializeGallery()
    createFilters()
    getCategoriesSelect()
    checkLogIn()
}

window.addEventListener('load', initProject)