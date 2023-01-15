const bearerAuth = window.localStorage.getItem("BearerAuth");
document
    .querySelector("form")
    .addEventListener("submit", async function(e) {
        //deleted préviously error message
        e.preventDefault();
        const previousError = document.querySelector(".error");
        if (previousError) {
            previousError.remove();
        }
        //creating form datas object
        const loginFormDatas = {
            email: e.target.querySelector("[name=email]").value,
            password: e.target.querySelector("[name=password]").value
        };
        //création de la charge utlise au format JSON
        const chargeUtile = JSON.stringify(loginFormDatas);
        // envoi des données du formulaire au serveur
        await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        })
        //récupération de la réponse
        .then(r => {
            if (r.ok === true) {
                return r.json();
            } else if (r.status === 404) {
                throw new Error("Votre email n'existe pas dans la base de données...");
            } else if (r.status === 401) {
                throw new Error("Votre mot de passe ne correspond pas à celui de ce compte...");
            }
        })
        .then(body => {
            //stores datas in localStorage
            //asking myself if session storage could be better
            window.localStorage.setItem("bearerAuth", JSON.stringify(body));
            // redirection to homepage
            window.location.replace("index.html");
        })
        .catch(e=> {
            // catching and displaying errors
            const error = document.createElement("div");
            error.classList.add("error");
            error.innerHTML = e.message;
            document.querySelector("form").prepend(error);
        })
    });
