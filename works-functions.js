 /**
  * get works from db, save them in localStorage and return works
  * @returns {JSON object}
  */
 async function getWorks () {
    let works ={};
    await fetch('http://localhost:5678/api/works')
    .then (r => r.json())
    .then (dbworks => {
        window.localStorage.setItem("works", JSON.stringify(dbworks));
        displayWorks(dbworks);
        displayThumbnails(dbworks);
        works = dbworks;
    })
    .catch (e => console.log(e))
    return works;
}

async function getCategories() {
    let categories = {};
    await fetch('http://localhost:5678/api/categories')
        .then(r => r.json())
        .then(cat => {
            window.localStorage.setItem("categories", JSON.stringify(cat));
            categories = cat;
        })
        .catch (e => console.log(e))
    return categories;
}

/**
 * Diplaying works in gallery
 * @param {JSONobject} works 
 */
function displayWorks(works) {
    // getting works place
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    //Loop for works
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // galleryItem element creation
    const galleryItem = document.createElement("figure");
    const img = document.createElement('img');
    galleryItem.innerHTML = `<img src="${works[i].imageUrl}" alt="${works[i].title}" crossorigin="same-origin">
                            <figcaption>${works[i].title}</figcaption>`;
    gallery.appendChild(galleryItem);
    }
}

let previousThumbnailGallery = {};
let thumbnailGallery = {};
let elements = {};

/**
 * enlarge thumbnail picture
 * @param {clickEvent} e 
 */
function enlargePicture(e) {
    //previousThumbnailGallery = document.querySelector("#thumbnail-gallery").innerHTML;
    thumbnailGallery = document.querySelector("#thumbnail-gallery");
    elements = thumbnailGallery.querySelectorAll("h2, div, form");
    elements.forEach(e => {
        e.setAttribute("style", "display: none;");
    })
    const currentImg = e.target.parentNode.previousElementSibling;
    currentImg.classList.add('gallery-preview');
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.classList.add("figure-a");
    link.appendChild(currentImg);
    thumbnailGallery.setAttribute("style", "padding: 0 10px;");
    thumbnailGallery.prepend(link);
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus();
    link.addEventListener("click", e => {
        unlargePicture(e);
    })
}
/**
 * Display prévious thumbnail gallery
 * @param {clickEvent} e 
 */
async function unlargePicture (e) {
    thumbnailGallery.removeAttribute("style");
    thumbnailGallery.removeChild(thumbnailGallery.querySelector(".figure-a"));
    elements.forEach(e => {
        e.removeAttribute("style");
    })
    // Await mandatory or focusable loaded while getWorks request is running and
    // <a>s still hidden
    await getWorks();
    closeModal("#modal3-1");
    openModal("#modal3-1");
}
/**
 * Displaying works thumbnails in modal3-1 window
 * @param {JSONobject} works 
 */
 function displayThumbnails(works) {
    // getting gallery 
    const gallery = document.querySelector(".thumbnail-gallery-container");
    gallery.innerHTML = "";
    //Looping in works
    for (let i = 0; i < works.length; i++) {
    const work = works[i];
    // Creating galleryItem
    const galleryItem = document.createElement("figure");
    galleryItem.classList.add("js-modal-stop");
    const img = document.createElement('img');
    galleryItem.innerHTML =  // <a href="#" class="js-modal-stop figure-a"> </a>
        `<img src="${works[i].imageUrl}" alt="${works[i].title}" crossorigin="same-origin">
        <a href="#" id="enlarge" class="enlarge">
            <img src="assets/icons/enlarge.svg">
        </a>
        <a href="#" deleteId="${works[i].id}" class="trashbin">
            <img src="assets/icons/trashbin.svg">
        </a>
        <figcaption>Éditer</figcaption>`;
    gallery.appendChild(galleryItem);
    // adds event on trashbin click
    const trash = galleryItem.querySelector(".trashbin");
    const id = trash.getAttribute("deleteId");
    trash.addEventListener("click", function(e){
        e.preventDefault();
        deleteEntry(id);
    })
    // displaying enlarge on mouseOver
    const figureImg = galleryItem.querySelector("img");
    const enlarge = galleryItem.querySelector(".enlarge");
    // adds event on enlarge button click
    enlarge.addEventListener("click", e => {
        enlargePicture(e);
    })

    }
}
/**
 * Displaying categories filters and modal3-2 window select options
 * @param {JSON} categories
 */
 /*export*/ function displayCategories(categories) {
    const filtersContainer = document.querySelector('.filters-container');
    const all = `<button id="all" class="filter-button active">Tous</button>`;
    filtersContainer.innerHTML = all;
    const categorySelect = document.getElementById("category-input");
    for (let category of categories) {
        let idName = category.name.replaceAll(' ', '-').toLowerCase();
        const button = `<button id="${idName}" class="filter-button">${category.name}</button>`;
        filtersContainer.innerHTML += button;
        categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    } 
}

/**
 * Displays modify container
 * @param {string} selector 
 * @param {string} href 
 * @param {string} method 
 */
function displayModifyContainers (selector, href, method) {
    const modifyContainer = document.createElement("div");
    modifyContainer.classList.add("modify-container");
    modifyContainer.innerHTML = `<a href="${href}" class="js-modal">
                                    <img src="./assets/icons/modify.png" alt="modifier" id="modify">
                                    Modifier
                                </a>`;
    if(method ==="prepend") {
        document.querySelector(selector).prepend(modifyContainer)
    } else {
        document.querySelector(selector).append(modifyContainer)
    }                    
}

/**
 * Activate/unactivate filters
 * @param {string} element 
 */
function activate(element) {
    document.querySelector(".filters-container .active").classList.remove("active");
    document.getElementById(element).classList.add("active");
}

/**
 * Delete entry from db
 * @param {int} id 
 */
async function deleteEntry(id) {
    const bearerAuth = JSON.parse(window.localStorage.getItem("bearerAuth"))
    console.log(id)
    await fetch('http://localhost:5678/api/works/'+id, {
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



    