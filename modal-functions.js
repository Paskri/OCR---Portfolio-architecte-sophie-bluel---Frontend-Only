// modal windows display
//définition des variables
let modal = null
const focusableSelector = "button, a, input, textarea, select"
let focusables = []
let préviouslyFocusedElement = null

/**
 * Open current modalWindow
 * @param {MouseEvent} e 
 */
function openModal(e) {
    console.log("openning")
    if (typeof e === 'string') {
        modal = document.querySelector(e)
    } else {
        e.preventDefault()
        modal = document.querySelector(e.target.getAttribute('href'))
    }
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    console.log("focusables :")
    console.log(focusables)
    préviouslyFocusedElement = document.querySelector(":focus")
    modal.style.display = null
    focusables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', e => e.stopPropagation())
}

/**
 * Close current modalWindow
 * @param {MouseEvent} e 
 * @returns 
 */
function closeModal(e) {
    console.log("closing")
    if (modal === null) return
    if (typeof e === 'string') {
        modal = document.querySelector(e)
    } else {
        e.preventDefault()
    }
    if (préviouslyFocusedElement !== null) préviouslyFocusedElement.focus()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", true)
    modal.removeAttribute("aria-modal", "true")
    modal.querySelector('.js-modal-close').removeEventListener("click", closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener("click", e => e.stopPropagation())
    modal = null
}

/**
 * Focuses ...
 * @param {KeyboardEvent} e 
 */
function focusInModal(e) {
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

/**
 * Reset file input by displaying prévious content
 */
 function displayImageInput() {
    const imgPreview = document.querySelector(".upload-container img")
    document.querySelector(".upload-container").innerHTML = previousContent
    // Reappearing elements
    imageInput = document.getElementById("file")
    imageInput.addEventListener("change", displayPreview)
}

/**
 * Displaying image preview and hidding download components
 */
function displayPreview() {
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