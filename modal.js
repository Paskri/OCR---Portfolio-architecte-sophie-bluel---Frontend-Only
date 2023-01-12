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
let imageInput = document.getElementById("image-input")

const displayImageInput = function () {
    const imgThumb = document.querySelector(".image-thumbnail")
    console.log(imgThumb)
    imgThumb.addEventListener('click', function(){
    document.querySelector(".upload-container").innerHTML = previousContent
    // Reappearing elements
    imageInput = document.getElementById("image-input")
    imageInput.addEventListener("change", displayThumbnail)
})
}

const displayThumbnail = function () {
        img = imageInput.files[0]
        const imagethumbnail = 
        `<div class="image-thumbnail">
            <img src="${URL.createObjectURL(img)}" alt="image">
        </div>`
        document.querySelector(".upload-container").innerHTML = imagethumbnail
        const imgThumb = document.querySelector('.image-thumbnail img')
        imgThumb.addEventListener("click", displayImageInput)
}

// Entry point in functions loop above
imageInput.addEventListener("change", displayThumbnail)

//add picture / processing form datas
const addPicture = document.querySelector("#add-picture form")
addPicture.addEventListener("submit", async function(e){
    e.preventDefault()
    console.log(e.target)
    //Maybe try to get form datas directly from HTMLform via input names
    let datas = new FormData(addPicture)
    /*datas.append('file', imageInput.files[0])
    datas.append('title', e.target.querySelector("[name=title]").value)
    datas.append('categoryId', e.target.querySelector("[name=category]").value)*/
    console.log(datas)
    const bearerAuth = JSON.parse(window.localStorage.getItem("bearerAuth"))
    const request = await fetch("http://localhost:5678/api/works", {
            Method: "POST",
            Headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
                "Authorization": bearerAuth.userId + ' ' + bearerAuth.token
            },
            "Body": datas
        })
    console.log(request)
    const response = await request.json()
    console.log(response)
    //renvoie l'ensemble des works
})

