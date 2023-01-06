/*import {} from "./functions.js"*/

let works = window.localStorage.getItem('works')

if (works === null) {
    //récupération des works via l'API
    const response = await fetch('http://localhost:5678/api/works')
    works = await response.json()
    // transformation des données en JSON
    const worksJSON = JSON.stringify(works);
    //stocke les datas dans le localstorage pour faciliter l'utilisation ultérieure
    window.localStorage.setItem("works", worksJSON)
} else {
    works = JSON.parse(works)
}

function displayWorks(works) {
    //boucle pour parcourir les travaux
    for (let i = 0; i < works.length; i++) {
    const work = works[i]
    // récupération de l'élement du dom qui acceuille les travaux
    const gallery = document.querySelector(".gallery")
    // Création du modèle galleryItem
    const galleryItem = document.createElement("figure")
    const img = document.createElement('img')
    //Création de l'url de l'image dans le dossier courant à partir de l'url fournie par l'API
    //Attention procéder directement avec l'image fournie par la backend engendre des problèmes de sécurité signalés en console !
    let imgUrl = works[i].imageUrl.split("/")
    imgUrl = imgUrl[imgUrl.length -1].replace(/[0-9]/g, "")
    // Methode 2 beaucoup plus rapide ...
    galleryItem.innerHTML = `
        <img src="assets/images/${imgUrl}" alt="${works[i].title}">
        <figcaption>${works[i].title}</figcaption>`

    /* Methode fonctionnelle 1 suggérée dans le cours
    // ajout des attributs de l'élément
    img.setAttribute("src", imgUrl)
    img.setAttribute("alt", works[i].title)
    // création sous-titre figcaption
    const figCaption = document.createElement("figcaption")
    figCaption.innerHTML = works[i].title 
    // affichage des éléments crées
    galleryItem.appendChild(img)
    galleryItem.appendChild(figCaption) */

    gallery.appendChild(galleryItem)
    }
}
document.querySelector('.gallery').innerHTML = ""
displayWorks(works)
//Function modification de l'element actif du menu de filtres
function activation(element) {
    console.log(element)
    document.querySelector(".buttons-container .active").classList.remove("active")
    document.getElementById(element).classList.add("active")
}
//Filter buttons processing
    // all items
const buttonAll = document.getElementById("all")
buttonAll.addEventListener("click", function() {
    document.querySelector('.gallery').innerHTML = ""
    activation("all")
    displayWorks(works)
})

    //Onjects
const buttonObjects = document.getElementById("objects")
buttonObjects.addEventListener("click", function () {
    const worksFiltered = works.filter(work => work.category.id === 1)
    document.querySelector('.gallery').innerHTML = ""
    activation("objects")
    displayWorks(worksFiltered)
})

    //apartments
const buttonApartments = document.getElementById("apartments")
buttonApartments.addEventListener("click", function() {
    const worksFiltered = works.filter(work => work.category.id === 2)
    document.querySelector('.gallery').innerHTML = ""
    activation("apartments")
    displayWorks(worksFiltered)
})

    //Hotels&Restaurants
const buttonHotelsAndRestaurants = document.getElementById("hotels-and-restaurants")
buttonHotelsAndRestaurants.addEventListener("click", function() {
    const worksFiltered = works.filter(work => work.category.id === 3)
    document.querySelector('.gallery').innerHTML = ""
    activation("hotels-and-restaurants")
    displayWorks(worksFiltered)
})
