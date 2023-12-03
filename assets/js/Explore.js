const bestSellerTitle = document.getElementById("best_seller_title");
const city = localStorage.getItem("best_seller_city");
if (city) bestSellerTitle.innerHTML = city ? `Best Sellers in ${city}` : "Best Sellers";