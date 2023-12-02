const loginForm = document.getElementById("login_form");
const userBaseUrl = "http://localhost:3000/users/login";

loginForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  const fd = new FormData(evt.target);
  const data = getUserData(Object.fromEntries(fd.entries()));
  Login(data).then(
    (res) => {
      evt.target.reset();
      localStorage.setItem("user", JSON.stringify(res));
      window.location.href = "index.html";
    },
    (error) => {
      console.log("error: ", error);
      alert("Error Logging In. Please try again");
    }
  );
});

function getUserData(data) {
  return {
    email: data.email,
    password: data.password,
  };
}

async function Login(data) {
  return new Promise(async (resolve, reject) => {
    axios.post(userBaseUrl, data).then((response) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject();
      }
    });
  });
}
