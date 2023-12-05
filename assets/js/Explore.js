// Selecting the best seller section and setting its initial display to none
const bestSellerSection = document.getElementById("best_sellers");
bestSellerSection.style.display = 'none';

// Selecting the best seller title, city from local storage, and search bar
const bestSellerTitle = document.getElementById("best_seller_title");
const city = localStorage.getItem("best_seller_city");
const search_bar = document.getElementById("search_bar");

// Array to store book data
let books = [];

// Base URLs for API endpoints
const getBestSellerBaseUrl = 'http://localhost:3000/best-seller/getBestSeller';
const getBooksBaseUrl = 'http://localhost:3000/books/getBooks';

// Set the title of the best seller section based on the city
if (city) bestSellerTitle.innerHTML = city ? `Best Sellers in ${city}` : "Best Sellers";

// Function to fetch best sellers for a specific city
function getBestSellers(city) {
    axios.get(`${getBestSellerBaseUrl}/${city}`).then(({ data }) => {
        if (data.length) {
            // Concatenate data to the books array
            books = [...books, ...data];
            // Display only the first 8 best sellers
            data = data.splice(0, 8);
            // Set the display of the best seller section to visible
            bestSellerSection.style.display = 'unset';
            // Generate HTML for best sellers and update the DOM
            let str_body = "";
            data.forEach(r => {
                const imageSrc = r.image ? r.image : 'assets/img/logo.png';

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
            // Update the HTML of the best sellers section
            $("#bestSellers").html(str_body);
        }
    })
}

// Function to fetch all books
function getBooks() {
    axios.get(getBooksBaseUrl).then(({ data }) => {
        if (data.length) {
            // Concatenate data to the books array
            books = [...books, ...data];
            // Generate HTML for books and update the DOM
            let str_body = "";
            data.forEach(r => {
                const imageSrc = r.image ? r.image : 'assets/img/logo.png';
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
            // Update the HTML of the books section
            $("#booksData").html(str_body);
        }
    })
}

// Function to navigate to the book details page
function navigate(bookID) {
    localStorage.setItem('route', String(bookID));
    window.location.href = 'book-details.html';
}

// Fetch best sellers and all books when the page loads
getBestSellers(city);
getBooks();
