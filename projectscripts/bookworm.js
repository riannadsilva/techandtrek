import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://bookworm-7b1aa-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const booksInDB = ref(database, "books")

const btnEl = document.getElementById("btn-el")
const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")

let books = []

btnEl.addEventListener("click", function() {
    console.log(inputEl.value)
    books = inputEl.value
    ulEl.innerHTML += `<li> ${books} </li>`

    inputEl.value = ""

    push(booksInDB, books)
})


