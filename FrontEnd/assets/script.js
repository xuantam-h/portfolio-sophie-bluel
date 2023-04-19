const galleryDiv = document.querySelector(".gallery");

fetch('http://localhost:5678/api/works')
    .then(reponse => reponse.json())
    .then(outputData => {

        // Loop the array and create <figure> for each element
        for (let i = 0; i < outputData.length; i++){
            const projectFigure = document.createElement("figure")
            const projectImg = document.createElement("img")

            // Create <img> element
            projectImg.src = outputData[i].imageUrl
            projectImg.alt = outputData[i].title
            projectFigure.appendChild(projectImg)

            // Create <figcaption> element
            const projectName = document.createElement("figcaption")
            projectName.innerText = outputData[i].title
            projectFigure.appendChild(projectName)

            // Create <figure> child element into the gallery
            galleryDiv.appendChild(projectFigure)
        }
    })