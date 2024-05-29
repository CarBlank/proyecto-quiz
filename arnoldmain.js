//https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple
const container = document.querySelector(".container")
const questions = document.getElementById("questions")
const answers = document.getElementById("answers")
const buttonstart = document.getElementById("start")
const buttonnext = document.getElementById("next")
let questionslist = []
let currentQuestionIndex

axios.get(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`)
	.then((res) => {
		questionslist.push(res.data.results)
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
		}
		button.addEventListener("click", selectresp)
		answers.appendChild(button)
	})
}

function setNextQuestion() {
	reset()
	setTimeout(() => {
		questionslist = questionslist[0]
		showquestions(questionslist[currentQuestionIndex])
	}, 300)
}

function setstatus(element) {
	if (element.dataset.correct) {
		element.classList.add("color-correct")
	} else {
		element.classList.add("color-wrong")
	}
}

function selectresp() {
	Array.from(answers.children).forEach((button) => {
		setstatus(button)
	})
	if (questionslist.length > currentQuestionIndex + 1) {
		next.classList.remove("hide")
	} else {
		start.innerText = "Restart"
		start.classList.remove("hide")
	}
}

next.addEventListener("click", () => {
	currentQuestionIndex++
	setNextQuestion()
})

function reset() {
	next.classList.add("hide")
	while (answers.firstChild) {
		answers.removeChild(answers.firstChild)
	}
}

buttonnext.addEventListener("click", setNextQuestion)
buttonstart.addEventListener("click", start)
