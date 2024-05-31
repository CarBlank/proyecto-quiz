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

let currentQuestionIndex
let questionsList

let date = new Date()
let horas = date.getHours()
let minutos = date.getMinutes()
let dia = date.getDay()
let mes = date.getMonth()
let aNos = date.getFullYear()
let date_hours = dia + "/" + mes + "/" + aNos + " a las: " + horas + ":" + minutos

let counter = 0

function seeresults() {
	contentResults.classList.remove("hide")
	contentResults.innerHTML = ""
	let resultArray = JSON.parse(localStorage.getItem("results")) || []
	for (let i = 0; i < resultArray.length; i++) {
		contentResults.innerHTML += `
			<li class="list-group-item d-flex justify-content-between align-items-center">
			${resultArray[i].date_hours}
				<span class="badge text-bg-primary rounded-pill">${resultArray[i].counter}</span>
			</li>
			`
	}
	var options = {
		chart: {
			type: "bar",
		},
		series: [
			{
				name: "sales",
				data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
			},
		],
		xaxis: {
			categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
		},
	}
	var chart = new ApexCharts(document.querySelector("#chart"), options)
	chart.render()
}

function resetQuiz() {
	startButton.classList.remove("hide")
	nextButton.classList.add("hide")
	finishButton.classList.add("hide")
	restartButton.classList.add("hide")
	cardGroup.classList.remove("hide")
	currentQuestionIndex = 0
	questions.classList.add("hide")
	answers.classList.add("hide")
	seeresults()
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
	/* contentResults.classList.add("hide") */
	restartButton.classList.add("hide")
	cardGroup.classList.add("hide")
	currentQuestionIndex = 0
	/* 	counter = 0 */
	questions.classList.remove("hide")
	answers.classList.remove("hide")
	setNextQuestion()
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

		button.addEventListener("click", selectresp)
		answers.appendChild(button)
	})
}

function setNextQuestion() {
	reset()
	showquestions(questionsList[currentQuestionIndex])
}

function setstatus(element) {
	if (element.dataset.correct) {
		element.classList.add("color-correct")
		element.classList.add("disable")
	} else {
		element.classList.add("color-wrong")
		element.classList.add("disable")
	}
}

function selectresp() {
	Array.from(answers.children).forEach((button) => {
		setstatus(button)
	})
	if (questionsList.length > currentQuestionIndex + 1) {
		nextButton.classList.remove("hide")
	} else {
		finishButton.classList.remove("hide")
		finishButton.addEventListener("click", resetQuiz)
		restartButton.classList.remove("hide")

		// LLAMAR A FUNCION DE LOCALSTORAGE
		saveDataLocalstorage()
		return (counter = 0)
	}
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
}

function savecorrectanswers() {
	counter = counter + 1
}

nextButton.addEventListener("click", setNextQuestion)
startButton.addEventListener("click", start)
restartButton.addEventListener("click", start)
