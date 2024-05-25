//https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple
const container = document.querySelector(".container")
const questions = document.getElementById("questions")
const answers = document.getElementById("answers")
const buttonstart = document.getElementById("start")
const buttonnext = document.getElementById("next")
let quentionslist = []
let currentQuestionIndex

axios.get(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`)
	.then((res) => {
		let apiquestions = res.data.results

		//apiquestions son las preguntas y respuestas en un array de lengt 10
	})
	.catch((err) => console.log(err))

function start() {
	buttonstart.classList.add("hide")
	buttonnext.classList.remove("hide")
	currentQuestionIndex = 0
	questions.classList.remove("hide")
	answers.classList.remove("hide")
}

function showquestions(item) {
	questions.innerText = item.question

	let array = []
	array.push(item.correct_answer)
	item.incorrect_answers.forEach((element) => {
		array.push(element)
	})
	array.forEach((awnser) => {
		const button = document.createElement("button")
		button.setAttribute("class", "btn btn-primary")
		button.innerHTML = awnser
	})
}

buttonnext.addEventListener("click", next)
buttonstart.addEventListener("click", start)

/* apiquestions.forEach((element) => {
			quentionslist.push(element)
		})
		return quentionslist */
