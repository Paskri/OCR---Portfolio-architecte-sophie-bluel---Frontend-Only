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
// Variables
let img = "";
let previousContent = document.querySelector(".upload-container").innerHTML
let imageInput = document.getElementById("file")

// Entry point in functions loop displayImageInput() and display preview
imageInput.addEventListener("change", displayPreview)

//add picture / processing form datas
const addPicture = document.querySelector("#add-picture form")
addPicture.addEventListener("submit", async function(e){
    e.preventDefault()
    let datas = new FormData(addPicture)
    const bearerAuth = JSON.parse(window.localStorage.getItem("bearerAuth"))
    await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer "+bearerAuth.token               
            },
            body: datas            
        })
        .then((response) => {
            return response.json()
        })
        .then((result) => {
            getWorks()
            closeModal("#modal3-2")
            openModal("#modal3-1")
            addPicture.reset()
            displayImageInput()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})

