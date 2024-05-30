//https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple
const container = document.querySelector(".container")
const questions = document.getElementById("questions")
const answers = document.getElementById("answers")
const buttonstart = document.getElementById("start")
const buttonnext = document.getElementById("next")
const contentresults = document.getElementById("Resultados")
let currentQuestionIndex
let questionslist

function results(key, element) {
	let arrayResults = JSON.parse(localStorage.getItem(key)) || []
	arrayResults.push(element)
	localStorage.setItem("ejerciciocarlotaarnold", JSON.stringify(arrayResults))
	console.log(arrayResults)

	const datatitle = arrayResults.map((item) => item.date_hours)
	console.log(datatitle)
	/* let date_hours = new Date()
	localStorage.setItem(date_hours, JSON.stringify(counter))
	arrayResults.push(date_hours) */

	/* contentresults.innerHTML += `<p>${LOCALSTORAGE}</p>` */
}
/* 
arrayResults.forEach((data) => {
	results(data)
}) */

axios.get(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`)
	.then((res) => {
		questionslist = res.data.results

		// questionslist.push(res.data.results)
		return questionslist
		//questionslist.results son las preguntas y respuestas en un array de lengt 10
	})
	.catch((err) => console.log(err))

function start() {
	buttonstart.classList.add("hide")
	buttonnext.classList.remove("hide")
	currentQuestionIndex = 0
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
	showquestions(questionslist[currentQuestionIndex])
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
	if (questionslist.length > currentQuestionIndex + 1) {
		buttonnext.classList.remove("hide")
	} else {
		// LLAMAR A FUNCION DE LOCALSTORAGE
		buttonstart.classList.remove("hide")
		buttonstart.innerText = "Restart"
		return (counter = 0)
	}
}

next.addEventListener("click", () => {
	currentQuestionIndex++
	setNextQuestion()
})

function reset() {
	buttonnext.classList.add("hide")
	while (answers.firstChild) {
		answers.removeChild(answers.firstChild)
	}
}
let counter = 0
function savecorrectanswers() {
	counter = counter + 1

	return counter
}

buttonnext.addEventListener("click", setNextQuestion)
buttonstart.addEventListener("click", start)
