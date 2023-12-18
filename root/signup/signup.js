const feedback = document.getElementById("feedback") 

document.getElementById("submitter").addEventListener('submit', function(event){    
    event.preventDefault()
    if(validInput()){
        const http = new XMLHttpRequest()
        http.open("POST", "/signup")
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        
        http.onload = function(){
            if(http.status == 200){
                const u = document.getElementById('username-input')
                const n = document.getElementById('name-input')
                const e = document.getElementById('email-input')
                const p = document.getElementById('password-input')

                console.log(http.response)
                
                let res = JSON.parse(http.responseText)
                if(res.status == 400 && res.message == "Invalid uName"){
                    feedback.innerText = "Username contains invalid characters"
                    u.style.outline = "1px red solid"
                }
                if(res.status == 400 && res.message == "uName is already taken"){
                    feedback.innerText = "Username is already taken"
                    u.style.outline = "1px red solid"
                }
                if(res.status == 400 && res.message == "Invalid email address"){
                    feedback.innerHTML = "Invalid email address"
                    e.style.outline = "1px red solid"
                }
                if(res.status == 400 && res.message == "Mail is already taken"){
                    feedback.innerHTML = "Mail is already taken"
                    e.style.outline = "1px red solid"
                }
                if(res.status == 400 && res.message == "Name is too short"){
                    feedback.innerHTML = "Please input your real name"
                    n.style.outline = "1px red solid"
                }
                if(res.status == 400 && res.message == "Invalid password"){
                    feedback.innerHTML = "Password must contain at least one symbol and 8 characters"
                    p.style.outline = "1px red solid"
                }
                if(res.status == 403 && res.message == "Invalid password attempt"){
                    feedback.innerHTML = "You thought you could be funny and hack my site? Ha pathetic"
                    document.body.style.display = "none"
                }
                if(res.status == 200){
                    window.location.replace("/login/")
                }
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

