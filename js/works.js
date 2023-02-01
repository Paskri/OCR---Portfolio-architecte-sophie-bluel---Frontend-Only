//fetch for works
let works = await getWorks();

//fetch request for categories
let categories = await getCategories();

//display when user logged
    //checking bearerAuth
const bearerAuth = JSON.parse(window.localStorage.getItem('bearerAuth'));
if (bearerAuth && bearerAuth.token) {
    //Admin bar creation
    const adminBar = document.createElement("div");
    adminBar.classList.add("admin-bar");
    adminBar.innerHTML =`<div class="admin-container">
                            <div class="modify-container">
                                <img src="./assets/icons/modify.png" alt="modifier" id="modify">
                                Mode édition
                            </div>
                            <button class="publish">Publier les changements</button>
                        </div>`;
    // displays top adminbar
    document.querySelector("body").prepend(adminBar);
    // login becomes logout
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
// adding listener on each modify container for modal openning
document.querySelectorAll(".modal").forEach(a => {
    a.addEventListener("click", openModal);
})
    
// logout
const logout = document.querySelector(".logout");
if (logout) { 
    logout.addEventListener("click", function() {
    //Deleting Bearer Auth in local storage
    window.localStorage.removeItem("bearerAuth");
    //deleting admin bar
    const adminBar = document.querySelector(".admin-bar");
    adminBar.remove();
    //logout becomes login
    const logoutLi = document.querySelector(".logout");
    logoutLi.innerHTML = `<a href="/login.html">login</a>`;
    logoutLi.classList.replace("logout", "login");
    // disappering of modify-containers
    const modifyContainers = document.querySelectorAll(".modify-container");
    modifyContainers.forEach((element) => {
        element.removeEventListener('click', openModal);
        element.remove();
    });
    // appearing of filters
    document.querySelector(".filters-container").style.display = "flex";
    })
}

//Launching 
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

    // Objets, appartment, hotels & restaurants from db
for (let category of categories) {
    const categoryName = category.name.replaceAll(' ', '-').toLowerCase();
    const buttonName = document.getElementById(categoryName);
    buttonName.addEventListener("click", function () {
        const worksFiltered = works.filter(work => work.category.id === category.id);
        document.querySelector('.gallery').innerHTML = "";
        activate(categoryName);
        displayWorks(worksFiltered);
    })
}






