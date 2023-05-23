// Define main variables
const loginForm = document.getElementById('login-form')
const userMail = document.getElementById('user-email')
const userPwd = document.getElementById('user-password')
const loginFeedback = document.getElementById('login-feedback')

loginForm.addEventListener('submit', async function(e){
    e.preventDefault()

    // Sending form input values
    const loginData = {
        email: userMail.value,
        password: userPwd.value
    }

    // Convert the data into JSON
    const formJSON = JSON.stringify(loginData)

    if (userMail === '' || userPwd === '') {
        loginFeedback.innerText = '<i class="fa-solid fa-triangle-exclamation"></i>Tous les champs du formulaire doivent être remplis.'
        return
    }

    // Access to API /login with POST method
    const r = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { 
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: formJSON
    })
    const data = await r.json()
    const tokenId = data.token

    // Handling errors + actions if response is fulfilled
    if (r.ok === true){
        // Adding token in localstorage and redirect to index.html
        window.localStorage.setItem("token", tokenId);
        location.href = 'index.html'
    } else {
        // Display error
        loginFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>Erreur dans l’identifiant ou le mot de passe.`
    }

})