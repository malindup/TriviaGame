//Function the ensures HTML loads first
$(document).ready(function () {
	//Object
	const triviaGame = [{
		question: "Where do French fries originally come from?",
		options: ["USA", "Belgium", "France", "Germany"],
		answer: 1,
		photo1: "assets/images/belgium.jpg",
		photo2: "assets/images/fries.gif",
	}, {
		question: "This country has more pyramids than any other country",
		options: ["Mexico", "Egypt", "Peru", "Sudan"],
		answer: 3,
		photo1: "assets/images/pyramid.gif",
		photo2: "assets/images/pyramid1.gif",
	}, {
		question: "Where was the first sailing boats built?",
		options: ["Egypt", "England", "Greece", "Norway"],
		answer: 0,
		photo1: "assets/images/q3.gif",
		photo2: "assets/images/q3-1.gif",
	}, {
		question: "In which county is selling, importing or spitting out chewing gum illegal?",
		options: ["Australia", "South Africa", "Singapore", "North Korea"],
		answer: 2,
		photo1: "assets/images/q4.gif",
		photo2: "assets/images/q4-1.gif",
	}, {
		question: "This country follows the calendar which is 7 years behind the rest of the world",
		options: ["Madagascar", "Russia", "Kyrgyzstan", "Ethiopia"],
		answer: 3,
		photo1: "assets/images/q5.gif",
		photo2: "assets/images/q5-1.gif",
	}, {
		question: "Famous composer Wolfgang Amadeus Mozart was born in ...",
		options: ["Australia", "Austria", "France", "Netherlands"],
		answer: 1,
		photo1: "assets/images/q6.gif",
		photo2: "assets/images/q6-1.gif",
	}, {
		question: "Lake Baikal is the deepest lake in the world. Where is it located?",
		options: ["Canada", "Argentina", "Russia", "Indonesia"],
		answer: 2,
		photo1: "assets/images/q7.gif",
		photo2: "assets/images/q7-1.gif"
	}, {
		question: "What's the story of the statue of Liberty on Liberty Island in NYC",
		options: ["It was orgered from China and delivered by boat", "It was built by an American architect as a symbol of freedom", "It's a gift from france to the people of the USA", "Its a gift from Canada"],
		answer: 2,
		photo1: "assets/images/q8.gif",
		photo2: "assets/images/q8-1.gif",
	}];
	//Global Variables
	let correctGuess = 0;
	let incorrectGuess = 0;
	let unanswered = 0;
	let isRunning = false;
	let timer = 30;
	let intervalId;
	let userGuess = "";
	let qCount = triviaGame.length;
	let pick;
	let index;
	let emptyArray = [];
	let tempArray = [];
	const themeSong = new Audio("assets/audio/officetheme.mp3");
	const idiotTone = new Audio("assets/audio/dwight_idiot.wav");
	const goodJob = new Audio("assets/audio/goodjob.mp3");
	const scoreScreen = new Audio("assets/audio/scorescreen.mp3");
	const noPlease = new Audio("assets/audio/Unanswered.m4r");
//Appends the button that begins the game and plays the themesong
	let goBtn = $("<button>").html("<h2> Click here to begin </h2>");
	goBtn.attr("id", "goBtn");
	$("#answers-stats").append(goBtn);
	themeSong.play();
	//Function that begins the game
	$(goBtn).on("click", function () {
		goBtn.hide();
		countDown();
		displayQuestion();
		for (let i = 0; i < triviaGame.length; i++) {
			tempArray.push(triviaGame[i]);
		}
	})
	//Function that starts the timer 
	function countDown() {
		if (!isRunning) {
			intervalId = setInterval(decrement, 1000);
			isRunning = true;
		}
	}
	//Function that begins the countdown
	function decrement() {
		$("#time-remaining").html("<h3>Time Remaining: " + timer + "</h3>");
		timer--;
		//Stops the timer if it reaches 0
		if (timer === 0) {
			unanswered++;
			halt();
			$("#question-text").html("<h3> You didn't answer the question...</h3>");
			let idiotGif = $("<img>").attr("src", "assets/images/dwight.gif");
			$("#answers-stats").text("");
			$("#answers-stats").append(idiotGif);
			unansweredPic();
		}
	}
	//Function that stops the countDown, will be called multiple times.
	function halt() {
		isRunning = false;
		clearInterval(intervalId);
	}
	//Function that displays the question randomly based on whether it has been displayed or not
	function displayQuestion() {
		//Randomizes a position in the object's array
		index = Math.floor(Math.random() * triviaGame.length);
		//Associates the choice with the random position chosen above
		pick = triviaGame[index];
		//Appends the chosen question to the question-text div
		$("#question-text").html("<h3>" + pick.question + "</h3>");
		//Loops through the keys in the chosen position
		for (let i = 0; i < pick.options.length; i++) {
			//Assigns the user's guess to a dynamically created div
			let userGuess = $("<button>").attr("class", "userguess");
			//Appends each value as an h2 inside a newly created div
			userGuess.html("<h2>" + pick.options[i] + "</h2>");
			//Assigns a data-value to each key: value
			userGuess.attr("data-guessvalue", i);
			//Appends the newly created divs with each answer option into the answers-stats div
			$("#answers-stats").append(userGuess);
		}

		//Function that allows user to choose an answer and determines the outcome
		$(".userguess").on("click", function () {
			//Determines the array position of each userGuess option by converting it back to an integer temporarily
			userGuess = parseInt($(this).attr("data-guessvalue"));
			//If user guesses correctly
			if (userGuess === pick.answer) {
				//Stop the countDown
				halt();
				//Add to the correctGuess counter
				correctGuess++;
				//Temporarily empty the userGuess text
				userGuess = "";
				//Add congratulatory text to question-text div
				$("#question-text").html("<h3> Congrats! You're a genius </h3>");
				//Call correct guess picture function
				correctPic();
			} else {
				halt();
				incorrectGuess++;
				userGuess = "";
				$("#question-text").html("<h3> Nope, the correct answer is: " + pick.options[pick.answer] + "</h3>");
				incorrectPic();
			}
		})
	}
	//Function that hides photo and then displays if anwer is correct
	function correctPic() {
		goodJob.play();
		$("#answers-stats").html("<img src=" + pick.photo1 + ">");
		emptyArray.push(pick);
		/*Because index holds the randomly chosen question in the triviaGame object array, we erase the contents of it.
		We only need the start point of index, and the end point of 1 because there is only 1 value associated with the index variable at a time
		essentially just removing the value of the 0 position in this array to replace later.
		.splice researched here: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice"*/
		triviaGame.splice(index, 1);
		//Assigns variable to set timeout
		let hiddenPic = setTimeout(function () {
			$("#answers-stats").empty();
			timer = 30;
			//Check if game is over, and then displays the score screen
			if ((incorrectGuess + correctGuess + unanswered) === qCount) {
				scoreScreen.play();
				$("#time-remaining").empty();
				//Empty's the question-text div
				$("#question-text").empty();
				//Overrides question-text with:
				$("#question-text").html("<h3> Well, that's every of the time we have; here's how ya did: </h3>");
				//Appends correct, incorrect, and unanswered scores, appends reset button, and resets scores to zero, or continues the game
				$("#answers-stats").append("<h2> Correct: " + correctGuess + "</h2>");
				$("#answers-stats").append("<h2> Incorrect: " + incorrectGuess + "</h2>");
				$("#answers-stats").append("<h2> Unanswered: " + unanswered + "</h2>");
				let resetBtn = $("<button>").html("<h4> Play again? </h4>");
				resetBtn.attr("id", "reset");
				$("#answers-stats").append(resetBtn);
				correctGuess = 0;
				incorrectGuess = 0;
				unanswered = 0;
			} else {
				countDown();
				displayQuestion();
			}
		}, 1000 * 4);
	}
	//Function that hides photo and then displays if answer is incorrect
	function incorrectPic() {
		idiotTone.play();
		$("#answers-stats").html("<img src=" + pick.photo2 + ">");
		emptyArray.push(pick);
		/*Because index holds the randomly chosen question in the triviaGame object array, we erase the contents of it.
		We only need the start point of index, and the end point of 1 because there is only 1 value associated with the index variable at a time
		essentially just removing the value of the 0 position in this array to replace later.
		.splice researched here: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice"*/
		triviaGame.splice(index, 1);
		//Assigns variable to set timeout
		let hiddenPic = setTimeout(function () {
			$("#answers-stats").empty();
			timer = 30;
			//Check if game is over, and then displays the score screen
			if ((incorrectGuess + correctGuess + unanswered) === qCount) {
				scoreScreen.play();
				$("#time-remaining").empty();
				//Empty's the question-text div
				$("#question-text").empty();
				//Overrides question-text with:
				$("#question-text").html("<h3> Well, that's every of the time we have; here's how ya did: </h3>");
				//Appends correct, incorrect, and unanswered scores, appends reset button, and resets scores to zero, or continues the game
				$("#answers-stats").append("<h2> Correct: " + correctGuess + "</h2>");
				$("#answers-stats").append("<h2> Incorrect: " + incorrectGuess + "</h2>");
				$("#answers-stats").append("<h2> Unanswered... " + unanswered + "</h2>");
				let resetBtn = $("<button>").html("<h4> Play again? </h4>");
				resetBtn.attr("id", "reset");
				$("#answers-stats").append(resetBtn);
				correctGuess = 0;
				incorrectGuess = 0;
				unanswered = 0;
			} else {
				countDown();
				displayQuestion();
			}
		}, 1000 * 4);
	}
	//Function that hides photo then displays if question isn't answered
	function unansweredPic() {
		noPlease.play();
		const fail = $("<img>").attr("src", "assets/images/shakehead.gif");
		$("#answers-stats").html(fail);
		emptyArray.push(pick);
		/*Because index holds the randomly chosen question in the triviaGame object array, we erase the contents of it.
		We only need the start point of index, and the end point of 1 because there is only 1 value associated with the index variable at a time
		essentially just removing the value of the 0 position in this array to replace later.
		.splice researched here: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice"*/
		triviaGame.splice(index, 1);
		//Assigns variable to set timeout
		let hiddenPic = setTimeout(function () {
			$("#answers-stats").empty();
			timer = 30;
			//Check if game is over, and then displays the score screen
			if ((incorrectGuess + correctGuess + unanswered) === qCount) {
				scoreScreen.play();
				$("#time-remaining").empty();
				//Empty's the question-text div
				$("#question-text").empty();
				//Overrides question-text with:
				$("#question-text").html("<h3> Lets see how you did: </h3>");
				//Appends correct, incorrect, and unanswered scores, appends reset button, and resets scores to zero, or continues the game
				$("#answers-stats").append("<h2> Correct: " + correctGuess + "</h2>");
				$("#answers-stats").append("<h2> Incorrect: " + incorrectGuess + "</h2>");
				$("#answers-stats").append("<h2> Unanswered... " + unanswered + "</h2>");
				let resetBtn = $("<button>").html("<h4> Play again? </h4>");
				resetBtn.attr("id", "reset");
				$("#answers-stats").append(resetBtn);
				correctGuess = 0;
				incorrectGuess = 0;
				unanswered = 0;
			} else {
				countDown();
				displayQuestion();
			}
		}, 1000 * 4);
	}
	//Function that restarts the game, does not work, ignoring on-click event for some reason.
	$(document.body).on("click", "#reset", function () {
		$("#answers-stats").empty();
		$("#question-text").empty();
		for (let i = 0; i < tempArray.length; i++) {
			triviaGame.push(tempArray[i]);
		}
		countDown();
		displayQuestion();
	})

});