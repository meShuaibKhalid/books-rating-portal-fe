// DOM elements
const userForm = document.querySelector('#user_profile_modal_form');
const image = document.getElementById("user_profile");
const imageUploadDiv = document.getElementById("image_upload_div");
const removeImage = document.getElementById("upload-file-delete");

// Constants
const userID = JSON.parse(localStorage.getItem('user'))?.id;
const userBaseUrl = "http://localhost:3000/users";
const uploadUrl = "http://localhost:3000/upload/avatar";

// Variables
let imageUrl = '';

// Check if the current image is a default image from ui-avatars
function checkIfDefaultImage() {
    if (image.src.toString().split("/").includes("ui-avatars")) {
        removeImage.style.display = "none";
    }
}

// Event listener for file upload
async function uploadPicture(event) {
    event.preventDefault();
    const newImage = event.target.files[0];
    if (newImage) {
        image.src = URL.createObjectURL(newImage);
        imageUploadDiv.blur();
        removeImage.style.display = "block";
    }

    try {
        const formData = new FormData();
        formData.append('file', newImage);
        await uploadFile(formData);
    } catch (error) {
        console.error(error);
    }
}

// Event listener for removing the uploaded image
removeImage.addEventListener("click", () => {
    setDefaultImage();
    checkIfDefaultImage();
    imageUrl = '';
    UpdateUser({
        image: ''
    });
});

// Set the default image based on user's name
function setDefaultImage() {
    const [firstName, lastName] = JSON.parse(localStorage.getItem('user'))?.name.split(' ').filter(data => data);
    const userProfileImg = document.querySelector('#user_profile');
    if (userProfileImg) userProfileImg.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&&background=random`;
}

// Form submission event listener
if (userForm) {
    userForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();

        const fd = new FormData(evt.target);
        const data = getUserData(Object.fromEntries(fd.entries()));

        try {
            const res = await UpdateUser(data);
            evt.target.reset();
            localStorage.setItem("user", JSON.stringify(res));
            populateUserProfile();
            document.querySelector('#modal_close_btn').click();
        } catch (error) {
            console.log("error: ", error);
            alert("Error Logging In. Please try again");
        }
    });
}

// Populate user profile information
async function populateUserProfile() {
    await getUser();
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData) {
        const usernameLg = document.getElementById('username_lg');
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const address = document.getElementById('address');

        // Helper function to update text content
        const updateTextContent = (element, text) => (element.textContent = text);

        imageUrl = userData.image;

        updateTextContent(usernameLg, userData.name);
        updateTextContent(username, userData.name);
        updateTextContent(email, userData.email);
        updateTextContent(address, !userData.address ? 'Address not found' : userData.address);

        const [firstName, lastName] = userData.name.split(' ').filter(data => data);
        document.querySelector('input[name="firstName"]').value = firstName;
        document.querySelector('input[name="lastName"]').value = lastName;
        document.querySelector('input[name="email"]').value = userData.email;
        document.querySelector('input[name="address"]').value = userData.address;

        if (userData.image) {
            image.src = userData.image;
        } else {
            setDefaultImage();
        }
    }
}

// Delayed initial population of user profile
setTimeout(() => {
    populateUserProfile();
}, 500);

// Fetch user data from the server
async function getUser() {
    try {
        const response = await axios.get(`${userBaseUrl}/${userID}`);
        if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Update user data on the server
async function UpdateUser(data) {
    try {
        const response = await axios.put(`${userBaseUrl}/${userID}`, data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
}

// Upload file to the server
async function uploadFile(file) {
    try {
        await axios.post(`${uploadUrl}/${userID}`, file);
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

// Create user data object from form input
function getUserData(data) {
    return {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        password: data.password,
        address: data.address,
        image: imageUrl
    };
}
