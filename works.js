/*import {} from "./functions.js"*/

/**
 * Diplaying works in gallery
 * @param {JSONobject} works 
 */
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
    }
}
/**
 * Displaying works in modal3-1 window
 * @param {JSONobject} works 
 */
function displayThumbnails(works) {
    //boucle pour parcourir les travaux
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // récupération de l'élement du dom qui acceuille les travaux
    const gallery = document.querySelector(".thumbnail-gallery-container")
    // Création du modèle galleryItem
    const galleryItem = document.createElement("figure");
    const img = document.createElement('img');
    //Création de l'url de l'image dans le dossier courant à partir de l'url fournie par l'API
    //Attention procéder directement avec l'image fournie par la backend engendre des problèmes de sécurité signalés en console !
    let imgUrl = works[i].imageUrl.split("/");
    imgUrl = imgUrl[imgUrl.length -1].replace(/[0-9]/g, "");
    // Methode 2 beaucoup plus rapide ...
    galleryItem.innerHTML = 
        `<img src="assets/images/${imgUrl}" alt="${works[i].title}">
        <div id="enlarge" class="enlarge">
            <img src="assets/icons/enlarge.svg">
        </div>
        <div id="trashbin" class="trashbin">
            <img src="assets/icons/trashbin.svg">
        </div>
        <figcaption>Éditer</figcaption>`;
    gallery.appendChild(galleryItem);
    }
}

//fetch request for works
let works = window.localStorage.getItem('works');
if (works === null) {
    //récupération des works via l'API
    const response = await fetch('http://localhost:5678/api/works');
    works = await response.json();
    //stocke les datas dans le localstorage pour faciliter l'utilisation ultérieure
    window.localStorage.setItem("works", JSON.stringify(works));
} else {
    works = JSON.parse(works);
}

//fetch request for categories
let categories = window.localStorage.getItem('categories')
if (categories === null) {
    const response2 = await fetch('http://localhost:5678/api/categories')
    categories = await response2.json()  
    window.localStorage.setItem("categories", JSON.stringify(categories));
} else {
    categories = JSON.parse(categories);
}

/**
 * Displaying categories filters and modal select options
 * @param {JSONobject} categories 
 */
function displayCategoriesFilters(categories) {
    console.log(categories)
    const filtersContainer = document.querySelector('.filters-container')
    const all = `<button id="all" class="filter-button active">Tous</button>`
    filtersContainer.innerHTML = all
    const categorySelect = document.getElementById("category-input")
    for (let category of categories) {
        let idName = category.name.replaceAll(' ', '-').toLowerCase()
        const button = `<button id="${idName}" class="filter-button">${category.name}</button>`
        filtersContainer.innerHTML += button
        categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option> `
    } 
}

//Affichage si l'utilisateur est logué
    //vérifie si authentifié et donc porteur du token
const bearerAuth = JSON.parse(window.localStorage.getItem('bearerAuth'));
if (bearerAuth && bearerAuth.token) {
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
        `<a href="#" class="js-modal">
            <img src="./assets/icons/modify.png" alt="modifier" id="modify">
            Modifier
        </a>`;
    //display modify-containers
        //figure
    const introductionFigureModifyContainer = modifyContainer.cloneNode(true);
    introductionFigureModifyContainer.querySelector("a").setAttribute("href", "#modal1")
    document.querySelector("#introduction figure").appendChild(introductionFigureModifyContainer);
        //article
    const articleModifyContainer = modifyContainer.cloneNode(true);
    articleModifyContainer.querySelector("a").setAttribute("href", "#modal2")
    document.querySelector("article").prepend(articleModifyContainer);
        //portfolio + lien fenetre modale
    const portfolioModifyContainer = modifyContainer.cloneNode(true);
    portfolioModifyContainer.querySelector("a").setAttribute("href", "#modal3-1")
    document.getElementById("portfolio").prepend(portfolioModifyContainer);
        // add margin in header
    document.querySelector("header").style.margin = "100px 0 50px 0";
        //hidding filters
    document.querySelector(".filters-container").style.display = "none";
}
    
    // logout
    const logout = document.querySelector(".logout");
    if (logout) { 
        logout.addEventListener("click", function() {
            //suppression du BearerAuth dans le storage
            window.localStorage.removeItem("bearerAuth");
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
            modifyContainers.forEach((element) => element.remove());
            // réapparition des filtres
            document.querySelector(".buttons-container").style.display = "flex";
        })
    }

document.querySelector('.gallery').innerHTML = "";
displayWorks(works);
displayThumbnails(works);
displayCategoriesFilters(categories);


//Filter buttons processing

/**
 * Activate/unactivate filters
 * @param {string} element 
 */
function activation(element) {
    document.querySelector(".filters-container .active").classList.remove("active");
    document.getElementById(element).classList.add("active");
}
    // all items
const buttonAll = document.getElementById("all");
buttonAll.addEventListener("click", function() {
    document.querySelector('.gallery').innerHTML = "";
    activation("all");
    displayWorks(works);
})

    // Objets, appartement, hotels & restaurants à partir de db
for (let category of categories) {
    const categoryName = category.name.replaceAll(' ', '-').toLowerCase()
    const buttonName = document.getElementById(categoryName);
    buttonName.addEventListener("click", function () {
        const worksFiltered = works.filter(work => work.category.id === category.id);
        document.querySelector('.gallery').innerHTML = "";
        activation(categoryName);
        displayWorks(worksFiltered);
    })
}






