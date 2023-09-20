import { request } from "./axiosRequest.js";
import { LIMIT } from "./const.js";


const allTeachersBox = document.querySelector(".all__teachers__box")
const searchInput = document.querySelector(".search__input");
const totalTeachersCount = document.querySelector(".total__teachers__count")
const paginationList = document.querySelector(".pagination__list")
const teacherModalForm = document.querySelector(".teacher__modal__form")
const teacherModal = document.querySelector(".teacherModal")
const openModalBtn = document.querySelector(".open__modal__btn")
const submitModalBtn = document.querySelector(".submit__modal__btn")


const rxMobile = "5"
let searchValue = ""
let selected = null;
let activePage = 1;


const renderTeacher = (teacher) => {
  return `
    <div class="teacher__box">
      <div class="teacher__img-box my-3">
        <img src="${teacher.avatar}" alt="">
      </div>
      <h4 class="teacher__firstname-title" >Name: ${teacher.firstName}</h4>
      <h4 class="teacher__firstname-title" >Surname: ${teacher.lastName}</h4>
      <p class="teacher__firstname-title">Email: <a href="mailto: ${teacher.email}">${teacher.email}</a></p>
      <div class="teacher__btns-box">
        <a href="students.html?teacherId=${teacher.id}" class="btn btn-primary teacher__btn">Students</a>
        <button editId = "${teacher.id}"  class="btn btn-warning teacher__btn" data-bs-toggle="modal" data-bs-target="#teacherModal">Edit</button>
        <button deleteId = " ${teacher.id} " class="btn btn-danger teacher__btn">Delete</button>
      </div>
    </div>
  `
}

const getTeacher = async () =>{

  allTeachersBox.innerHTML = `<img  alt="" class="bg ns nt c loading" width="1000" height="1000" loading="lazy" role="presentation" src="https://miro.medium.com/v2/resize:fit:773/1*CsJ05WEGfunYMLGfsT2sXA.gif">`
  try {
    let params = { firstName : searchValue }
    
    let {data: allData}= await request.get('teacher', { params })
    
    params = {...params, page: activePage, limit: LIMIT}
    
    let {data: pgnData}= await request.get('teacher',{ params })
    
    allTeachersBox.innerHTML = ""
    
    pgnData.map((teacher)=>{
      allTeachersBox.innerHTML += renderTeacher(teacher)
    })

    let leng = allData.length;
    let pagesCount = Math.ceil(leng / LIMIT)
    if  ( leng > 0 ) {
      totalTeachersCount.innerHTML = `<p>Total teachers: <span>${leng}</span></p>`
    } else {
      totalTeachersCount.innerHTML = `<p>Not teachers</p>`
    }
    if (leng > LIMIT) {
      paginationList.style.display = "flex";
      paginationList.innerHTML = `<li class="page-item"><button class="page-link ${activePage === 1 ? "disabled" : ''}" page="-" >Previous</button></li>`
      for (let i = 1; i<=pagesCount; i++ ){
        paginationList.innerHTML += `<li class="page-item"><button class="page-link ${activePage === i ? "active": "" }" page="${i}" >${i}</button></li>` 
      }
      paginationList.innerHTML += `<li class="page-item"><button class="page-link ${activePage === pagesCount ? "disabled" : ''}" page="+" >Next</button></li>`
    } else {
      paginationList.style.display = "none";
    }


  } catch (error) {
    alert(error);
  }
  
}

getTeacher();

searchInput.addEventListener("keyup", function (){
  searchValue = this.value
  activePage = 1;
  getTeacher();
})

paginationList.addEventListener("click", (event)=>{
  let page = event.target.getAttribute("page");
  if (page === "-") {
    activePage--;
  } else if(page === "+") {
    activePage++;
  } else {
    activePage = +page
  }
  getTeacher();
})

teacherModalForm.addEventListener("submit", async function (e){
  try {
    e.preventDefault();
    if (this.checkValidity()) {
      let teacherData = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        phoneNumber: this.phoneNumber.value,
        avatar: this.avatar.value,
        email: this.email.value,
        isMarried: this.isMarried.checked,
        groups: this.groups.value.split(" ")
      }
      if (selected === null) {
        await request.post("teacher", teacherData);
      } else {
        await request.put(`teacher/${selected}`, teacherData);
      }
      getTeacher();
    } else {
      this.classList.add("was-validated");
    }
    
  } catch (error) {
    console.log(error);
  }
})

openModalBtn.addEventListener("click", function () {
  submitModalBtn.textContent="Add teacher"
  selected = null;
  teacherModalForm.firstName.value = "";
  teacherModalForm.lastName.value = "";
  teacherModalForm.phoneNumber.value = "";
  teacherModalForm.avatar.value = "";
  teacherModalForm.email.value = "";
  teacherModalForm.groups.value = ""
  teacherModalForm.isMarried.checked=false;
})

allTeachersBox.addEventListener("click", async function(e){
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");
    if (editId) {
      submitModalBtn.textContent="Save Teacher"
      selected=editId;
      let { data } = await request.get(`teacher/${+editId}`)
      teacherModalForm.firstName.value= data.firstName;
      teacherModalForm.lastName.value = data.lastName;
      teacherModalForm.phoneNumber.value = data.phoneNumber;
      teacherModalForm.avatar.value = data.avatar;
      teacherModalForm.email.value = data.email;
      teacherModalForm.groups.value = data.groups.join(" ")
      teacherModalForm.isMarried.checked = data.isMarried;
    }
    if(deleteId){
      let deleteConfirm = confirm("Rostdan ham o'chirmoqchimisiz?");
      if (deleteConfirm) {
        await request.delete(`teacher/${+deleteId}`)
        getTeacher()
      }
      }
  } catch (error) {
    console.log(error);
  }
});

submitModalBtn.addEventListener("click", function () {
  this.setAttribute("data-bs-dismiss='modal'")
})

