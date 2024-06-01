//https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple
const container = document.querySelector(".container")
const cardGroup = document.getElementById("card-group")
const questions = document.getElementById("questions")
const answers = document.getElementById("answers")
const startButton = document.getElementById("start")
const restartButton = document.getElementById("restart")
const nextButton = document.getElementById("next")
const finishButton = document.getElementById("finish")
const contentResults = document.getElementById("results")
const scoreCard = document.querySelector(".printscore")
const printresulth1 = document.getElementById("print")
const chartresults = document.getElementById("chart")

let currentQuestionIndex
let questionsList

let date = new Date()
let hours = date.getHours()
let minutes = date.getMinutes()
let day = date.getDay()
let month = date.getMonth()
let year = date.getFullYear()
let date_hours = day + "/" + month + "/" + year + " - " + hours + ":" + minutes
let arraydata = []
let arraydates = []
let counter = 0
var options = {
	chart: {
		type: "bar",
	},
	series: [
		{
			name: "Scores",
			data: arraydata,
		},
	],
	xaxis: {
		categories: arraydates,
	},
}

function showResults() {
	contentResults.classList.remove("hide")
	contentResults.innerHTML = ""

	let resultArray = JSON.parse(localStorage.getItem("results")) || []

	resultArray.forEach((n) => {
		arraydata.push(n.counter)
		arraydates.push(n.date_hours)
	})
	chart.render()
	for (let i = 0; i < resultArray.length; i++) {
		contentResults.innerHTML += `
			<li class="list-group-item d-flex justify-content-between align-items-center">
			${resultArray[i].date_hours}
				<span class="badge text-bg-primary rounded-pill">${resultArray[i].counter}</span>
			</li>
			`
	}
	printresulth1.innerText = ""

	chartresults.classList.remove("hide")
}

function resetQuiz() {
	startButton.classList.remove("hide")
	nextButton.classList.add("hide")
	finishButton.classList.add("hide")
	restartButton.classList.add("hide")
	cardGroup.classList.remove("hide")
	scoreCard.classList.add("hide")
	currentQuestionIndex = 0
	questions.classList.add("hide")
	answers.classList.add("hide")
	chartresults.innerHTML = ""
	arraydata.length = 0
	arraydates.length = 0
	showResults()
}

function saveDataLocalstorage() {
	const data = {date_hours, counter}

	let resultArray = JSON.parse(localStorage.getItem("results")) || []
	resultArray.push(data)

	localStorage.setItem("results", JSON.stringify(resultArray))
}

axios.get(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`)
	.then((res) => {
		questionsList = res.data.results

		return questionsList
		//questionslist.results son las preguntas y respuestas en un array de length 10
	})
	.catch((err) => console.log(err))

function start() {
	startButton.classList.add("hide")
	nextButton.classList.remove("hide")
	finishButton.classList.add("hide")
	chartresults.classList.add("hide")
	scoreCard.classList.add("hide")
	restartButton.classList.add("hide")
	cardGroup.classList.add("hide")
	currentQuestionIndex = 0
	/* 	counter = 0 */
	questions.classList.remove("hide")
	answers.classList.remove("hide")
	setNextQuestion()
	printresulth1.innerText = ``
}

function showquestions(item) {
	questions.innerText = item.question

	let array = []

	//añadir la respuesta correcta de la API con una propiedad "Correct" para identificarla
	const truearray = {
		correct: `${item.correct_answer}`,
	}
	array.push(truearray)

	//añadir las respuestas incorrectas de la API con una propiedad "incorrect" para identificarlas (Vienen las 3 juntas por lo que hay que separar con foreach)
	item.incorrect_answers.forEach((element) => {
		let falsearray = {
			incorrect: `${element}`,
		}

		array.push(falsearray)
	})

	//creamos funcion para desordenar el array
	array.sort(function () {
		return Math.random() - 0.5
	})

	//recorrremos el array para crear un boton por cada uno, con sus respectivas clases de estilos y le agregamos el atributo "Dataset: true"
	//a la respuesta que hemos identificado como "correct"
	array.forEach((arr) => {
		const button = document.createElement("button")
		button.setAttribute("class", "btn btn-primary")
		button.innerHTML = arr.correct || arr.incorrect
		if (arr.correct) {
			button.dataset.correct = true
			button.addEventListener("click", savecorrectanswers)
		}

		button.addEventListener("click", selectAnswer)
		answers.appendChild(button)
	})
}

function setNextQuestion() {
	reset()
	showquestions(questionsList[currentQuestionIndex])
}

function setStatus(element) {
	if (element.dataset.correct) {
		element.classList.add("color-correct")
		element.classList.add("disable")
	} else {
		element.classList.add("color-wrong")
		element.classList.add("disable")
	}
}

function selectAnswer() {
	Array.from(answers.children).forEach((button) => {
		setStatus(button)
	})
	if (questionsList.length > currentQuestionIndex + 1) {
		nextButton.classList.remove("hide")
	} else {
		setTimeout(function () {
			printScore()
		}, 3000)
	}
}

function printScore() {
	answers.classList.add("hide")
	questions.classList.add("hide")
	scoreCard.classList.remove("hide")
	restartButton.classList.remove("hide")
	finishButton.classList.remove("hide")
	finishButton.addEventListener("click", resetQuiz)

	printresult(counter)
	saveDataLocalstorage()
	return (counter = 0)
}

next.addEventListener("click", () => {
	currentQuestionIndex++
	setNextQuestion()
})

function reset() {
	nextButton.classList.add("hide")
	while (answers.firstChild) {
		answers.removeChild(answers.firstChild)
	}
	printresulth1.innerText = ``
}

function savecorrectanswers() {
	counter = counter + 1
}

function printresult(resultchart) {
	printresulth1.innerText = `Your score is ${resultchart}/10!`
}

var chart = new ApexCharts(document.querySelector("#chart"), options)
nextButton.addEventListener("click", setNextQuestion)
startButton.addEventListener("click", start)
restartButton.addEventListener("click", start)
