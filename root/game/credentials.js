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
                    
                    nameText.innerText = resName
                }
                
            } else {
                console.error("Error: " + http.status);
                console.error(http.responseText);
            }
        }
        http.send()
    }
    // else{
    //     window.location.replace("/login/")
    // }
})