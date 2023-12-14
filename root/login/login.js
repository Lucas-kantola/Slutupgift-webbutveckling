function getCookie(cname){
    console.log("getting COokie");
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

document.addEventListener("DOMContentLoaded", function(){
    if(getCookie("session-token") != ""){
        console.log("sending cookie");
        const http = new XMLHttpRequest()
        http.open("GET", "/welback")
        http.onload = function(){
            if(http.status == 200){
                console.log("User authenticated successfully");
                console.log(http.responseText);
            } else {
                console.error("Error: " + http.status);
                console.error(http.responseText);
            }
        }
        http.send()

    }

})

document.getElementById('login').addEventListener('click', function(event){    
    if(validInput()){
        console.log("input valid");
        const http = new XMLHttpRequest()
        http.open("POST", "/login")
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        
        http.onload = function(){
            
            if(http.status == 200){
                document.location.href = "http://localhost:8080/game"
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

function validInput(){
    console.log("checking input validity");
    const u = document.getElementById('uRef-input').value
    const p = document.getElementById('password-input').value

    if(u != null && p != null){
        if(u.length >= 1 && 
        /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(p) &&
        (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(u) || /^\w+$/.test(u))){
                console.log("valid input confirmed")
                return true
            }
        else {
            //FIXUp this abit in the future
            return false
        }
        
    }
    else{
        console.error("Could not find Elements")
    }
}

function redSign(){
    document.location.href = "http://127.0.0.1:8080/signup/"
}

