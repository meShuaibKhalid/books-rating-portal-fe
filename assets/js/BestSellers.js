
const getBestSellerBaseUrl = 'http://localhost:3000/best-seller/getBestSeller';

function getBestSeller() {
    axios.get(getBestSellerBaseUrl).then(({ data }) => {
        if (data) {
            // Get the table body
            const tbody = document.getElementById('libraryTable').getElementsByTagName('tbody')[0];

            // Populate the table dynamically
            data.forEach(item => {
                const row = tbody.insertRow();
                row.innerHTML = `
        <td>${item.id}</td>
        <td><img src="${item?.image?.length ? item?.image : 'http://placehold.co/40x40'}" alt="Image" style="max-width: 100px; max-height: 100px;"></td>
        <td>${item.abstract}</td>
        <td>${toTitleCase(item.author)}</td>
        <td>${toTitleCase(item.title)}</td>
        <td>${item.publish_date}</td>
        <td>${toTitleCase(item.location)}</td>
        <td>${item.isLocationBestSeller ? 'Yes' : 'No'}</td>
    `;

            });
        }
        // Show Table
        new DataTable('#libraryTable');
    });

}

// Get All Best Sellers
getBestSeller();

