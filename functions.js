/**
 * get works from database and save them in localStorage
 */
export function getWorks () {
    //récupération des works via l'API
    fetch('http://localhost:5678/api/works')
    .then (r => r.json())
    .then (works => {
        window.localStorage.setItem("works", JSON.stringify(works))
        console.log(works)
        displayWorks(works)
        displayThumbnails(works)
    })
    .catch (e => console.log(e))
}

/**
 * Diplaying works in gallery
 * @param {JSONobject} works 
 */
export function displayWorks(works) {
    // récupération de l'élement du dom qui acceuille les travaux
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""
    //boucle pour parcourir les travaux
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // Création du modèle galleryItem
    const galleryItem = document.createElement("figure");
    const img = document.createElement('img');
    let imgUrl = works[i].imageUrl.split("/");
    imgUrl = imgUrl[imgUrl.length -1].replace(/[0-9]/g, "");
    galleryItem.innerHTML = `
        <img src="${works[i].imageUrl}" alt="${works[i].title}" crossorigin="same-origin">
        <figcaption>${works[i].title}</figcaption>`;
    gallery.appendChild(galleryItem);
    }
}
/**
 * Displaying works in modal3-1 window
 * @param {JSONobject} works 
 */
export function displayThumbnails(works) {
    const gallery = document.querySelector(".thumbnail-gallery-container")
    gallery.innerHTML = ""
    //boucle pour parcourir les travaux
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // récupération de l'élement du dom qui acceuille les travaux
    
    // Création du modèle galleryItem
    const galleryItem = document.createElement("figure");
    const img = document.createElement('img');
    //Création de l'url de l'image dans le dossier courant à partir de l'url fournie par l'API
    //Attention procéder directement avec l'image fournie par la backend engendre des problèmes de sécurité signalés en console !
    let imgUrl = works[i].imageUrl.split("/");
    imgUrl = imgUrl[imgUrl.length -1].replace(/[0-9]/g, "");
    // Methode 2 beaucoup plus rapide ...
    galleryItem.innerHTML = 
        `<img src="${works[i].imageUrl}" alt="${works[i].title}" crossorigin="same-origin">
        <div id="enlarge" class="enlarge">
            <img src="assets/icons/enlarge.svg">
        </div>
        <div id="${works[i].id}" class="trashbin">
            <img src="assets/icons/trashbin.svg">
        </div>
        <figcaption>Éditer</figcaption>`;
    gallery.appendChild(galleryItem);
    const trash = galleryItem.querySelector(".trashbin")
    trash.addEventListener("click", function(e){
        const id = trash.getAttribute("id")
        deleteEntry(id)
    })
    }
}

export function deleteEntry(id) {
    const bearerAuth = JSON.parse(window.localStorage.getItem("bearerAuth"))
    console.log(id)
    fetch('http://localhost:5678/api/works/'+id, {
        method: "DELETE",
        headers: {
            "accept": "*/*",
            "Authorization": "Bearer "+bearerAuth.token               
        }   
    })
    .then ((r) => {
        if (r.ok) { 
            getWorks()
        } else {
            throw new Error("Something went wrong")
        }
    })
    .catch((e) => console.log(e)) 
}



    