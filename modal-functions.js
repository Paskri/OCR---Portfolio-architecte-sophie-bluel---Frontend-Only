// modal windows display
// variables
let modal = null;
let focusables = [];
let previouslyFocusedElement = null;
let previousContent = document.querySelector(".upload-container").innerHTML;
let imageInput = document.getElementById("file");

/**
 * Open current modalWindow
 * @param {MouseEvent or string} e 
 */
function openModal(eventOrString) {
    if (typeof eventOrString === 'string') {
        modal = document.querySelector(eventOrString);
        console.log('string')
    } else {
        eventOrString.preventDefault();
        modal = document.querySelector(eventOrString.target.getAttribute('href'));
        previouslyFocusedElement = document.querySelector(":focus")
    }
    console.log(modal)
    focusables = Array.from(modal.querySelectorAll("button, a, input, textarea, select"));
    modal.style.display = null;
    //focusables[0].focus();
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-stop').addEventListener('click', eventOrString => eventOrString.stopPropagation());
}


/**
 * Close current modalWindow
 * @param {MouseEvent} e 
 * @returns 
 */
function closeModal(eventOrString) {
    if (modal === null) return;
    if (typeof eventOrString === 'string') {
        modal = document.querySelector(eventOrString);
    } else {
        eventOrString.preventDefault();
    }
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", true);
    modal.removeAttribute("aria-modal", "true");
    modal.querySelector('.modal-close').removeEventListener("click", closeModal);
    modal.querySelector('.modal-stop').removeEventListener("click", eventOrString => eventOrString.stopPropagation());
    modal = null;
}

/**
 * Focuses in modal window
 * @param {KeyboardEvent} e 
 */
function focusInModal(e) {
    e.preventDefault();
    let index = focusables.findIndex(focusable => focusable === modal.querySelector(":focus"));
    // if shiftKey pressed go back
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    //Brings focus to the right place (First or last) while exiting window
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusable.length - 1;
    }
    focusables[index].focus();
}

/**
 * Reset file input by displaying previous content
 */
function displayImageInput() {
    const imgPreview = document.querySelector(".upload-container img");
    document.querySelector(".upload-container").innerHTML = previousContent;
    // Reappearing elements
    imageInput = document.getElementById("file");
    imageInput.addEventListener("change", displayPreview);
}

/**
 * Displaying image preview and hidding download components
 */
function displayPreview() {
        //updating image
        const preview = document.querySelector(".upload-container img");
        preview.setAttribute("src", URL.createObjectURL(imageInput.files[0]));
        preview.classList.add("preview");
        //updating download items
        const upCont = document.querySelector(".upload-container");
        upCont.querySelector("p").setAttribute("hidden", "");
        upCont.querySelector("label").setAttribute("style", "display: none;");
        upCont.querySelector("img").addEventListener("click", displayImageInput);
}

