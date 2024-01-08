const nameText = document.getElementById("name")

//decodar cookie info
function getCookie(cname){
    console.log("getting Cookie");
    let name = cname + "="
    let decoded = decodeURIComponent(document.cookie)
    let ca = decoded.split(";")
    for(let i = 0; i < ca.length; i++){
        let c = ca[i]
        while(c.charAt(0) == " "){
            c = c.substring(1)
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

//kollar ifall användaren har en token redan och loggar in dem med den ifall isåfall
document.addEventListener("DOMContentLoaded", function(){
    if(getCookie("session-token") != ""){
        console.log("sending cookie");
        const http = new XMLHttpRequest()
        http.open("GET", "/welback")
        http.onload = function(){
            if(http.status == 200){
                let res = JSON.parse(http.responseText)

                if (res.status == 401 && res.message == "No cookies for me? No login for you!😤") {
                    console.log("No cookies for me? No login for you!😤");
                    window.location.replace("/login/")
                }
                else if (res.status == 401 && res.message == "No token provided") {
                    console.log("No token provided");
                    window.location.replace("/login/")
                }
                else if (res.status == 401 && res.message == "userSession could not be found") {
                    console.log("Server could not find userSession");
                    window.location.replace("/login/")
                }
                else if (res.status == 401 && res.message == "token expired") {
                    console.log("token expired");
                    window.location.replace("/login/")
                }
                else if (res.status == 200){
                    console.log("welcome back user");
                    resName = res.message.replace("Welcome back ", "")
                    document.body.dataset.log = "true"
                    nameText.innerText = resName
                }
                
            } else {
                console.error("Error: " + http.status);
                console.error(http.responseText);
                notLoggedIn()
            }
        }
        http.send()
    }
    else{
        notLoggedIn()
        // window.location.replace("/login/") Detta var min första ide
    }

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        // Clear the client-side session token (if stored)
                        document.cookie = "session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        
                        // Redirect to login page
                        window.location.replace("/login/");
                    } else {
                        console.error('Logout failed');
                    }
                }
            };

            xhr.open('GET', '/logout');
            xhr.withCredentials = true; // Include cookies in the request
            xhr.send();
        });
    }



})

function notLoggedIn(){
    createLoginButton()
    fadeGame()
    displayLoginMessage()
    disableMainElements()
}

function createLoginButton(){
    document.body.dataset.log = "false"
    const loginButton = document.createElement("button");
    loginButton.innerText = "Log In";
    loginButton.id = "log";
    loginButton.addEventListener("click", function() {
        window.location.replace("/login/");
    });

    // Replace the nameText element with the login button
    if (nameText) {
        nameText.replaceWith(loginButton);
    }
}
function fadeGame(){
    const main = document.querySelector("main")
    if (main){
        main.style.filter = "Brightness(20%)"
    }
}
function disableMainElements() {
    const mainElement = document.querySelector("main");
    if (mainElement) {
        const allElements = mainElement.querySelectorAll("*");
        allElements.forEach(element => {
            element.disabled = true; // Disable all elements
        });
    }
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.disabled = true;
    }
}
function displayLoginMessage() {
    // Create a new element for the message
    const messageElement = document.createElement("div");
    messageElement.setAttribute("id", "loginMessage");
    messageElement.innerHTML = `
        <p style="font-family: 'Roboto', sans-serif;">
            Make an account to play!<br>
            <a href="/signup" style="text-decoration: none; display: block; text-align: center; font-family: 'Roboto', sans-serif; font-size: "20px"">Sign Up</a>
        </p>
        <p style="font-family: 'Roboto', sans-serif;">
            Already have one?<br>
            <a href="/login" style="text-decoration: none; display: block; text-align: center; font-family: 'Roboto', sans-serif; font-size: "20px"">Log In</a>
        </p>
    `;

    // Style the message element 
    messageElement.style.position = "fixed";
    messageElement.style.textAlign = "center";
    messageElement.style.top = "50%";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translate(-50%, -50%)";
    messageElement.style.backgroundColor = "rgba(50,205,50,0.8)";
    messageElement.style.color = "#fff";
    messageElement.style.padding = "20px";
    messageElement.style.fontFamily = "'Roboto', sans-serif";
    messageElement.style.fontSize = "20px";
    messageElement.style.borderRadius = "8px";
    messageElement.style.zIndex = "9999";

    // Append the message element to the body
    document.body.appendChild(messageElement);
}