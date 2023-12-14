document.getElementById("submitter").addEventListener('submit', function(event){    
    event.preventDefault()
    if(validInput()){
        const http = new XMLHttpRequest()
        http.open("POST", "/signup")
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        
        http.onload = function(){
            if(http.status == 200){
                console.log("Data sent successfully")
            }
            else{
                console.error("Error: " + http.status)
                console.error(http.responseText)
            }
        }
        
        const u = document.getElementById('username-input').value
        const n = document.getElementById('name-input').value
        const e = document.getElementById('email-input').value
        const p = document.getElementById('password-input').value
        console.log(u, n, e, p);
        var bodydata = {
            uName: u,
            name: n,
            mail: e,
            password: p
        }
        
        
        http.send(new URLSearchParams(bodydata))

        console.log("data attempt has been sent")
    }
})

function validInput(){
    const u = document.getElementById('username-input').value
    const n = document.getElementById('name-input').value
    const e = document.getElementById('email-input').value
    const p = document.getElementById('password-input').value

    console.log(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(p));
    console.log(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e));

    if(u != null && n != null && p != null && e != null){
        if(u.length >= 1 && n.length >= 1 && 
        /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(p) &&
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e)){
                console.log("valid input confirmed")
                return true
            }
        else {
            console.log("invalid input")
            //FIXUp this abit in the future
            return false
        }
        
    }
    else{
        console.error("Could not find Elements")
    }
}

