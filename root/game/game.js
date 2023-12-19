const radioButtons = document.querySelectorAll('input[name="number"]');
const playButton = document.getElementById("playButton");
const gameContainer = document.getElementById("gameCont")
const buttonContainer = document.getElementById("buttonCont")
const feedback = document.getElementById("feedback")
const rollButton = document.getElementById("roll")
const playAgainButton = document.getElementById("reset")

const dice1 = document.getElementById("dice1")
const dice2 = document.getElementById("dice2")
const scoreText = document.getElementById("score")
const rollText = document.getElementById("dieValues")

var score = 0

const timer = (ms) => new Promise(res => setTimeout(res, ms))

gameContainer.style.display = "none"
playAgainButton.disabled = true;
playAgainButton.style.display = "none"

var selectedRadio;
playButton.addEventListener("click", () =>{
    for(const button of radioButtons){
        if(button.checked){
            selectedRadio = button
            break
        }
    }

    document.getElementsByClassName("selected-number")[0].innerText = selectedRadio.value

    if(selectedRadio != null){
        gameContainer.style.display = "flex"
        buttonContainer.style.display = "none"

        dieRoll(dice1)
        dieRoll(dice2)

    }
    else{
        feedback.innerText = "Please select a number before pressing play"
        feedback.style.color = "red"
    }

})

rollButton.addEventListener("click", async () => {
    let [value1, value2] = await Promise.all([dieRoll(dice1), dieRoll(dice2)])
    value1 += 1
    value2 += 1

    score += value1 + value2
    rollText.innerText = `Dice: (${value1}:${value2})`
    scoreText.textContent = `Score: ${score} points`

    if((value1 + value2) == selectedRadio.value){
        rollButton.disabled = true;
        playAgainButton.disabled = false;
        const image = document.createElement("img")
        image.src = "./images/knockout.png"
        image.style.position = "absolute"
        image.style.top = "50%"
        image.style.left = "50%"
        image.style.transform = "translate(-50%, -50%)"
        document.body.appendChild(image)
        
        // Wait for 3 seconds before enabling the play again button
        await timer(3000);
        image.remove()
        playAgainButton.style.display = "flex";
        playAgainButton.addEventListener("click", resetGame);
    }
})

/**
 * 
 * @param {Element} dice element to animate
 */
async function dieRoll(dice){
    const faces = [
        "./images/dice/d1.png",
        "./images/dice/d2.png",
        "./images/dice/d3.png",
        "./images/dice/d4.png",
        "./images/dice/d5.png",
        "./images/dice/d6.png"
    ]    

    const rollDuration = 800 //time in miliseconds
    const frames = 50 // number of animation frames

    for(let i = 0; i < frames; i++){
        const progress = i / (frames - 1)
        const easing = Math.pow((1 - progress), 2)

        const frameIndex = Math.floor(easing * (faces.length - 1))
        const frame = faces[frameIndex]

        dice.src = frame

        const frameDuration = rollDuration / frames

        await timer(frameDuration)
    }

    const finalFace = Math.floor(Math.random() * faces.length)
    dice.src = faces[finalFace] 
    return finalFace
}

function resetGame(){
    gameContainer.style.display = "none"
    buttonContainer.style.display = "flex"
    rollButton.disabled = false;
    playAgainButton.disabled = true;
    score = 0
    scoreText.textContent = "Score: 0 points"
}