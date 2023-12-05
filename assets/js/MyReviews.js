const user = JSON.parse(localStorage.getItem('user'));

const reviewsBaseUrl = 'http://localhost:3000/reviews/userReveiw'

function getReviews() {
  axios.get(`${reviewsBaseUrl}/${user.id}`).then(({ data }) => {
    let reviews = "";
    if (data) {
      data.forEach(review => {
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
        reviews += `
                <div class="col-md-6 mb-2">
                <div class="card">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <div class="review-page-image-container-card bg-light">
                        <img
                          class="card-img-top"
                          src="${review?.book?.image}"
                          alt="Card image cap"
                        />
                      </div>
                    </div>
                    <div class="col-md-8 px-1">
                      <div class="card-body px-4 px-sm-0">
                        <h5 class="card-title">${review?.book_name}</h5>
                        <p class="card-text">Author: ${review?.user_name}</p>
                        <div>
                         ${starIcons}
                        </div>
                        <p class="card-text mt-3">
                          ${review.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                `;

        $('#reviewsList').html(reviews);
      });
    }
  })
}

getReviews();