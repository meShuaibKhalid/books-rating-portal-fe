// Selecting the login form from the DOM
const loginForm = document.getElementById("login_form");

// Base URL for the user login API endpoint
const userBaseUrl = "http://localhost:3000/users/login";

// Adding a submit event listener to the login form
loginForm.addEventListener("submit", (evt) => {
  // Preventing the default form submission behavior
  evt.preventDefault();
  // Stopping the event propagation to avoid unnecessary processing
  evt.stopPropagation();

  // Creating a FormData object from the form data
  const fd = new FormData(evt.target);

  // Extracting user data from the form using the getUserData function
  const data = getUserData(Object.fromEntries(fd.entries()));

  // Calling the Login function with user data
  Login(data).then(
    // If the login is successful
    (res) => {
      // Resetting the form
      evt.target.reset();
      // Storing user data in local storage
      localStorage.setItem("user", JSON.stringify(res));
      // Redirecting to the index.html page
      window.location.href = "index.html";
    },
    // If there is an error during login
    (error) => {
      // Displaying an alert with an error message
      alert("Error Logging In. Please try again");
    }
  );
});

// Function to structure user data for the login request
function getUserData(data) {
  return {
    email: data.email,
    password: data.password,
  };
}

// Async function to handle the login request
async function Login(data) {
  // Returning a Promise to handle asynchronous login request
  return new Promise(async (resolve, reject) => {
    // Making a POST request to the user login API endpoint
    axios.post(userBaseUrl, data).then((response) => {
      // If the response status is 200 (OK), resolve the Promise with the response data
      if (response.status === 200) {
        resolve(response.data);
      } else {
        // If there is an error, reject the Promise
        reject();
      }
    });
  });
}
