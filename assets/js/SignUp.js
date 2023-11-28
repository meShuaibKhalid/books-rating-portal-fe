const signUpForm = document.getElementById("sign_up_form");
const userBaseUrl = "http://localhost:3000/users";

signUpForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  const fd = new FormData(evt.target);
  const data = getUserData(Object.fromEntries(fd.entries()));
  signUp(data).then(
    (data) => {
      evt.target.reset();
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = "sign-in.html";
    },
    (error) => {
      console.log("error: ", error);
      alert("Error Signing up. Please try again");
    }
  );
});

function getUserData(data) {
  return {
    name: data.firstName + " " + data.lastName,
    email: data.email,
    password: data.password,
    address: data.address
  };
}

async function signUp(data) {
  return new Promise(async (resolve, reject) => {
    axios.post(userBaseUrl, data).then((response) => {
      if (response.status === 201) {
        resolve(response.data);
      } else {
        reject();
      }
    });
  });
}
