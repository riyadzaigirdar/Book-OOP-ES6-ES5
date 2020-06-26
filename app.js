

function Book(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
}


function UI() {

}

UI.prototype.list = function (book) {
    const bookList = document.getElementById('book-list')

    bookList.innerHTML += `<tr>
    <td>${book.title}</td>
    <td>${book.author}</td>
   <td>${book.isbn}</td>
   <td class='delete'>X</td>
    </tr>`

    /*Event listener for delete (cross)
    document.getElementById('book-list').addEventListener('click', function (e) {
        e.preventDefault()
        const target = e.target
        console.log(target)
    })*/

    const deleteBtn = document.querySelectorAll('.delete')

    deleteBtn.forEach(item => {
        item.addEventListener('click',
            function (e) {
                e.preventDefault()
                const target = e.target
                target.parentElement.remove()
                // remove from local storage
                const store = new Store()
                store.removeBooks(target)

            })
    })

}
function Store() {

}

Store.prototype.getBooks = function () {
    let books;
    if (localStorage.getItem('books') == null) {
        books = []
    } else {
        books = JSON.parse(localStorage.getItem('books'))
    }
    return books
}

Store.prototype.displayBooks = function () {
    let books = this.getBooks()

    books.forEach(function (book) {
        const ui = new UI()
        ui.list(book)
    })
}

Store.prototype.addBooks = function (book) {
    let books = this.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
}

Store.prototype.removeBooks = function (target) {
    let isbn = target.previousElementSibling.textContent
    const books = this.getBooks()
    for (var i in books) {
        if (books[i].isbn == isbn) {
            books.splice(i, 1)
        }
    }
    localStorage.setItem('books', JSON.stringify(books))
}

// Alert message for succes and error
function showAlert(message, classname) {
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

// Event listener for submit button
document.getElementById('book-form').addEventListener('submit', function (e) {
    e.preventDefault()
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value

    if (title === '' | author === 'author' | isbn === '') {
        showAlert('please fill in the form', 'error')
    } else {
        const obj = new Book(title, author, isbn)
        //add book in local storage
        const store_obj = new Store()
        store_obj.addBooks(obj)
        // add book in UI
        const ui = new UI()
        ui.list(obj)
        showAlert('book added', 'success')
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
    }
})

const store_obj = new Store()
document.addEventListener('DomContentLoader', store_obj.displayBooks())

