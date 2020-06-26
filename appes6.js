class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

class UI extends Book {
    constructor(title, author, isbn) {
        super(title, author, isbn)
    }
    //create book
    createBook() {
        const bookList = document.getElementById('book-list')
        bookList.innerHTML += `<tr>
                                                    <td>${this.title}</td>
                                                     <td>${this.author}</td>
                                                    <td>${this.isbn}</td>
                                                    <td class='delete'>X</td>
                                                    </tr>`
        this.clearElement()
        this.showAlert('Book Created', 'success')
    }
    // delete book
    deleteBook(target) {
        if (target.className == 'delete') {
            target.parentElement.remove()
            this.showAlert('book deleted', 'success')
        }

    }
    //show alert
    showAlert(message, classname) {
        const error = document.createElement('div')
        error.className = `alert ${classname}`
        error.appendChild(document.createTextNode(message))

        const parent = document.getElementsByClassName('container')[0]
        const child = document.getElementById('book-form')
        parent.insertBefore(error, child)
        setTimeout(function () {
            error.remove()
        }, 3000)
    }
    //clear element
    clearElement() {
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
    }
}

class Store {
    static getBook() {
        let books
        if (localStorage.getItem('books') == null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }
    static displayBook() {
        let books = Store.getBook()

        books.forEach(function (book) {
            const ui = new UI(book.title, book.author, book.isbn)
            ui.createBook()
        })
    }
    static addBook(book) {
        const books = Store.getBook()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }
    static removeBook(isbn) {
        let books = Store.getBook()
        books.forEach(function (book, index) {
            if (book.isbn == isbn) {
                console.log(isbn)
                books.splice(index, 1)
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }
}

// store content loader listener
document.addEventListener('DomContentLoader', Store.displayBook())
// form submit  event listener
document.getElementById('book-form').addEventListener('submit', function (e) {
    e.preventDefault()
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value

    const ui = new UI(title, author, isbn)
    if (title === '' | author === 'author' | isbn === '') {
        ui.showAlert('please fill in the form', 'error')
    } else {
        Store.addBook(ui)
        ui.createBook()
    }
})

document.getElementById('book-list').addEventListener('click', function (e) {
    e.preventDefault()
    const ui = new UI()
    ui.deleteBook(e.target)
    Store.removeBook(e.target.previousElementSibling.textContent)
})