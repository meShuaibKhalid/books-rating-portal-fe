// Selecting DOM elements related to book image and upload
const bookImage = document.querySelector('#book_img img');
const bookImageUpload = document.getElementById('book_img_upload');
const uploadFileBtn = document.getElementById('upload_file_btn');
const addBookForm = document.getElementById('add_book_form');
const scanImageBtn = document.getElementById('scan_image');

// Array to store input elements
const inputElements = [];

// Base URLs for API endpoints
const booksBaseUrl = 'http://localhost:3000/books/addBook';
const uploadBaseUrl = 'http://localhost:3000/upload/book';
const getbooksBaseUrl = 'http://localhost:3000/books/getBooks';

// Variable to store the uploaded file
let uploadedFile = null;

// Initial book object structure
const bookObject = {
    bookId: null,
    title: '',
    author: '',
    image: '',
    abstract: '',
    publish_date: '',
    addedBy: Number(JSON.parse(localStorage.getItem('user'))?.id)
}

// Get user data from local storage
const user = JSON.parse(localStorage.getItem('user'));

// Event listener for the upload button
if (uploadFileBtn) uploadFileBtn.addEventListener('click', () => bookImageUpload.click());

// Function to handle file upload
async function onFileUpload(event) {
    event.preventDefault();
    // Get the uploaded file
    uploadedFile = event.target.files[0];
    if (uploadedFile) {
        // Display the uploaded image
        bookImage.src = URL.createObjectURL(uploadedFile);
        uploadFileBtn.blur();
    }
}

// Event listeners for input elements to update the book object and local storage
Object.keys(bookObject).forEach(key => {
    const events = ['change', 'keyup'];
    const inputEL = document.querySelector(`input[name=${key}]`);
    if (inputEL) inputElements.push(inputEL);

    events.forEach(event => {
        inputElements.forEach(el => {
            el.addEventListener(event, (evt) => {
                // Update the book object with input values
                bookObject[el.name] = evt.target.value;
                // Save the book object in local storage
                localStorage.setItem('book_obj', JSON.stringify(bookObject));
            });
        });
    });
});

// Event listener for the form submission
if (addBookForm) addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Call the AddBook function and handle the response
    AddBook().then(data => {
        // Save the updated book object in local storage
        localStorage.setItem('book_obj', JSON.stringify(data));
        // Upload the book avatar
        UploadBookAvatar();
    })
})

// Function to add a book by making a POST request to the server
async function AddBook() {
    return new Promise(async (resolve) => {
        // Make a POST request to the books API endpoint with bookObject data
        const response = await axios.post(booksBaseUrl, bookObject);
        if (response.status === 201) {
            // Resolve the promise with the response data
            resolve(response.data)
        }
    })
}

// Function to upload the book avatar/image
async function UploadBookAvatar() {
    const bookID = JSON.parse(localStorage.getItem('book_obj'))?.id;
    const formData = new FormData();
    formData.append('file', uploadedFile);
    // Make a POST request to upload the book avatar/image
    await axios.post(`${uploadBaseUrl}/${bookID}`, formData);
}

// Function to get books associated with the user
async function getBooks() {
    return new Promise(async (resolve) => {
        // Make a GET request to the getBooks API endpoint
        const response = await axios.get(`${getbooksBaseUrl}/${user.id}`);
        if (response.status === 200) {
            // Resolve the promise with the response data
            resolve(response.data);
        }
    })
}

// Execute code when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Remove 'book_obj' from local storage
    localStorage.removeItem('book_obj');
    // Fetch books and update the HTML table
    getBooks().then(data => {
        let str_body = "";
        data.forEach(r => {
            const imageSrc = r.image ? r.image : 'assets/img/logo.png';
            // Build HTML for each book
            str_body += `
                <div class="col-md-3 mb-2">
                    <div class="card" onclick="navigate(${r.id})">
                        <div class="explore-page-image-container-card bg-light">
                            <img class="card-img-top" src="${imageSrc}" alt="Card image cap" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title" title="${r.title}">
                                ${r.title}
                            </h5>
                            <h6 class="card-subtitle my-1" title="${r.title}">
                            Nom de l'auteur: <span class='text-muted'>${r.author}</span>
                            </h6>
                            <p class="card-text mb-0">
                                ${r.abstract}
                            </p>
                            <a class="card-link">Voir les détails</a>
                        </div>
                    </div>
                </div>`;
        });
        // Update the HTML with the generated book cards
        $("#tableData").html(str_body);
    });
});

// Event listener for the scan image button (works only for smartphones)
if (scanImageBtn) scanImageBtn.addEventListener('click', () => document.getElementById('capture_image').click());

// Function to navigate to the book details page
function navigate(bookID) {
    // Set the route in local storage and redirect to the book details page
    localStorage.setItem('route', String(bookID));
    window.location.href = 'book-details.html';
}
