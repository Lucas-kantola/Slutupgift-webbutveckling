const radioButtons = document.querySelectorAll('input[name="number"]');
const playButton = document.getElementById("playButton");

var selectedRadio;
playButton.addEventListener("click", () =>{
    for(const button of radioButtons){
        if(button.checked){
            selectedRadio = button
            break
        }
    }
    console.log(selectedRadio);
})