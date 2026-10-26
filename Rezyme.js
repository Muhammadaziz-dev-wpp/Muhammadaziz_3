
let resumeData = JSON.parse(localStorage.getItem("ustozResume")) || {
  fan:"",
  experience:"",
  phone:"",
  email:"",
  school:"",
  address:"",
  education:"",
  about:"",
  skills:""
};


function openResume(){

  const modal=document.getElementById("resumeModal");

  const first=document.getElementById("profileFirstName").value ||
              document.getElementById("editFirstName").value;

  const last=document.getElementById("profileLastName").value ||
             document.getElementById("editLastName").value;

  document.getElementById("resumeFullName").textContent =
    (first+" "+last).trim() || "O‘qituvchi";

  document.getElementById("resumeSubject").textContent =
    resumeData.fan || "Fan kiritilmagan";

  document.getElementById("resumeFan").textContent =
    resumeData.fan || "—";

  document.getElementById("resumeExperience").textContent =
    resumeData.experience || "—";

  document.getElementById("resumePhone").textContent =
    resumeData.phone || "—";

  document.getElementById("resumeEmail").textContent =
    resumeData.email || "—";

  document.getElementById("resumeSchool").textContent =
    resumeData.school || "—";

  document.getElementById("resumeAddress").textContent =
    resumeData.address || "—";

  document.getElementById("resumeEducation").textContent =
    resumeData.education || "Ma'lumot kiritilmagan.";

  document.getElementById("resumeAbout").textContent =
    resumeData.about || "Ma'lumot kiritilmagan.";

  const skillsBox=document.getElementById("resumeSkills");

  skillsBox.innerHTML="";

  if(resumeData.skills){

    resumeData.skills.split(",").forEach(skill=>{

      const span=document.createElement("span");

      span.className="skill";

      span.textContent=skill.trim();

      skillsBox.appendChild(span);

    });

  }else{

    skillsBox.innerHTML="<span class='muted'>Ko‘nikmalar kiritilmagan</span>";

  }


  const img=document.getElementById("profilePreview");

  const resumeImg=document.getElementById("resumeImage");

  const icon=document.getElementById("resumeAvatarIcon");

  if(img && img.src && img.style.display!=="none"){

    resumeImg.src=img.src;

    resumeImg.classList.add("active");

    icon.style.display="none";

  }else{

    resumeImg.classList.remove("active");

    icon.style.display="block";

  }

  modal.classList.add("show");

}


function closeResume(){

  document.getElementById("resumeModal").classList.remove("show");

}


function openResumeEditor(){

  document.getElementById("inputFan").value=resumeData.fan;

  document.getElementById("inputExperience").value=resumeData.experience;

  document.getElementById("inputPhone").value=resumeData.phone;

  document.getElementById("inputEmail").value=resumeData.email;

  document.getElementById("inputSchool").value=resumeData.school;

  document.getElementById("inputAddress").value=resumeData.address;

  document.getElementById("inputEducation").value=resumeData.education;

  document.getElementById("inputAbout").value=resumeData.about;

  document.getElementById("inputSkills").value=resumeData.skills;

  document.getElementById("resumeEditor").classList.add("show");

}


function closeResumeEditor(){

  document.getElementById("resumeEditor").classList.remove("show");

}


function saveResume(){

  resumeData={

    fan:document.getElementById("inputFan").value,

    experience:document.getElementById("inputExperience").value,

    phone:document.getElementById("inputPhone").value,

    email:document.getElementById("inputEmail").value,

    school:document.getElementById("inputSchool").value,

    address:document.getElementById("inputAddress").value,

    education:document.getElementById("inputEducation").value,

    about:document.getElementById("inputAbout").value,

    skills:document.getElementById("inputSkills").value

  };

  localStorage.setItem(
    "ustozResume",
    JSON.stringify(resumeData)
  );

  closeResumeEditor();

  openResume();

}


// ================================
// ELEMENTLARNI OLISH
// ================================

const inputs = {

    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    fatherName: document.getElementById("fatherName"),

    birthDate: document.getElementById("birthDate"),

    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    address: document.getElementById("address"),

    job: document.getElementById("job"),
    experience: document.getElementById("experience"),
    company: document.getElementById("company"),
    subject: document.getElementById("subject"),

    educationPlace:
        document.getElementById("educationPlace"),

    educationDirection:
        document.getElementById("educationDirection"),

    educationStart:
        document.getElementById("educationStart"),

    educationEnd:
        document.getElementById("educationEnd"),

    about: document.getElementById("about"),

    skills: document.getElementById("skills"),

    languages: document.getElementById("languages")
};


// ================================
// RASM
// ================================

const photoInput =
    document.getElementById("photoInput");

const photoPreview =
    document.getElementById("photoPreview");

const photoIcon =
    document.getElementById("photoIcon");

const photoName =
    document.getElementById("photoName");

const cvPhoto =
    document.getElementById("cvPhoto");

const cvPhotoIcon =
    document.getElementById("cvPhotoIcon");


photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    photoName.textContent = file.name;

    const reader = new FileReader();

    reader.onload = function (event) {

        const image = event.target.result;

        photoPreview.src = image;

        photoPreview.classList.add("active");

        photoIcon.style.display = "none";


        cvPhoto.src = image;

        cvPhoto.classList.add("active");

        cvPhotoIcon.style.display = "none";


        localStorage.setItem(
            "resumePhoto",
            image
        );

    };

    reader.readAsDataURL(file);

});


// ================================
// INPUTLAR O‘ZGARGANDA
// ================================

Object.values(inputs).forEach(function(input) {

    input.addEventListener("input", updateResume);

    input.addEventListener("change", updateResume);

});


// ================================
// REZYUMENI YANGILASH
// ================================

function updateResume() {

    const first =
        inputs.firstName.value.trim();

    const last =
        inputs.lastName.value.trim();

    const father =
        inputs.fatherName.value.trim();


    // TO‘LIQ ISM

    let fullName =
        `${first} ${last} ${father}`.trim();


    document.getElementById("cvName")
        .textContent =
        fullName || "Ism Familiya";


    // KASB

    document.getElementById("cvJob")
        .textContent =
        inputs.job.value ||
        "O‘qituvchi";


    // FAN

    document.getElementById("cvSubject")
        .textContent =
        inputs.subject.value ||
        "Fan kiritilmagan";


    // TELEFON

    document.getElementById("cvPhone")
        .textContent =
        inputs.phone.value ||
        "Telefon kiritilmagan";


    // EMAIL

    document.getElementById("cvEmail")
        .textContent =
        inputs.email.value ||
        "Email kiritilmagan";


    // MANZIL

    document.getElementById("cvAddress")
        .textContent =
        inputs.address.value ||
        "Manzil kiritilmagan";


    // TUG‘ILGAN SANA

    if (inputs.birthDate.value) {

        const date =
            new Date(inputs.birthDate.value);

        const formatted =
            date.toLocaleDateString("uz-UZ");

        document.getElementById("cvBirthDate")
            .textContent = formatted;

    } else {

        document.getElementById("cvBirthDate")
            .textContent = "—";

    }


    // TAJRIBA

    document.getElementById("cvExperience")
        .textContent =
        inputs.experience.value || "—";


    document.getElementById("cvExperience2")
        .textContent =
        inputs.experience.value ||
        "Ish tajribasi";


    // MAKTAB

    document.getElementById("cvCompany")
        .textContent =
        inputs.company.value ||
        "Maktab / Tashkilot";


    // KASB

    document.getElementById("cvJobText")
        .textContent =
        inputs.job.value ||
        "O‘qituvchi";


    // MEN HAQIMDA

    document.getElementById("cvAbout")
        .textContent =
        inputs.about.value ||
        "O‘zingiz haqingizdagi ma'lumotlarni chap tomondagi formaga kiriting.";


    // TA'LIM

    document.getElementById("cvEducationPlace")
        .textContent =
        inputs.educationPlace.value ||
        "Universitet / Institut";


    document.getElementById("cvEducationDirection")
        .textContent =
        inputs.educationDirection.value ||
        "Yo‘nalish";


    const start =
        inputs.educationStart.value ||
        "—";

    const end =
        inputs.educationEnd.value ||
        "—";


    document.getElementById("cvEducationYears")
        .textContent =
        `${start} — ${end}`;


    // KO‘NIKMALAR

    const skillsBox =
        document.getElementById("cvSkills");

    skillsBox.innerHTML = "";

    const skills =
        inputs.skills.value
        .split(",")
        .map(x => x.trim())
        .filter(x => x);


    if (skills.length === 0) {

        skillsBox.innerHTML =
            `<span class="skill">Ko‘nikmalar</span>`;

    } else {

        skills.forEach(function(skill) {

            const span =
                document.createElement("span");

            span.className = "skill";

            span.textContent = skill;

            skillsBox.appendChild(span);

        });

    }


    // TILLAR

    const languages =
        inputs.languages.value
        .split(",")
        .map(x => x.trim())
        .filter(x => x);


    document.getElementById("cvLanguages")
        .textContent =
        languages.length
        ? languages.join(" • ")
        : "O‘zbek tili";

}


// ================================
// SAQLASH
// ================================

function saveResume() {

    const data = {};

    Object.keys(inputs).forEach(function(key) {

        data[key] = inputs[key].value;

    });


    localStorage.setItem(
        "ustozimResume",
        JSON.stringify(data)
    );


    alert("✅ Rezyume muvaffaqiyatli saqlandi!");

}


// ================================
// SAQLANGAN MA'LUMOTLARNI YUKLASH
// ================================

function loadResume() {

    const saved =
        localStorage.getItem("ustozimResume");


    if (saved) {

        const data =
            JSON.parse(saved);


        Object.keys(inputs).forEach(function(key) {

            if (data[key] !== undefined) {

                inputs[key].value =
                    data[key];

            }

        });

    }


    // RASM

    const savedPhoto =
        localStorage.getItem("resumePhoto");


    if (savedPhoto) {

        photoPreview.src =
            savedPhoto;

        photoPreview.classList.add("active");

        photoIcon.style.display =
            "none";


        cvPhoto.src =
            savedPhoto;

        cvPhoto.classList.add("active");

        cvPhotoIcon.style.display =
            "none";

    }


    updateResume();

}


// ================================
// ORQAGA
// ================================

function goBack() {

    window.history.back();

}


// ================================
// PRINT
// ================================

function printResume() {

    window.print();

}


// ================================
// START
// ================================

loadResume();