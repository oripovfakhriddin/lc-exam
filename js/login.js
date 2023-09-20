const loginForm = document.querySelector(".login__form")
const loginBtn = document.querySelector(".login__submit-btn")
loginForm.addEventListener("submit",  function (){
    loginData = {
      "email": this.emailInput,
      "password": this.passwordInput
    }
    location= "pages/teachers.html"
})

