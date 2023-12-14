const feedback = document.getElementById("feedback")

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
                }
                else if (res.status == 401 && res.message == "No token provided") {
                    console.log("No token provided");
                }
                else if (res.status == 401 && res.message == "userSession could not be found") {
                    console.log("Server could not find userSession");
                }
                else if (res.status == 401 && res.message == "token expired") {
                    console.log("token expired");
                }
                else if (res.status == 200){
                    console.log("welcome back user");
                    window.location.replace("/game/")
                }
                
            } else {
                console.error("Error: " + http.status);
                console.error(http.responseText);
            }
        }
        http.send()

    }

})

//Väntar på submit för form för att sedan skicka datan till servern
document.getElementById('login').addEventListener('click', function(event){    
    if(validInput()){
        feedback.innerText = ""
        console.log("input valid");
        const http = new XMLHttpRequest()
        http.open("POST", "/login")
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        
        http.onload = function(){
            
            if(http.status == 200){
                console.log(http.responseText)
                let res = JSON.parse(http.responseText)

                if (res.status = 401 && res.message == "User unauthorized") {
                    feedback.innerText = "Incorrect password. Try again!"
                }
                if (res.status = 400 && res.message == "User not found") {
                    feedback.innerText = "Incorrect email or username"
                }
                if (res.status = 200 && res.message == "User authenticated") {
                    window.location.replace("/game/")
                }

            }
            else{
                console.error("Error: " + http.status)
                console.error(http.responseText)
            }
        }
        
        const u = document.getElementById('uRef-input').value
        const p = document.getElementById('password-input').value
        var bodydata = {
            uRef: u,
            password: p
        }
        
        http.send(new URLSearchParams(bodydata))

        console.log("data attempt has been sent")
    }
})

//Validerar input
function validInput() {
    console.log("checking input validity");
    const uInput = document.getElementById('uRef-input');
    const pInput = document.getElementById('password-input');

    if (uInput !== null && pInput !== null) {
        let isValid = true;

        if (uInput.value.length < 1) {
            uInput.style.outline = "1px red solid";
            isValid = false;
        } else {
            uInput.style.outline = ""; // Reset outline if valid
        }

        if (!/^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pInput.value)) {
            pInput.style.outline = "1px red solid";
            isValid = false;
        } else {
            pInput.style.outline = ""; // Reset outline if valid
        }

        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(uInput.value) || /^\w+$/.test(uInput.value))) {
            uInput.style.outline = "1px red solid";
            isValid = false;
        } else {
            uInput.style.outline = ""; // Reset outline if valid
        }

        if (isValid) {
            console.log("valid input confirmed");
            return true;
        } else {
            return false;
        }
    } else {
        console.error("Could not find Elements");
    }
}