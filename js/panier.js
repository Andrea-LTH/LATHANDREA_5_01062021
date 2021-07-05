//Déclaration de la variable "basket" avec la key et la value - METHODE GET //
let basket = JSON.parse(localStorage.getItem("andrea_orinoco"));
//Format Parse pour convertir les données en format JSON//
//----------------Endroit où je veux que les éléments du panier apparaissent-----------//
let basketContainer = document.querySelector("#container");
//-------------------------- Si le panier est vide-------------------------//
let total = 0;
if (basket === null) {
    basketContainer.innerHTML = `<h3> Le panier est vide </h3>`
} else {
    //---------------------------Si le panier n'est pas vide------------------//
    basket = basket.map((teddy, index) => {
        //----------Utilisation d'un index pour avoir une caractéristique en plus si suppression d'un article en particulier--//

        //------------Récupération de l'ensemble des éléments produit à chaque ajout au panier-----------//
        let basketList = document.querySelector("#basket-container");
        let li = document.createElement("li");
        const price = teddy.price;
        const quantity = parseInt(teddy.quantity);
        const subTotal = price * quantity;
        teddy.subTotal = subTotal;
        total += subTotal;
        li.classList = (".basket-container");
        li.innerHTML =
            `<p>${basket[index].name}</p>
            <p>"Couleur:${basket[index].color}"</p>
            <p class="quantity">"Quantité:${quantity}"</p>
            <p class="price">"Prix unitaire:${price} euros"</p>
            <p class="price">"Sous-total:${subTotal} euros"</p>
            <button class="delete-article"> Supprimer l'article</button>`;
        basketList.appendChild(li);
        return teddy;
    });
}

//****************************************FIN*****************************************/

//--------------Bouton "delete-article"------------//
let removeArticle = document.getElementsByClassName("delete-article");
for (let i = 0; i < removeArticle.length; i++) {
    let button = removeArticle[i];
    button.addEventListener("click", (event) => {
        event.preventDefault;
        const actualList = Array.prototype.slice.call(document.getElementsByClassName("delete-article"))
        const index = actualList.indexOf(button)
        const subTotal = basket[index].subTotal;
        total -= subTotal;
        displayTotalAmount();
        button.parentElement.remove();
        basket.splice(index, 1);
        localStorage.setItem("andrea_orinoco", JSON.stringify(basket))
    })
}
//************************************************FIN*******************************************************/


function displayTotalAmount() {
    //---------------Code HTML du prix total----------------//
    const totalPrice = document.querySelector("#total-basket");
    totalPrice.innerHTML =
        `<div class="total-basket"> 
    <h4> Prix total du panier : ${total} euros. </h4></div>`;
}
displayTotalAmount()

//************************************************FIN*******************************************************/

//------Création du Bouton "vider le panier"--------//
let deleteBasket = document.querySelector("#delete-basket")
let deleteBasketButton = document.createElement("button");
deleteBasketButton.classList = (".delete-basket");
deleteBasketButton.innerHTML =
    `<p>Vider le panier</p>`;
deleteBasket.appendChild(deleteBasketButton);

//----- Vider le panier au clic / Suppression de la key qui contient les éléments du localStorage---//
deleteBasketButton.addEventListener("click", (e) => {
    e.preventDefault;
    //.removeItem pour vider le panier
    localStorage.removeItem("andrea_orinoco");
    //-----alerte---//
    alert("Le panier a été vidé")
    window.location.href = "panier.html"
})
//************************************************FIN*******************************************************/

//****************************Verification du remplissage du formulaire************************************/
let formContainer = () => {
    let form = document.querySelector("#form-container");
    form.innerHTML =
        `<div class="form-group">
    <h2> Formulaire de commande</h2>
</div>
<div class="form-group">
    <label for="last-name">
        Nom
    </label>
    <input id="last-name" placeholder="Entrez votre nom"type="text"required />
</div>
<div class="form-group">
    <label for="first-name">
        Prénom
    </label>
    <input id="first-name" placeholder="Entrez votre prénom" type="text"required />
</div>
<div class="form-group">
    <label for="email">
        Adresse email
    </label>
    <input id="email" placeholder="Entrez votre adresse mail" type="email" required />
</div>
<div class="form-group">		
    <label for="address">
        Adresse de livraison
        </label>   
    <input id="address" placeholder="Entrez votre adresse" type="text" required />
    <input id="city" placeholder="Ville" type="text" required />                        
</div>
<div class="form-group">
    <button class="submit-button" type="submit name="submit-button">
        Confirmer ma commande
    </button>
</div>`
}
formContainer();

//***********************Utilisation du bouton de commande************************//
const submitFormButton = document.querySelector(".submit-button");
submitFormButton.addEventListener("click", (e) => {
    //********************************Recupétation des valeurs inscrites dans le formulaire*************// 
    const submitForm = {
        lastName: document.querySelector("#last-name").value,
        firstName: document.querySelector("#first-name").value,
        email: document.querySelector("#email").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,

    }
    if (submitForm.lastName.trim().length === 0) {
        alert("Tous les champs doivent être remplis")
        return
    }
    if (submitForm.firstName.trim().length === 0) {
        alert("Tous les champs doivent être remplis")
        return
    }
    if (submitForm.email.trim().length === 0) {
        alert("Tous les champs doivent être remplis")
        return
    }
    if (submitForm.address.trim().length === 0) {
        alert("Tous les champs doivent être remplis")
        return
    }
    if (submitForm.city.trim().length === 0) {
        alert("Tous les champs doivent être remplis")
        return
    }
    localStorage.setItem("submitForm", JSON.stringify(submitForm));
    //*************************Gestion de la validation du formulaire**************************//

    const email = submitForm.email;
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    } else {
        alert("L'email n'est pas valide");
    }

    //*************Récupérer les élements du panier et du formulaire à envoyer au server***********************//
    const sendElement = {
        products: basket.map(product => product._id),
        contact: submitForm,
        total:basket.map(product => product.price),
    };
    //*******************Envoie vers le serveur********************************************************//

    const sendOrder = fetch("http://localhost:3000/api/teddies/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendElement)
    });
    //----------------Résultat du serveur------//
    sendOrder.then(async (response) => {
        try {
            const order = await response.json();
            if (response.ok) {
                localStorage.setItem("order",order.orderId)
                location.href="page-confirmation.html";
            } else {
                console.log(`Reponse du serveur : ${response.status}`)
            };
        } catch (e) {
            console.log(e)
        }
    })
});



