// Selecting the sign-up form from the DOM
const signUpForm = document.getElementById("sign_up_form");

// Base URL for the user sign-up API endpoint
const userBaseUrl = "http://localhost:3000/users";

// Adding a submit event listener to the sign-up form
signUpForm.addEventListener("submit", (evt) => {
  // Preventing the default form submission behavior
  evt.preventDefault();
  // Stopping the event propagation to avoid unnecessary processing
  evt.stopPropagation();

  // Creating a FormData object from the form data
  const fd = new FormData(evt.target);

  // Extracting user data from the form using the getUserData function
  const data = getUserData(Object.fromEntries(fd.entries()));

  // Calling the signUp function with user data
  signUp(data).then(
    // If sign-up is successful
    (data) => {
      // Resetting the form
      evt.target.reset();
      // Storing user data in local storage
      localStorage.setItem('user', JSON.stringify(data));
      // Redirecting to the sign-in.html page
      window.location.href = "sign-in.html";
    },
    // If there is an error during sign-up
    (error) => {
      // Displaying an alert with an error message
      alert("Error Signing up. Please try again");
    }
  );
});

// Function to structure user data for the sign-up request
function getUserData(data) {
  return {
    name: data.firstName + " " + data.lastName,
    email: data.email,
    password: data.password,
    address: data.address
  };
}

// Async function to handle the sign-up request
async function signUp(data) {
  // Returning a Promise to handle asynchronous sign-up request
  return new Promise(async (resolve, reject) => {
    // Making a POST request to the user sign-up API endpoint
    axios.post(userBaseUrl, data).then((response) => {
      // If the response status is 201 (Created), resolve the Promise with the response data
      if (response.status === 201) {
        resolve(response.data);
      } else {
        // If there is an error, reject the Promise
        reject();
      }
    });
  });
}
