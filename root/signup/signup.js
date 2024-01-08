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

function validInput() {
    console.log("checking input validity");
    const uInput = document.getElementById('username-input');
    const nInput = document.getElementById('name-input');
    const eInput = document.getElementById('email-input');
    const pInput = document.getElementById('password-input');
    const feedback = document.getElementById('feedback');

    if (uInput !== null && nInput !== null && eInput !== null && pInput !== null && feedback !== null) {
        let isValid = true;

        if (uInput.value.length < 1) {
            uInput.style.outline = "1px red solid";
            feedback.innerText = "Please enter a username";
            isValid = false;
        } else {
            uInput.style.outline = ""; // Reset outline if valid
        }

        if (nInput.value.length < 1) {
            nInput.style.outline = "1px red solid";
            feedback.innerText = "Please enter your name";
            isValid = false;
        } else {
            nInput.style.outline = ""; // Reset outline if valid
        }

        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(eInput.value))) {
            eInput.style.outline = "1px red solid";
            feedback.innerText = "Invalid email address";
            isValid = false;
        } else {
            eInput.style.outline = ""; // Reset outline if valid
        }

        if (!/^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pInput.value)) {
            pInput.style.outline = "1px red solid";
            feedback.innerText = "Password must contain at least one symbol and be 8 characters long";
            isValid = false;
        } else {
            pInput.style.outline = ""; // Reset outline if valid
        }

        if (isValid) {
            feedback.innerText = ""; // Reset feedback if all inputs are valid
            console.log("valid input confirmed");
            return true;
        } else {
            return false;
        }
    } else {
        console.error("Could not find Elements");
    }
}