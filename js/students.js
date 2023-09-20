import { request } from "./axiosRequest.js";
import { LIMIT } from "./const.js";

const query = new URLSearchParams(location.search);
const teacherId = query.get("teacherId")






const allTeachersBox = document.querySelector(".all__teachers__box")
const searchInput = document.querySelector(".search__input");
const totalTeachersCount = document.querySelector(".total__teachers__count")
const paginationList = document.querySelector(".pagination__list")
const teacherModalForm = document.querySelector(".teacher__modal__form")
const teacherModal = document.querySelector(".teacherModal")
const openModalBtn = document.querySelector(".open__modal__btn")
const submitModalBtn = document.querySelector(".submit__modal__btn")



let searchValue = ""
let selected = null;
let activePage = 1;


const renderStudent = (teacher) => {
  return `
    <div class="teacher__box">
      <div class="teacher__img-box my-3">
        <img src="${teacher.avatar}" alt="">
      </div>
      <h3 class="teacher__firstname-title" >${teacher.firstName}</h3>
      <div class="teacher__btns-box">
        
        <button editId = "${teacher.id}"  class="btn btn-warning teacher__btn" data-bs-toggle="modal" data-bs-target="#teacherModal">Edit</button>
        <button deleteId = " ${teacher.id} " class="btn btn-danger teacher__btn">Delete</button>
      </div>
    </div>
  `
}

const getStudent = async () =>{
  try {
    allTeachersBox.innerHTML = `<div loading><img  alt="" class="bg ns nt c " width="1000" height="1000" loading="lazy" role="presentation" src="https://miro.medium.com/v2/resize:fit:773/1*CsJ05WEGfunYMLGfsT2sXA.gif"></div>`

    let params = {firstName : searchValue, page: activePage, limit: LIMIT}

    let {data: allData}= await request.get(`teacher/${teacherId}/students`, { params })
    
    
    
    allTeachersBox.innerHTML = ""
    
    allData.map((teacher)=>{
      allTeachersBox.innerHTML += renderStudent(teacher)
    })

    let leng = allData.length;

    if  ( leng > 0 ) {
      totalTeachersCount.innerHTML = `<p>Total students: <span>${leng}</span></p>`
    } else {
      totalTeachersCount.innerHTML = `<p>Not students</p>`
    }
    if (leng > 10) {
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

getStudent();

searchInput.addEventListener("keyup", function (){
  searchValue = this.value
  activePage = 1;
  getStudent();
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
  getStudent();
})

teacherModalForm.addEventListener("submit", async function (e){
  try {
    e.preventDefault();
    if (this.checkValidity()) {
      let studentData = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        phoneNumber: this.phoneNumber.value,
        avatar: this.avatar.value,
        email: this.email.value,
        isWork: this.isWork.checked,
        birthday: this.birthday.value
      }
      if (selected === null) {
        await request.post(`teacher/${teacherId}/students`, studentData);
      } else {
        await request.put(`teacher/${teacherId}/students/${selected}`, studentData);
      }
      getStudent();
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
  teacherModalForm.birthday.value = ""
  teacherModalForm.isWork.checked=false;
})

allTeachersBox.addEventListener("click", async function(e){
  try {
    let editId = e.target.getAttribute("editId");
    let deleteId = e.target.getAttribute("deleteId");
    if (editId) {
      submitModalBtn.textContent="Save Student"
      selected=editId;
      let { data } = await request.get(`teacher/${teacherId}/students/${editId}`)
      teacherModalForm.firstName.value= data.firstName;
      teacherModalForm.lastName.value = data.lastName;
      teacherModalForm.phoneNumber.value = data.phoneNumber;
      teacherModalForm.avatar.value = data.avatar;
      teacherModalForm.email.value = data.email;
      teacherModalForm.birthday.value = data.birthday;
      teacherModalForm.isWork.checked = data.isWork;
    }
    if(deleteId){
      let deleteConfirm = confirm("Rostdan ham o'chirmoqchimisiz?");
      if (deleteConfirm) {
        await request.delete(`teacher/${teacherId}/students/${+deleteId}`)
        getStudent()
      }
      }
  } catch (error) {
    console.log(error);
  }
});

