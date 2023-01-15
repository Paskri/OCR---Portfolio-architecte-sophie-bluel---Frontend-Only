/*import { displayWorks, displayThumbnails, displayCategories, activate, getWorks } from "./functions.js";*/

let works = JSON.parse(window.localStorage.getItem('works'));
if(works === null) {
    works = await getWorks()
}
//experimental
/*let workClass = new WorkClass(works)
console.log(workClass)*/

//fetch request for categories
let categories = JSON.parse(window.localStorage.getItem('categories'))
if (categories === null) {
   categories = await getCategories()
}

//Affichage si l'utilisateur est logué
    //vérifie si authentifié et donc porteur du token
const bearerAuth = JSON.parse(window.localStorage.getItem('bearerAuth'));
if (bearerAuth && bearerAuth.token) {
    //Admin bar creation
    const adminBar = document.createElement("div");
    adminBar.classList.add("admin-bar");
    adminBar.innerHTML =    `<div class="admin-container">
                                <div class="modify-container">
                                    <img src="./assets/icons/modify.png" alt="modifier" id="modify">
                                    Mode édition
                                </div>
                                <a href="#">
                                    <button class="publish">Publier les changements</button>
                                </a>
                            </div>`;
    // displays top adminbar
    document.querySelector("body").prepend(adminBar);
    // login/logout
    const loginLi = document.querySelector(".login");
    loginLi.innerHTML = `<a href="#">logout</a>`;
    loginLi.classList.replace("login", "logout");
    // Modify button creation
    displayModifyContainers("#introduction figure", "#modal1", "append");
    displayModifyContainers("article", "#modal2", "prepend");
    displayModifyContainers("#portfolio", "#modal3-1", "prepend")
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
    document.querySelector(".filters-container").style.display = "flex";
    })
}

//Lauching 
document.querySelector('.gallery').innerHTML = "";
displayWorks(works);
displayThumbnails(works);
displayCategories(categories);

//Filter buttons processing
    // all items
const buttonAll = document.getElementById("all");
buttonAll.addEventListener("click", function() {
    document.querySelector('.gallery').innerHTML = "";
    activate("all");
    displayWorks(works);
})

    // Objets, appartement, hotels & restaurants à partir de db
for (let category of categories) {
    const categoryName = category.name.replaceAll(' ', '-').toLowerCase()
    const buttonName = document.getElementById(categoryName);
    buttonName.addEventListener("click", function () {
        const worksFiltered = works.filter(work => work.category.id === category.id);
        document.querySelector('.gallery').innerHTML = "";
        activate(categoryName);
        displayWorks(worksFiltered);
    })
}






