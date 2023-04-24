const galleryDiv = document.querySelector(".gallery");

// Access to API /works
async function fetchWorks() {
    const r = await fetch("http://localhost:5678/api/works")
    if (r.ok === true){
        return r.json();
    }
    throw new Error("Impossible de contacter le serveur")
}

fetchWorks().then(works => {

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

    const filteredWorks = works.filter(work => work.categoryId > 2)
})

// Access to API /categories
async function fetchCateg() {
    const r = await fetch("http://localhost:5678/api/categories")
    if (r.ok === true){
        return r.json();
    }
    throw new Error("Impossible de contacter le serveur")
}

fetchCateg().then(categories => {

    const filtersList = document.querySelector(".filters-list")

    for (const category of categories){
        let filterBtn = document.createElement("li")
        filterBtn.classList.add("filter-btn")
        filterBtn.innerText = category.name
        filtersList.appendChild(filterBtn)
    }
})


const filters = document.querySelectorAll(".filter-btn")
filters.forEach(function(){
    this.addEventListener("click", () =>{
        console.log("Hey")
    })
})
