import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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
    books = inputEl.value
    push(booksInDB, books)
    clearInputValue()
    
})

onValue(booksInDB, function(snapshot) {
    let booksArray = Object.values(snapshot.val())
    clearRenderBooks()

    for (let i = 0; i < booksArray.length; i++) {
        let currentBook = booksArray[i]
        renderBooks(currentBook)
    }
})


function clearInputValue() {
    inputEl.value = ""
}

function renderBooks(bookValue) {
    ulEl.innerHTML += `<li> ${bookValue} </li>`
}

function clearRenderBooks() {
    ulEl.innerHTML = ""
}