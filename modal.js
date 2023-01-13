import { displayThumbnails, displayWorks, getWorks } from "./functions.js";

// modal windows display
//définition des variables
let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []
let préviouslyFocusedElement = null

function openModal(e) {
    if (typeof e === 'string') {
        modal = document.querySelector(e)
    } else {
        e.preventDefault()
        modal = document.querySelector(e.target.getAttribute('href'))
    }
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    préviouslyFocusedElement = document.querySelector(":focus")
    modal.style.display = null
    focusables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', e => {e.stopPropagation()})
}

function closeModal(e) {
    if (modal === null) return
    if (préviouslyFocusedElement !== null) préviouslyFocusedElement.focus()
    if (typeof e === 'string') {
        modal = document.querySelector(e)
    } else {
        e.preventDefault()
    }
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", true)
    modal.removeAttribute("aria-modal", "true")
    modal.querySelector('.js-modal-close').removeEventListener("click", closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener("click", e => {e.stopPropagation()})
    modal = null
}

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusable.length - 1
    }
    focusables[index].focus()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

// add actions from keyboard events
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

//Openning modal3-2
document.querySelector("#thumbnail-gallery form").addEventListener('submit', function(e) {
e.preventDefault()
closeModal("#modal3-1")
openModal("#modal3-2")
})

//Back arrow 
document.querySelector('.js-modal-back').addEventListener('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    closeModal("#modal3-2")
    openModal("#modal3-1")
})

// Displaying downloaded image thumbnail
let img = "";
let previousContent = document.querySelector(".upload-container").innerHTML
let imageInput = document.getElementById("file")

/**
 * Reset file input by displaying prévious content
 */
const displayImageInput = function () {
    const imgPreview = document.querySelector(".upload-container img")
    document.querySelector(".upload-container").innerHTML = previousContent
    // Reappearing elements
    imageInput = document.getElementById("file")
    imageInput.addEventListener("change", displayPreview)
}

/**
 * Displaying image preview and hidding download components
 */
const displayPreview = function () {
        //updating image
        const preview = document.querySelector(".upload-container img")
        preview.setAttribute("src", URL.createObjectURL(imageInput.files[0]))
        preview.classList.add("preview")
        //updating download items
        const upCont = document.querySelector(".upload-container")
        upCont.querySelector("p").setAttribute("hidden", "")
        upCont.querySelector("label").setAttribute("style", "display: none;")
        upCont.querySelector("img").addEventListener("click", displayImageInput)
}

// Entry point in functions loop above
imageInput.addEventListener("change", displayPreview)

//add picture / processing form datas
const addPicture = document.querySelector("#add-picture form")
addPicture.addEventListener("submit", function(e){
    e.preventDefault()
    console.log(e.target)
    //Maybe try to get form datas directly from HTMLform via input names
    let datas = new FormData(addPicture)
    console.log(datas)
   
    const bearerAuth = JSON.parse(window.localStorage.getItem("bearerAuth"))
    console.log(bearerAuth.token)
    fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer "+bearerAuth.token               
            },
            body: datas            
        })
        .then((response) => {
            console.log(response)
            return response.json()
        })
        .then((result) => {
            console.log('Success:', result);
            getWorks()
            closeModal("#modal3-2")
            openModal("#modal3-1")
            addPicture.reset()
            displayImageInput()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    //updating works
    
    //renvoie l'ensemble des works
})

