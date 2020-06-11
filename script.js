// Parse through existing localStorage items, or set as empty array if none
var userNames = JSON.parse(localStorage.getItem("User"))|| [];
var userScores = JSON.parse(localStorage.getItem("Score"))|| [];

// Variables to assess quiz progression & assess remaining time limit 
var currentQuestion = 0;
var timerCount = 0;

// Various DOM API elements for dynamic interfacing
var userLengthInput = document.getElementById("lengthInput");
var userNameInput = document.getElementById("testee");
const intro = document.getElementById("explanation");
const quizForm = document.getElementById("quizMaterial");
const quizQuestion = document.getElementById("questionText");
const resultTab = document.getElementById("resultsContainer");

// Assign variables to html div's containing questionnaire
var totalQ = questions.length
var choiceA = document.getElementById("choice1");
var choiceB = document.getElementById("choice2");
var choiceC = document.getElementById("choice3");
var choiceD = document.getElementById("choice4");

// Constant button variable assignment
const submitBtn = document.getElementById("answerSubmit");
const startBtn = document.getElementById("startButton");
const restartBtn = document.getElementById("restartButton");
const resetBtn = document.getElementById("resetButton");

// Begin function; called by eventlistener
function begin(){
    testLength = parseInt(userLengthInput.value);
    timerCount = testLength;
    userName = userNameInput.value;
    userNames.push(userName);
    var JSONreadyNames = JSON.stringify(userNames);
    localStorage.setItem("User", JSONreadyNames);      
    $(intro).hide();
    $(quizForm).fadeIn()
}
// Reload page to restart quiz while maintaing saved High Scores
function restart(){
    location.reload();
}

// Clear localStorage cache
function reset(){
    alert("The scoreboard will be cleared after your next quiz attempt")
    localStorage.removeItem("User");
    localStorage.removeItem("Score");
}

// Basic Timer function to serve as exam proctor
function timer(){
    timerCount = timerCount -1;
    var proctor = document.getElementById("proctorSays");
    if (timerCount < testLength){
        proctor.textContent = timerCount
    }
    if (timerCount < 1){
        window.clearInterval(update)
        alert("Sorry, you have run out of time on this attempt.");
        compileScores();
        $(resultTab).fadeIn();

        
    }
}
update = setInterval("timer()", 1000);

// Timer stop function, called on completion of test
function stopTime() {
    clearInterval(update);
  }

// convert array contents into questionnaire form using API/some jQuery
function compileCurrent(questionIndex){
    var q = questions[questionIndex];
    quizQuestion.textContent = (questionIndex + 1) + `.${q.question}`;
    choiceA.textContent = q.choice1
    choiceB.textContent = q.choice2
    choiceC.textContent = q.choice3
    choiceD.textContent = q.choice4
}

// Dynamically manipulate Highscore <table>
function compileScores(){
    var userArr = JSON.parse(localStorage.getItem("User"));
    var scoreArr = JSON.parse(localStorage.getItem("Score"));
    var tableRef = document.getElementById("finalScores");

    for (i = 0; i < userArr.length; i++){
        var newScore = tableRef.insertRow();
        var userCell = newScore.insertCell(0);
        var scoreCell = newScore.insertCell(1);
        
        userCell.textContent = userArr[i];
        scoreCell.textContent = scoreArr[i];
    };
    
};

// Upon passing a valid response, function will mark tester's place in quiz and assess completion
function compileNext(){
    var userBtnChoice = document.querySelector("input[type=radio]:checked");
    
    if (!userBtnChoice){
        alert("You need to select answers to pass this test.");
        return;
    }
    var userChoice = userBtnChoice.value;
    
    if(questions[currentQuestion].answer == userChoice){
        console.log("Correct");
    }else{
        timerCount -= 10;
    }
    
    // Prevent user from accidentally "spam" clicking, although disabling this was helpful for testing
    userBtnChoice.checked = false;
    currentQuestion++;
    if(currentQuestion == totalQ){
        $(quizForm).hide();
        stopTime()
        

        userScores.push(timerCount);
        var JSONreadyScores = JSON.stringify(userScores);
        localStorage.setItem("Score", JSONreadyScores);
        
        compileScores();
        $(resultTab).fadeIn();
        return;
    }
    compileCurrent(currentQuestion);
}
compileCurrent(currentQuestion)

// EventListeners
startBtn.addEventListener("click",begin);
submitBtn.addEventListener("click",compileNext);
restartBtn.addEventListener("click",restart);
resetBtn.addEventListener("click",reset);
