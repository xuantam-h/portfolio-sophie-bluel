// Access to API /login with POST method

// Define main variables
const loginForm = document.getElementById('login-form')
const userMail = document.getElementById('user-email')
const userPwd = document.getElementById('user-password')

loginForm.addEventListener('submit', async function(e){
    e.preventDefault()

    const loginData = {
        email: userMail.value,
        password: userPwd.value
    }

    // Convert the data into JSON
    const formJSON = JSON.stringify(loginData)

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

    if (r.ok === true){
        localStorage.setItem('token', tokenId);
        window.location.href = 'index.html'
    } else {
        alert("Erreur dans l'identifiant ou le mot de passe")
    }

})