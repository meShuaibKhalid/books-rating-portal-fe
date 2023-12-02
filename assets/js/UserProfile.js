const userForm = document.querySelector('#user_profile_modal_form');
const userID = JSON.parse(localStorage.getItem('user'))?.id;
const userBaseUrl = "http://localhost:3000/users";
const uploadUrl = "http://localhost:3000/upload";
let image = document.getElementById("user_profile");
const imageUploadDiv = document.getElementById("image_upload_div");
const removeImage = document.getElementById("upload-file-delete");
let imageUrl = '';
checkIfDefaultImage();

function checkIfDefaultImage() {
    if (image.src.toString().split("/").includes("ui-avatars")) {
        removeImage.style.display = "none";
    }
}

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
        uploadFile(formData);
    } catch (error) {
        console.error(error);
    }
}

removeImage.addEventListener("click", () => {
    setDefaultImage();
    checkIfDefaultImage();
    imageUrl = '';
    UpdateUser({
        image: ''
    });
});

function setDefaultImage() {
    const [firstName, lastName] = JSON.parse(localStorage.getItem('user'))?.name.split(' ').filter(data => data);
    const userProfileImg = document.querySelector('#user_profile');
    if (userProfileImg) userProfileImg.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&&background=random`;
}

if (userForm) {
    userForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        const fd = new FormData(evt.target);
        const data = getUserData(Object.fromEntries(fd.entries()));
        UpdateUser(data).then(
            (res) => {
                console.log('res: ', res);
                evt.target.reset();
                localStorage.setItem("user", JSON.stringify(res));
                populateUserProfile();
                document.querySelector('#modal_close_btn').click();
            },
            (error) => {
                console.log("error: ", error);
                alert("Error Logging In. Please try again");
            }
        );
    });
}

async function populateUserProfile() {
    await getUser();
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        const usernameLg = document.getElementById('username_lg');
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const address = document.getElementById('address');
        const updateTextContent = (element, text) => (element.textContent = text);

        updateTextContent(usernameLg, userData.name);
        updateTextContent(username, userData.name);
        updateTextContent(email, userData.email);
        updateTextContent(address, !userData.address ? 'Address not found' : userData.address);

        const [firstName, lastName] = JSON.parse(localStorage.getItem('user'))?.name.split(' ').filter(data => data);
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

setTimeout(() => {
    populateUserProfile();
}, 500);

async function getUser() {
    const response = await axios.get(`${userBaseUrl}/${userID}`);
    if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
}

async function UpdateUser(data) {
    return new Promise(async (resolve, reject) => {
        axios.put(`${userBaseUrl}/${userID}`, data).then((response) => {
            if (response.status === 200) {
                resolve(response.data);
            } else {
                reject();
            }
        });
    });
}

async function uploadFile(file) {
    await axios.post(`${uploadUrl}/${userID}`, file);
}

function getUserData(data) {
    return {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        password: data.password,
        address: data.address,
        image: imageUrl
    };
}