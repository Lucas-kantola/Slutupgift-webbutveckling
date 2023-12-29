//manu varaiables
const radioButtons = document.querySelectorAll('input[name="number"]');
const playButton = document.getElementById("playButton");
const gameContainer = document.getElementById("gameCont")
const buttonContainer = document.getElementById("buttonCont")
const feedback = document.getElementById("feedback")
const combinedValues = document.getElementById("combinedValues")

//dice and game variables
const dice1 = document.getElementById("dice1")
const dice2 = document.getElementById("dice2")
const scoreText = document.getElementById("score")
const rollText = document.getElementById("dieValues")
const rollButton = document.getElementById("roll")
const playAgainButton = document.getElementById("reset")

//values for the game
var score = 0
const rollDuration = 800; // Time in milliseconds for rolling animation

//clock for later uses
const timer = (ms) => new Promise(res => setTimeout(res, ms))

//setting defaults 
gameContainer.style.display = "none"
playAgainButton.disabled = true;
playAgainButton.style.display = "none"

//defining defaults
var selectedRadio;
var rolling;
var gameLost; 

//reading the radio buttons
playButton.addEventListener("click", () =>{
    for(const button of radioButtons){
        if(button.checked){
            selectedRadio = button
            break
        }
    }

    document.getElementsByClassName("selected-number")[0].innerText = "Your KnockOut number is " + selectedRadio.value

    if(selectedRadio != null){
        gameContainer.style.display = "flex"
        buttonContainer.style.display = "none"
    }
    else{
        feedback.innerText = "Please select a number before pressing play"
        feedback.style.color = "red"
    }

})


//rullar och kollar för förlust => display knockout
rollButton.addEventListener("click", async () => {
    if (!rolling) {     
        let [value1, value2] = await Promise.all([dieRoll(dice1), dieRoll(dice2)])
        value1 += 1
        value2 += 1
    
        console.log(value1 + value2);
        console.log(selectedRadio.value);
        console.log((value1 + value2) == selectedRadio.value);
        score += value1 + value2
        rollText.innerText = `Dice: ${value1} : ${value2}`
        combinedValues.innerText = `Roll Score: ${value1 + value2}`
        scoreText.textContent = `Score: ${score} points`
    
        if((value1 + value2) == selectedRadio.value || gameLost){
            gameLost = true
            rollButton.disabled = true;
            playAgainButton.disabled = false;
            let audioPlayer = new Audio("./sounds/GameOver.mp3")
            await timer(500)
            audioPlayer.play()
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
    }
})

/**
 * 
 * @param {Element} dice element to animate
 */
async function dieRoll(dice) {
    rollButton.disabled = true
    rolling = true
    const faces = [
        "./images/dice/d1.png",
        "./images/dice/d2.png",
        "./images/dice/d3.png",
        "./images/dice/d4.png",
        "./images/dice/d5.png",
        "./images/dice/d6.png"
    ];
    const sounds = [
        "./sounds/1.mp3",
        "./sounds/2.mp3"
    ]
    const rollSound = Math.floor(Math.random() * 2)
    let audioPlayer = new Audio(sounds[rollSound])
    audioPlayer.play()

    // Randomize final faces
    const finalFace = Math.floor(Math.random() * faces.length);

    dice.style.transition = 'transform 0.5s'; // Set a transition for smoother animation

    for (let i = 0; i < 20; i++) { // Reduce frames for a smoother transition
        const frameIndex = Math.floor(Math.random() * faces.length);
        const frame = faces[frameIndex];
        dice.src = frame;

        const rotation = Math.random() * 30 - 15; // Random rotation within -10 to 10 degrees
        const scale = 0.85 + Math.random() * 0.4; // Random scale between 0.9 to 1.1

        dice.style.transform = `rotate(${rotation}deg) scale(${scale})`;

        await timer(rollDuration / 20); // Adjust timing for fewer frames
    }

    dice.src = faces[finalFace];
    dice.style.transform = 'none'; // Reset transform

    rolling = false;
    rollButton.disabled = false
    return finalFace;
}

/**
 * Resets the games containers and buttons 
 */
function resetGame(){
    gameContainer.style.display = "none"
    buttonContainer.style.display = "flex"
    rollButton.disabled = false;
    playAgainButton.disabled = true;
    score = 0
    gameLost = false
    scoreText.textContent = "Score: 0 points"
}