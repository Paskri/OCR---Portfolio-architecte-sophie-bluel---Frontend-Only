/*import {} from "./functions.js"*/

//Authentification
    //vérifie si authentifié et donc porteur du token
const BearerAuth = JSON.parse(window.localStorage.getItem('BearerAuth'));
if (BearerAuth) {
    //création de la barre d'administration
    const adminBar = document.createElement("div");
    adminBar.classList.add("admin-bar");
    adminBar.innerHTML = 
    `<div class="admin-container">
        <div class="modify-container">
            <img src="./assets/icons/modify.png" alt="modifier" id="modify">
            Mode édition
        </div>
        <a href="#">
            <button class="publish">Publier les changements</button>
        </a>
    </div>`;
    //affichage au sommet
    document.querySelector("body").prepend(adminBar);
    // modification du login en logout
    const loginLi = document.querySelector(".login");
    loginLi.innerHTML = `<a href="#">logout</a>`;
    loginLi.classList.replace("login", "logout");
    // création des éléments pour la modification du contenu
    const modifyContainer = document.createElement("div");
    modifyContainer.classList.add("modify-container");
    modifyContainer.innerHTML = 
        `<a href="#">
            <img src="./assets/icons/modify.png" alt="modifier" id="modify">
            Modifier
        </a>`;
    //selection des lieux d'apparition et clonage et injection
    document.querySelector("article").prepend(modifyContainer.cloneNode(true)); 
    document.querySelector("figure").appendChild(modifyContainer.cloneNode(true));
    document.getElementById("portfolio").prepend(modifyContainer.cloneNode(true));
    // ajout marge + 50px dans header
    document.querySelector("header").style.margin = "100px 0 50px 0";
    //suppression des filtres
    document.querySelector(".buttons-container").style.display = "none";
    
}

// logout function
const logout = document.querySelector(".logout");
if (logout) { 
    logout.addEventListener("click", function() {
        //suppression du BearerAuth dans le storage
        window.localStorage.removeItem("BearerAuth");
        // tout ceci est inutile si on recharge la page
        //suppression de la barre d'administration
        const adminBar = document.querySelector(".admin-bar");
        adminBar.remove();
        //transformer logout en login
        const logoutLi = document.querySelector(".logout");
        logoutLi.innerHTML = `<a href="/login.html">login</a>`;
        logoutLi.classList.replace("logout", "login");
        // disparition des modify-containers
        const modifyContainers = document.querySelectorAll(".modify-container");
        console.log(modifyContainers);
        modifyContainers.forEach((element) => element.remove());
        // réapparition des filtres
        document.querySelector(".buttons-container").style.display = "flex";
})
}


let works = window.localStorage.getItem('works');
if (works === null) {
    //récupération des works via l'API
    const response = await fetch('http://localhost:5678/api/works');
    works = await response.json();
    // transformation des données en JSON
    const worksJSON = JSON.stringify(works);
    //stocke les datas dans le localstorage pour faciliter l'utilisation ultérieure
    window.localStorage.setItem("works", worksJSON);
} else {
    works = JSON.parse(works);
}

function displayWorks(works) {
    //boucle pour parcourir les travaux
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // récupération de l'élement du dom qui acceuille les travaux
    const gallery = document.querySelector(".gallery");
    // Création du modèle galleryItem
    const galleryItem = document.createElement("figure");
    const img = document.createElement('img');
    //Création de l'url de l'image dans le dossier courant à partir de l'url fournie par l'API
    //Attention procéder directement avec l'image fournie par la backend engendre des problèmes de sécurité signalés en console !
    let imgUrl = works[i].imageUrl.split("/");
    imgUrl = imgUrl[imgUrl.length -1].replace(/[0-9]/g, "");
    // Methode 2 beaucoup plus rapide ...
    galleryItem.innerHTML = `
        <img src="assets/images/${imgUrl}" alt="${works[i].title}">
        <figcaption>${works[i].title}</figcaption>`;
    gallery.appendChild(galleryItem);
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
    }
}
document.querySelector('.gallery').innerHTML = "";
displayWorks(works);
//Function modification de l'element actif du menu de filtres
function activation(element) {
    console.log(element);
    document.querySelector(".buttons-container .active").classList.remove("active");
    document.getElementById(element).classList.add("active");
}
//Filter buttons processing
    // all items
const buttonAll = document.getElementById("all");
buttonAll.addEventListener("click", function() {
    document.querySelector('.gallery').innerHTML = "";
    activation("all");
    displayWorks(works);
})

    //Onjects
const buttonObjects = document.getElementById("objects");
buttonObjects.addEventListener("click", function () {
    const worksFiltered = works.filter(work => work.category.id === 1);
    document.querySelector('.gallery').innerHTML = "";
    activation("objects");
    displayWorks(worksFiltered);
})

    //apartments
const buttonApartments = document.getElementById("apartments");
buttonApartments.addEventListener("click", function() {
    const worksFiltered = works.filter(work => work.category.id === 2);
    document.querySelector('.gallery').innerHTML = "";
    activation("apartments");
    displayWorks(worksFiltered);
})

    //Hotels&Restaurants
const buttonHotelsAndRestaurants = document.getElementById("hotels-and-restaurants");
buttonHotelsAndRestaurants.addEventListener("click", function() {
    const worksFiltered = works.filter(work => work.category.id === 3);
    document.querySelector('.gallery').innerHTML = "";
    activation("hotels-and-restaurants");
    displayWorks(worksFiltered);
})
