const galleryDiv = document.querySelector(".gallery");

// Access to API /works
fetch('http://localhost:5678/api/works')
    .then(reponse => reponse.json())
    .then(outputData => {

        console.table(outputData)

        // Loop the array and create <figure> for each element
        for (let i = 0; i < outputData.length; i++){
            const projectFigure = document.createElement("figure")
            const projectImg = document.createElement("img")

            // Create <img> element and fill the attributes src, alt
            projectImg.src = outputData[i].imageUrl
            projectImg.alt = outputData[i].title
            projectFigure.appendChild(projectImg)

            // Create <figcaption> element and fill the element
            const projectName = document.createElement("figcaption")
            projectName.innerText = outputData[i].title
            projectFigure.appendChild(projectName)

            // Create <figure> child element into the gallery section
            galleryDiv.appendChild(projectFigure)
        }

    })

// Access to API /categories
fetch('http://localhost:5678/api/categories')
    .then(reponse => reponse.json())
    .then(outputCategData =>{

        const filtersList = document.querySelector(".filters-list")
        console.table(outputCategData)

        for (const category of outputCategData){
            let filterBtn = document.createElement("li")
            filterBtn.classList.add("filter-btn")
            filterBtn.innerText = category.name
            filtersList.appendChild(filterBtn)
        }
        /*
        const filters = document.querySelector(".filter-btn")
        filters.addEventListener("click", function() {
            console.log("Hey")
        })*/
    })