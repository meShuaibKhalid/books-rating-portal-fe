const bookImage = document.querySelector('#book_img img');
const bookImageUpload = document.getElementById('book_img_upload');
const uploadFileBtn = document.getElementById('upload_file_btn');
const addBookForm = document.getElementById('add_book_form');

const inputElements = [];
const booksBaseUrl = 'http://localhost:3000/books/addBook';
const uploadBaseUrl = 'http://localhost:3000/upload/book';
const getbooksBaseUrl = 'http://localhost:3000/books/getBooks';
let uploadedFile = null;
const bookObject = {
    bookId: null,
    title: '',
    author: '',
    image: '',
    abstract: '',
    publish_date: '',
    addedBy: Number(JSON.parse(localStorage.getItem('user'))?.id)
}

localStorage.removeItem('book_obj');

if (uploadFileBtn) uploadFileBtn.addEventListener('click', () => bookImageUpload.click());

async function onFileUpload(event) {
    event.preventDefault();
    uploadedFile = event.target.files[0];
    if (uploadedFile) {
        bookImage.src = URL.createObjectURL(uploadedFile);
        uploadFileBtn.blur();
    }
}

Object.keys(bookObject).forEach(key => {
    const events = ['change', 'keyup'];
    const inputEL = document.querySelector(`input[name=${key}]`);
    if (inputEL) inputElements.push(inputEL);

    events.forEach(event => {
        inputElements.forEach(el => {
            el.addEventListener(event, (evt) => {
                bookObject[el.name] = evt.target.value;
                localStorage.setItem('book_obj', JSON.stringify(bookObject));
            });
        });
    });
});

if (addBookForm) addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    AddBook().then(data => {
        localStorage.setItem('book_obj', JSON.stringify(data));
        UploadBookAvatar();
    })
})


async function AddBook() {
    return new Promise(async (resolve) => {
        const response = await axios.post(booksBaseUrl, bookObject);
        if (response.status === 201) {
            resolve(response.data)
        }
    })
}

async function UploadBookAvatar() {
    const bookID = JSON.parse(localStorage.getItem('book_obj'))?.id;
    const formData = new FormData();
    formData.append('file', uploadedFile);
    await axios.post(`${uploadBaseUrl}/${bookID}`, formData);
}

async function getBooks() {
    return new Promise(async (resolve) => {
        const response = await axios.get(getbooksBaseUrl);
        console.log(response);
        if (response.status === 200) {
            resolve(response.data)
        }
    })
}
