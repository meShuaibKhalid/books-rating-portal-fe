// Getting reference to the review form
const reviewForm = document.getElementById('reviewForm');

// Getting book ID from local storage
const bookID = localStorage.getItem('route');

// Base URLs for API endpoints
const booksBaseUrl = 'http://localhost:3000/books';
const reviewsBaseUrl = 'http://localhost:3000/reviews';

// Array of element IDs for book details
const elArr = ['title', 'author', 'abstract', 'publish_date', 'image', 'rating'];

// Object to store book details
const book = {};

// Check if bookID exists, then fetch book details
if (bookID) {
    getBookDetails(bookID);
}

// Function to fetch book details using axios
function getBookDetails(bookID) {
    axios.get(`${booksBaseUrl}/${bookID}`).then(({ data }) => {
        if (data) {
            // Copy data to the book object
            Object.assign(book, data);
            // Update UI with book details
            elArr.forEach(async elementID => {
                const el = document.getElementById(elementID);
                switch (elementID) {
                    case 'image':
                        // Display book image or default logo if not available
                        el.src = data[elementID] ? data[elementID] : '../img/logo.png';
                        break;
                    default:
                        // Display text content for other elements
                        el.textContent = data[elementID];
                        break;
                }
            })
        }
    })
}

// Function to fetch book reviews using axios
function getBookReviews(bookID) {
    axios.get(`${reviewsBaseUrl}/${bookID}`).then(({ data }) => {
        let reviewCards = '';
        if (data) {
            // Iterate through reviews and generate HTML dynamically
            data.forEach((review) => {
                const userImage = review?.user_image || `https://ui-avatars.com/api/?name=${review?.user_name}&&background=random`;
                const rating = review.rating !== null ? review.rating : 0;

                // Determine the number of filled stars based on the rating
                const filledStars = Math.min(5, Math.round(rating));

                // Generate the star icons dynamically
                let starIcons = '';
                for (let i = 0; i < filledStars; i++) {
                    starIcons += '<i class="bi bi-star-fill text-warning"></i>';
                }
                // Add remaining empty stars
                for (let i = filledStars; i < 5; i++) {
                    starIcons += '<i class="bi bi-star-fill"></i>';
                }
                // Build the HTML for review cards
                reviewCards += `
                    <div class="review-card">
                        <div class="img-col">
                            <img src="${userImage}" width="30" alt="">
                        </div>
                        <div class="review-col">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="heading">${review?.user_name}</span>
                                <div>${starIcons}</div>
                            </div>
                            <p>${review.title}</p>
                        </div>
                    </div>
                `;

                // Update the reviews list in the HTML
                $('#reviewsList').html(reviewCards);
            });

            // Calculate and display average rating
            const avgRating = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
            const ratingEl = document.getElementById('rating');
            const arr = [1, 2, 3, 4, 5];
            const bookRating = Math.floor(avgRating);
            const starIcons = arr.map((rating) => {
                return `<i class="${rating <= bookRating ? 'bi bi-star-fill d-flex mx-1 text-warning' : 'bi bi-star-fill d-flex mx-1'}"></i>`;
            });
            // Display the average rating with stars and numeric value
            ratingEl.innerHTML = `<span id="rating" class="d-flex align-items-center ml-2">${starIcons.join('')} </span> <span class='ml-2'>(${avgRating.toFixed(2)})</span>`;
        }
    })
}

// Event listener for form submission
if (reviewForm) reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Create FormData object from form data
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    // Assign additional data to be sent in the request
    Object.assign(data, {
        book_id: bookID,
        user_id: JSON.parse(localStorage.getItem('user'))?.id,
        book_name: book.title,
        user_name: JSON.parse(localStorage.getItem('user'))?.name
    });
    // Make a POST request to add a new review
    const response = await axios.post('http://localhost:3000/reviews/addreview', data);
    if (response.status === 201) {
        // Update the displayed reviews after successfully adding a new review
        getBookReviews(bookID);
    }
})

// Fetch book reviews initially
getBookReviews(bookID);
