const CLASS_KEY = "ustozim_selected_class";
const THEME_KEY = "ustozim_theme";
const PROFILE_KEY = "ustozim_teacher_profile_v4";
const DATA_KEY = "ustozim_students_by_class_v4";
const OLD_KEY = "ustozim_students_v9";

let currentClass = localStorage.getItem(CLASS_KEY) || "7-A";
const letters = ["A", "B", "V", "G", "D"];

let classData = JSON.parse(localStorage.getItem(DATA_KEY) || "{}");

if (!classData || typeof classData !== "object") {
    classData = {};
}

function ensureClass(name) {
    if (!Array.isArray(classData[name])) {
        classData[name] = [];
    }

    return classData[name];
}

if (!Array.isArray(classData[currentClass])) {
    classData[currentClass] = [];
}

let students = classData[currentClass];

const oldStudents = JSON.parse(
    localStorage.getItem(OLD_KEY) || "null"
);

if (
    students.length === 0 &&
    Array.isArray(oldStudents) &&
    oldStudents.length
) {
    students = oldStudents;
    classData[currentClass] = students;
}

function saveData() {
    classData[currentClass] = students;

    localStorage.setItem(
        DATA_KEY,
        JSON.stringify(classData)
    );
}

function esc(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char])
    );
}

function parseFullName(full) {
    const parts = String(full)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length < 2) {
        return {
            surname: parts[0] || "",
            name: "",
            father: ""
        };
    }

    return {
        surname: parts[0],
        name: parts.slice(1, -1).join(" ") || parts[1],
        father: parts.length >= 3
            ? parts.at(-1)
            : ""
    };
}


/* =========================================
   SINFLAR
========================================= */

function createClassList() {

    const menu = document.getElementById(
        "classDropdownMenu"
    );

    const select = document.getElementById(
        "classSelect"
    );

    if (!menu || !select) return;

    menu.innerHTML = "";
    select.innerHTML = "";

    for (let grade = 1; grade <= 11; grade++) {

        for (const letter of letters) {

            const className =
                `${grade}-${letter}`;

            const option =
                document.createElement("option");

            option.value = className;
            option.textContent = className;

            select.appendChild(option);


            const btn =
                document.createElement("button");

            btn.type = "button";
            btn.className = "class-option";
            btn.textContent = className;

            btn.onclick = () =>
                changeClass(className);

            menu.appendChild(btn);
        }
    }

    select.value = currentClass;

    updateClassDropdown();
}


function changeClass(name) {

    if (!name) return;

    currentClass = name;

    localStorage.setItem(
        CLASS_KEY,
        currentClass
    );

    students = ensureClass(currentClass);


    const classTitle =
        document.getElementById("classTitle");

    const selectedClass =
        document.getElementById("selectedClass");

    const panelClass =
        document.getElementById("panelClass");

    const modalClassName =
        document.getElementById("modalClassName");

    const classSelect =
        document.getElementById("classSelect");


    if (classTitle) {
        classTitle.textContent =
            `${currentClass} sinf`;
    }

    if (selectedClass) {
        selectedClass.textContent =
            currentClass;
    }

    if (panelClass) {
        panelClass.textContent =
            currentClass;
    }

    if (modalClassName) {
        modalClassName.textContent =
            currentClass;
    }

    if (classSelect) {
        classSelect.value =
            currentClass;
    }

    updateClassDropdown();
    closeClassDropdown();
    render();
}


function updateClassDropdown() {

    document
        .querySelectorAll(".class-option")
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.textContent === currentClass
            );

        });
}


function toggleClassDropdown() {

    const dropdown =
        document.getElementById(
            "classDropdown"
        );

    if (!dropdown) return;

    dropdown.classList.toggle("open");
}


function closeClassDropdown() {

    const dropdown =
        document.getElementById(
            "classDropdown"
        );

    if (!dropdown) return;

    dropdown.classList.remove("open");
}


document.addEventListener(
    "click",
    event => {

        const dropdown =
            document.getElementById(
                "classDropdown"
            );

        if (
            dropdown &&
            !dropdown.contains(event.target)
        ) {
            closeClassDropdown();
        }
    }
);


/* =========================================
   JADVAL USTUNLARI
========================================= */

function ensureTableHeader() {

    const table =
        document.querySelector("table");

    if (!table) return;

    const headerRow =
        table.querySelector("thead tr");

    if (!headerRow) return;


    const hasLate =
        Array.from(headerRow.children)
            .some(
                th =>
                    th.textContent
                        .trim()
                        .toLowerCase() ===
                    "kechikish"
            );


    if (!hasLate) {

        const attendanceHeader =
            Array.from(headerRow.children)
                .find(
                    th =>
                        th.textContent
                            .trim()
                            .toLowerCase() ===
                        "davomat"
                );

        if (attendanceHeader) {

            const th =
                document.createElement("th");

            th.textContent =
                "Kechikish";

            attendanceHeader.after(th);
        }
    }


    const hasBall =
        Array.from(headerRow.children)
            .some(
                th =>
                    th.textContent
                        .trim()
                        .toLowerCase() ===
                    "ball"
            );


    if (!hasBall) {

        const lateHeader =
            Array.from(headerRow.children)
                .find(
                    th =>
                        th.textContent
                            .trim()
                            .toLowerCase() ===
                        "kechikish"
                );

        if (lateHeader) {

            const th =
                document.createElement("th");

            th.textContent = "Ball";

            lateHeader.after(th);
        }
    }
}


/* =========================================
   BALL
========================================= */

function gradeKey(student) {

    return (
        `${currentClass}::` +
        `${String(student.surname || "")
            .trim()
            .toLowerCase()}::` +
        `${String(student.name || "")
            .trim()
            .toLowerCase()}`
    );
}


function getSavedGradesSafe() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "ustozim_baholar"
            ) || "{}"
        ) || {};

    } catch {

        return {};
    }
}


function saveGradesSafe(grades) {

    localStorage.setItem(
        "ustozim_baholar",
        JSON.stringify(grades)
    );
}


function getStudentBall(student) {

    if (!student) return "";

    if (
        student.ball !== undefined &&
        student.ball !== null &&
        student.ball !== ""
    ) {
        return Number(student.ball);
    }


    if (
        student.bal !== undefined &&
        student.bal !== null &&
        student.bal !== ""
    ) {
        return Number(student.bal);
    }


    const grades =
        getSavedGradesSafe();

    const key =
        gradeKey(student);

    return grades[key] ?? "";
}


function getBallClass(score) {

    score = Number(score);

    if (score >= 9) {
        return "ball-green";
    }

    if (score >= 7) {
        return "ball-yellow";
    }

    return "ball-red";
}


/* =========================================
   ASOSIY JADVAL
========================================= */

function render() {

    ensureTableHeader();


    const search =
        document.getElementById("search");

    const q =
        search
            ? search.value
                .toLowerCase()
                .trim()
            : "";


    const active =
        students.filter(
            s => !s.left
        );


    const list =
        active.filter(s => {

            const text =
                `${s.name || ""} ` +
                `${s.surname || ""} ` +
                `${s.father || ""} ` +
                `${s.phone || ""} ` +
                `${s.address || ""}`;

            return text
                .toLowerCase()
                .includes(q);
        });


    const tbody =
        document.getElementById(
            "students"
        );

    if (!tbody) return;


    if (!list.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty">
                    Hozircha o‘quvchi topilmadi
                </td>
            </tr>
        `;

    } else {

        tbody.innerHTML =
            list.map((s, i) => {

                const index =
                    students.indexOf(s);

                const score =
                    getStudentBall(s);


                return `
                    <tr
                        data-student-index="${index}"
                        style="
                            animation-delay:
                            ${i * 0.035}s
                        "
                    >

                        <td>
                            <b>${i + 1}</b>
                        </td>


                        <td>

                            ${
                                s.photo
                                ?
                                `
                                <img
                                    class="avatar"
                                    src="${esc(s.photo)}"
                                    alt="Rasm"
                                >
                                `
                                :
                                `
                                <div class="avatar-empty">
                                    👤
                                </div>
                                `
                            }

                        </td>


                        <td class="fio">

                            <strong>
                                ${esc(s.surname)}
                                ${esc(s.name)}
                            </strong>

                            <span>
                                ${
                                    esc(s.father) ||
                                    "Otasining ismi kiritilmagan"
                                }
                            </span>

                        </td>


                        <td>
                            ${esc(s.year) || "—"}
                        </td>


                        <td>
                            ${esc(s.address) || "—"}
                        </td>


                        <td>
                            ${esc(s.phone) || "—"}
                        </td>


                        <td>

                            <span
                                class="badge ${
                                    s.present
                                    ? "ok"
                                    : "no"
                                }"
                            >
                                ${
                                    s.present
                                    ? "Keldi"
                                    : "Kelmadi"
                                }
                            </span>

                        </td>


                        <td class="late-cell">

                            ${
                                s.late
                                ?
                                `
                                <span
                                    class="badge late"
                                >
                                    ⏰ Kechikdi
                                </span>
                                `
                                :
                                `
                                <span
                                    class="badge no-late"
                                >
                                    —
                                </span>
                                `
                            }

                        </td>


                        <td class="ball-cell">

                            ${
                                score === "" ||
                                score === null ||
                                score === undefined
                                ?
                                `
                                <span
                                    class="
                                        ball-badge
                                        ball-empty
                                    "
                                >
                                    —
                                </span>
                                `
                                :
                                `
                                <span
                                    class="
                                        ball-badge
                                        ${getBallClass(score)}
                                    "
                                >
                                    ${score}/10
                                </span>
                                `
                            }

                        </td>


                        <td>

                            <div
                                class="row-actions"
                            >

                                <button
                                    type="button"
                                    class="
                                        small-btn
                                        attendance-btn
                                    "
                                    onclick="
                                        toggle(${index})
                                    "
                                >
                                    ${
                                        s.present
                                        ? "❌ Kelmagan"
                                        : "✅ Keldi"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="
                                        small-btn
                                        late-btn
                                    "
                                    onclick="
                                        toggleLate(${index})
                                    "
                                >
                                    ⏰
                                    ${
                                        s.late
                                        ? "Bekor qilish"
                                        : "Kechikdi"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="
                                        small-btn
                                        photo-btn
                                    "
                                    onclick="
                                        choosePhoto(${index})
                                    "
                                >
                                    📷 Rasm
                                </button>


                                <button
                                    type="button"
                                    class="
                                        small-btn
                                        edit-btn
                                    "
                                    onclick="
                                        editStudent(${index})
                                    "
                                >
                                    ✏️ Ma’lumot
                                </button>


                                <button
                                    type="button"
                                    class="
                                        small-btn
                                        delete-btn
                                    "
                                    onclick="
                                        removeStudent(${index})
                                    "
                                >
                                    🗑️ Chiqarish
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");
    }


    const total =
        document.getElementById("total");

    const present =
        document.getElementById("present");

    const absent =
        document.getElementById("absent");

    const lateTotal =
        document.getElementById("lateTotal");


    if (total) {
        total.textContent =
            active.length;
    }

    if (present) {
        present.textContent =
            active.filter(
                s => s.present
            ).length;
    }

    if (absent) {
        absent.textContent =
            active.filter(
                s => !s.present
            ).length;
    }

    if (lateTotal) {
        lateTotal.textContent =
            active.filter(
                s => s.late
            ).length;
    }
}


/* =========================================
   DAVOMAT
========================================= */

function toggle(index) {

    const student =
        students[index];

    if (!student) return;


    student.present =
        !student.present;


    if (!student.present) {
        student.late = false;
    }


    saveData();
    render();
}


function toggleLate(index) {

    const student =
        students[index];

    if (!student) return;


    student.late =
        !student.late;


    if (student.late) {
        student.present = true;
    }


    saveData();
    render();
}


/* =========================================
   O‘QUVCHINI CHIQARISH
========================================= */

function removeStudent(index) {

    if (!students[index]) return;


    const full =
        `${students[index].surname} ${students[index].name}`
            .trim();


    if (
        confirm(
            `${full} o‘quvchini ro‘yxatdan chiqarasizmi?`
        )
    ) {

        students.splice(index, 1);

        saveData();

        render();
    }
}


/* =========================================
   RASM
========================================= */

function choosePhoto(index) {

    const input =
        document.createElement("input");

    input.type = "file";
    input.accept = "image/*";


    input.onchange = () => {

        if (!input.files[0]) return;


        const reader =
            new FileReader();


        reader.onload = event => {

            students[index].photo =
                event.target.result;

            saveData();

            render();
        };


        reader.readAsDataURL(
            input.files[0]
        );
    };


    input.click();
}


/* =========================================
   O‘QUVCHI QO‘SHISH MODALI
========================================= */

function openModal() {

    const modal =
        document.getElementById("modal");

    if (!modal) return;


    modal.style.display = "flex";


    const modalClassName =
        document.getElementById(
            "modalClassName"
        );

    if (modalClassName) {
        modalClassName.textContent =
            currentClass;
    }


    showAddMode("bulk");

    updateCount();
}


function closeModal() {

    const modal =
        document.getElementById("modal");

    if (!modal) return;

    modal.style.display = "none";
}


function updateCount() {

    const bulk =
        document.getElementById("bulk");

    const text =
        document.getElementById(
            "countText"
        );

    if (!bulk || !text) return;


    const count =
        bulk.value
            .split(/\r?\n/)
            .map(x => x.trim())
            .filter(Boolean)
            .length;


    text.textContent =
        `${count} / 40 ta o‘quvchi`;


    text.style.color =
        count > 40
        ? "#b42318"
        : "#315efb";
}

const bulkInput =
    document.getElementById("bulk");

if (bulkInput) {
    bulkInput.addEventListener(
        "input",
        updateCount
    );
}


/* =========================================
   FILE NOMLARI
========================================= */

function setupFileName(
    inputId,
    outputId
) {

    const input =
        document.getElementById(inputId);

    const output =
        document.getElementById(outputId);

    if (!input || !output) return;


    input.addEventListener(
        "change",
        () => {

            output.textContent =
                input.files[0]
                ? input.files[0].name
                : "Rasm tanlanmagan";

        }
    );
}


setupFileName(
    "photo",
    "photoName"
);

setupFileName(
    "singlePhoto",
    "singlePhotoName"
);

setupFileName(
    "profilePhoto",
    "profilePhotoName"
);

setupFileName(
    "editPhoto",
    "editPhotoName"
);


/* =========================================
   BIRTA O‘QUVCHI RASMI
========================================= */

const singlePhoto =
    document.getElementById(
        "singlePhoto"
    );


if (singlePhoto) {

    singlePhoto.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const preview =
                        document.getElementById(
                            "singlePreview"
                        );

                    const icon =
                        document.getElementById(
                            "singlePhotoIcon"
                        );


                    if (preview) {

                        preview.src =
                            event.target.result;

                        preview.style.display =
                            "block";
                    }


                    if (icon) {
                        icon.style.display =
                            "none";
                    }
                };


            reader.readAsDataURL(file);
        }
    );
}


/* =========================================
   PROFIL RASMI
========================================= */

const profilePhoto =
    document.getElementById(
        "profilePhoto"
    );


if (profilePhoto) {

    profilePhoto.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const preview =
                        document.getElementById(
                            "profilePreview"
                        );

                    const icon =
                        document.getElementById(
                            "profilePhotoIcon"
                        );


                    if (preview) {

                        preview.src =
                            event.target.result;

                        preview.style.display =
                            "block";
                    }


                    if (icon) {
                        icon.style.display =
                            "none";
                    }
                };


            reader.readAsDataURL(file);
        }
    );
}


/* =========================================
   KO‘P O‘QUVCHI QO‘SHISH
========================================= */

function addStudent() {

    const bulk =
        document.getElementById("bulk");

    if (!bulk) return;


    const lines =
        bulk.value
            .split(/\r?\n/)
            .map(x => x.trim())
            .filter(Boolean);


    if (!lines.length) {

        alert(
            "O‘quvchilar ro‘yxatini kiriting."
        );

        return;
    }


    if (lines.length > 40) {

        alert(
            "Bir martada maksimal 40 ta o‘quvchi qo‘shiladi."
        );

        return;
    }


    const photoInput =
        document.getElementById("photo");

    const file =
        photoInput?.files?.[0];


    const finish =
        photo => {

            lines.forEach(line => {

                const cols =
                    line
                        .split(
                            /\t+|\s*\|\s*/
                        )
                        .map(x => x.trim())
                        .filter(Boolean);


                let person =
                    parseFullName(
                        cols
                            .slice(0, 3)
                            .join(" ")
                    );


                let year =
                    cols[3] || "";


                let address =
                    cols[4] || "";


                let phone =
                    cols[5] || "";


                if (cols.length <= 3) {

                    person =
                        parseFullName(line);

                    year = "";
                    address = "";
                    phone = "";
                }


                students.push({

                    name:
                        person.name,

                    surname:
                        person.surname,

                    father:
                        person.father,

                    year,

                    address,

                    phone,

                    present: true,

                    late: false,

                    left: false,

                    photo:
                        photo || ""
                });

            });


            saveData();


            bulk.value = "";


            if (photoInput) {
                photoInput.value = "";
            }


            const photoName =
                document.getElementById(
                    "photoName"
                );

            if (photoName) {
                photoName.textContent =
                    "Rasm tanlanmagan";
            }


            updateCount();

            closeModal();

            render();


            alert(
                `${lines.length} ta o‘quvchi ` +
                `${currentClass} sinfiga qo‘shildi! 🎉`
            );
        };


    if (file) {

        const reader =
            new FileReader();


        reader.onload =
            event =>
                finish(
                    event.target.result
                );


        reader.readAsDataURL(file);

    } else {

        finish("");
    }
}


/* =========================================
   BITTA O‘QUVCHI QO‘SHISH
========================================= */

function addSingleStudent() {

    const surname =
        document
            .getElementById("singleSurname")
            ?.value
            .trim() || "";


    const name =
        document
            .getElementById("singleName")
            ?.value
            .trim() || "";


    const father =
        document
            .getElementById("singleFather")
            ?.value
            .trim() || "";


    const year =
        document
            .getElementById("singleYear")
            ?.value
            .trim() || "";


    const address =
        document
            .getElementById("singleAddress")
            ?.value
            .trim() || "";


    const phone =
        document
            .getElementById("singlePhone")
            ?.value
            .trim() || "";


    if (!surname || !name) {

        alert(
            "Familiya va ismni kiriting."
        );

        return;
    }


    const photoInput =
        document.getElementById(
            "singlePhoto"
        );

    const file =
        photoInput?.files?.[0];


    const finish =
        photo => {

            students.push({

                name,

                surname,

                father,

                year,

                address,

                phone,

                present: true,

                late: false,

                left: false,

                photo:
                    photo || ""
            });


            saveData();

            clearSingleStudentForm();

            closeModal();

            render();


            alert(
                `1 ta o‘quvchi ` +
                `${currentClass} sinfiga qo‘shildi! 🎉`
            );
        };


    if (file) {

        const reader =
            new FileReader();


        reader.onload =
            event =>
                finish(
                    event.target.result
                );


        reader.readAsDataURL(file);

    } else {

        finish("");
    }
}


/* =========================================
   BITTA O‘QUVCHI FORMASINI TOZALASH
========================================= */

function clearSingleStudentForm() {

    [
        "singleSurname",
        "singleName",
        "singleFather",
        "singleYear",
        "singleAddress",
        "singlePhone"
    ].forEach(id => {

        const el =
            document.getElementById(id);

        if (el) {
            el.value = "";
        }
    });


    const photo =
        document.getElementById(
            "singlePhoto"
        );

    if (photo) {
        photo.value = "";
    }


    const photoName =
        document.getElementById(
            "singlePhotoName"
        );

    if (photoName) {

        photoName.textContent =
            "Rasm tanlanmagan";
    }


    const preview =
        document.getElementById(
            "singlePreview"
        );

    if (preview) {
        preview.style.display =
            "none";
    }


    const icon =
        document.getElementById(
            "singlePhotoIcon"
        );

    if (icon) {
        icon.style.display =
            "block";
    }
}


/* =========================================
   O‘QUVCHINI TAHRIRLASH
========================================= */

function editStudent(index) {

    const student =
        students[index];

    if (!student) return;


    const year =
        prompt(
            "Tug‘ilgan yil:",
            student.year || ""
        );


    if (year === null) return;


    const address =
        prompt(
            "Yashash manzili:",
            student.address || ""
        );


    if (address === null) return;


    const phone =
        prompt(
            "Ota-ona telefoni:",
            student.phone || ""
        );


    if (phone === null) return;


    student.year =
        year.trim();

    student.address =
        address.trim();

    student.phone =
        phone.trim();


    saveData();

    render();
}


/* =========================================
   QO‘SHISH REJIMI
========================================= */

function showAddMode(mode) {

    const bulkMode =
        document.getElementById(
            "bulkMode"
        );

    const singleMode =
        document.getElementById(
            "singleMode"
        );

    const bulkTab =
        document.getElementById(
            "bulkTab"
        );

    const singleTab =
        document.getElementById(
            "singleTab"
        );


    if (
        !bulkMode ||
        !singleMode ||
        !bulkTab ||
        !singleTab
    ) {
        return;
    }


    if (mode === "single") {

        bulkMode.style.display =
            "none";

        singleMode.style.display =
            "block";

        bulkTab.classList.remove(
            "active"
        );

        singleTab.classList.add(
            "active"
        );

    } else {

        bulkMode.style.display =
            "block";

        singleMode.style.display =
            "none";

        singleTab.classList.remove(
            "active"
        );

        bulkTab.classList.add(
            "active"
        );
    }
}


/* =========================================
   OCR
========================================= */

function normalizeOcrLines(text) {

    const raw =
        text
            .split(/\r?\n/)
            .map(x => x.trim())
            .filter(Boolean);


    const output = [];


    for (let line of raw) {

        line =
            line
                .replace(
                    /^[\s•\-–—]+/,
                    ""
                )
                .replace(
                    /^\d+[\s.)-]+/,
                    ""
                )
                .trim();


        if (line.length < 3) {
            continue;
        }


        if (
            /^(№|ism|familiya|f\.?i\.?sh\.?|o['‘’`]?quvchi|tug['‘’`]?ilgan yil|yashash manzili|davomat)$/i
                .test(line)
        ) {
            continue;
        }


        output.push(line);
    }


    return [
        ...new Set(output)
    ].slice(0, 40);
}


/* =========================================
   OCR RASM
========================================= */

async function importListImage(event) {

    const file =
        event.target.files?.[0];

    if (!file) return;


    if (
        typeof Tesseract ===
        "undefined"
    ) {

        alert(
            "Rasm o‘qish moduli yuklanmadi. Internetni tekshiring."
        );

        return;
    }


    const box =
        document.getElementById(
            "ocrBox"
        );

    const bar =
        document.getElementById(
            "ocrBar"
        );

    const text =
        document.getElementById(
            "ocrText"
        );


    if (box) {
        box.style.display =
            "flex";
    }

    if (bar) {
        bar.style.width =
            "0%";
    }

    if (text) {
        text.textContent =
            "📷 Rasm tayyorlanmoqda... 0%";
    }


    try {

        const image =
            await new Promise(
                (resolve, reject) => {

                    const img =
                        new Image();

                    img.onload =
                        () => resolve(img);

                    img.onerror =
                        reject;

                    img.src =
                        URL.createObjectURL(
                            file
                        );
                }
            );


        const scale =
            Math.min(
                3,
                Math.max(
                    1,
                    2200 / image.width
                )
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            Math.round(
                image.width * scale
            );

        canvas.height =
            Math.round(
                image.height * scale
            );


        const ctx =
            canvas.getContext("2d");


        ctx.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );


        const imageData =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );


        for (
            let i = 0;
            i < imageData.data.length;
            i += 4
        ) {

            const gray =
                Math.round(
                    imageData.data[i] *
                    0.299 +

                    imageData.data[i + 1] *
                    0.587 +

                    imageData.data[i + 2] *
                    0.114
                );


            imageData.data[i] =
                gray;

            imageData.data[i + 1] =
                gray;

            imageData.data[i + 2] =
                gray;
        }


        ctx.putImageData(
            imageData,
            0,
            0
        );


        const result =
            await Tesseract.recognize(
                canvas.toDataURL(
                    "image/png"
                ),
                "eng",
                {
                    logger: message => {

                        if (
                            message.status ===
                            "recognizing text"
                        ) {

                            const percent =
                                Math.round(
                                    (
                                        message.progress ||
                                        0
                                    ) * 100
                                );


                            if (bar) {
                                bar.style.width =
                                    `${percent}%`;
                            }


                            if (text) {
                                text.textContent =
                                    `🔎 Rasm o‘qilmoqda... ${percent}%`;
                            }
                        }
                    }
                }
            );


        const lines =
            normalizeOcrLines(
                result.data.text || ""
            );


        if (!lines.length) {

            alert(
                "O‘quvchilar topilmadi. Rasmni tiniqroq yuboring."
            );

            return;
        }


        const bulk =
            document.getElementById(
                "bulk"
            );


        if (bulk) {
            bulk.value =
                lines.join("\n");
        }


        updateCount();

        openModal();


        alert(
            `${lines.length} ta qator topildi. ` +
            `Tekshirib, qo‘shish tugmasini bosing. 🎉`
        );

    } catch (error) {

        console.error(error);

        alert(
            "Rasmni o‘qishda xatolik bo‘ldi."
        );

    } finally {

        if (box) {
            box.style.display =
                "none";
        }

        event.target.value = "";
    }
}
/* =========================================
   EXCEL IMPORT
========================================= */

function importExcel(event) {

    const file =
        event.target.files?.[0];

    if (!file) return;


    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel moduli yuklanmadi."
        );

        event.target.value = "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        event => {

            try {

                const workbook =
                    XLSX.read(
                        event.target.result,
                        {
                            type: "array"
                        }
                    );


                const sheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        sheet,
                        {
                            header: 1,
                            defval: ""
                        }
                    );


                let added = 0;


                rows.forEach(row => {

                    const values =
                        row.map(
                            value =>
                                String(
                                    value ?? ""
                                ).trim()
                        );


                    if (
                        !values.some(Boolean)
                    ) {
                        return;
                    }


                    const low =
                        values.map(
                            value =>
                                value.toLowerCase()
                        );


                    if (
                        low.includes(
                            "familiya"
                        ) ||

                        low.includes(
                            "f.i.sh."
                        ) ||

                        low.includes(
                            "ota-ona telefoni"
                        ) ||

                        low.includes(
                            "tug‘ilgan yili"
                        ) ||

                        low.includes(
                            "tug‘ilgan yil"
                        )
                    ) {
                        return;
                    }


                    let full = "";

                    let year = "";

                    let address = "";

                    let phone = "";

                    let present = true;

                    let late = false;

                    let ball = "";


                    /*
                     10 USTUNLIK FORMAT:

                     №
                     Rasm
                     Familiya
                     Ism
                     Tug‘ilgan yili
                     Yashash manzili
                     Ota-ona telefoni
                     Davomat
                     Kechikish
                     Bal
                    */

                    if (
                        values.length >= 10 &&
                        /^\d+$/.test(
                            values[0]
                        )
                    ) {

                        full =
                            `${values[2] || ""} ` +
                            `${values[3] || ""}`
                                .trim();


                        year =
                            values[4] || "";


                        address =
                            values[5] || "";


                        phone =
                            values[6] || "";


                        present =
                            !/kelmadi/i.test(
                                values[7] || ""
                            );


                        late =
                            /kechik/i.test(
                                values[8] || ""
                            );


                        if (
                            values[9] !== ""
                        ) {

                            const n =
                                Number(
                                    values[9]
                                );


                            if (
                                !Number.isNaN(n)
                            ) {

                                ball =
                                    Math.max(
                                        0,
                                        Math.min(
                                            10,
                                            n
                                        )
                                    );
                            }
                        }

                    }

                    /*
                     ESKI FORMAT
                    */

                    else if (
                        values.length >= 7 &&
                        /^\d+$/.test(
                            values[0]
                        )
                    ) {

                        full =
                            values
                                .slice(1, 4)
                                .filter(Boolean)
                                .join(" ");


                        year =
                            values[4] || "";


                        address =
                            values[5] || "";


                        phone =
                            values[6] || "";

                    }

                    /*
                     ODDIY FORMAT
                    */

                    else {

                        full =
                            values
                                .slice(0, 3)
                                .filter(Boolean)
                                .join(" ");


                        year =
                            values[3] || "";


                        address =
                            values[4] || "";


                        phone =
                            values[5] || "";
                    }


                    const person =
                        parseFullName(full);


                    if (
                        !person.surname &&
                        !person.name
                    ) {
                        return;
                    }


                    const student = {

                        name:
                            person.name,

                        surname:
                            person.surname,

                        father:
                            person.father,

                        year,

                        address,

                        phone,

                        present,

                        late,

                        left: false,

                        photo: ""
                    };


                    if (
                        ball !== ""
                    ) {

                        student.ball =
                            ball;
                    }


                    students.push(
                        student
                    );


                    added++;
                });


                saveData();

                render();


                alert(
                    `${added} ta o‘quvchi ` +
                    `${currentClass} sinfiga ` +
                    `Excel'dan qo‘shildi! 🎉`
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Excel faylni o‘qib bo‘lmadi."
                );
            }
        };


    reader.readAsArrayBuffer(file);

    event.target.value = "";
}


/* =========================================
   EXCEL EXPORT
========================================= */

async function exportExcel() {

    const active =
        students.filter(
            student => !student.left
        );


    if (!active.length) {

        alert(
            "Bu sinfda eksport qilinadigan o‘quvchi yo‘q."
        );

        return;
    }


    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "Excel moduli yuklanmadi. " +
            "Internetni tekshiring va sahifani qayta oching."
        );

        return;
    }


    try {

        /*
         EXACT EXCEL USTUNLARI:
         
         №
         Rasm
         Familiya
         Ism
         Tug‘ilgan yili
         Yashash manzili
         Ota-ona telefoni
         Davomat
         Kechikish
         Bal
        */

        const rows = [[

            "№",

            "Rasm",

            "Familiya",

            "Ism",

            "Tug‘ilgan yili",

            "Yashash manzili",

            "Ota-ona telefoni",

            "Davomat",

            "Kechikish",

            "Bal"

        ]];


        active.forEach(
            (student, index) => {

                const ball =
                    getStudentBall(
                        student
                    );


                rows.push([

                    index + 1,

                    student.photo
                        ? "Rasm"
                        : "—",

                    student.surname ||
                        "",

                    student.name ||
                        "",

                    student.year ||
                        "—",

                    student.address ||
                        "—",

                    student.phone ||
                        "—",

                    student.present
                        ? "Keldi"
                        : "Kelmadi",

                    student.late
                        ? "Kechikib keldi"
                        : "Yo‘q",

                    ball === ""
                        ? ""
                        : Number(ball)

                ]);
            }
        );


        const worksheet =
            XLSX.utils.aoa_to_sheet(
                rows
            );


        /*
         EXCEL USTUN KENGLIKLARI
        */

        worksheet["!cols"] = [

            { wch: 6 },

            { wch: 12 },

            { wch: 20 },

            { wch: 18 },

            { wch: 16 },

            { wch: 30 },

            { wch: 22 },

            { wch: 14 },

            { wch: 20 },

            { wch: 10 }

        ];


        worksheet["!autofilter"] = {

            ref:
                `A1:J${rows.length}`
        };


        const workbook =
            XLSX.utils.book_new();


        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            `${currentClass} sinf`

        );


        XLSX.writeFile(

            workbook,

            `Ustozim_${currentClass}_oquvchilar.xlsx`

        );


        alert(

            `${active.length} ta o‘quvchi ` +
            `${currentClass} sinfi uchun ` +
            `Excelga chiqarildi! 🎉`

        );

    } catch (error) {

        console.error(
            "Excel export xatosi:",
            error
        );


        alert(
            "Excel chiqarishda xatolik bo‘ldi: " +
            error.message
        );
    }
}


/* =========================================
   O‘QITUVCHI PROFILI
========================================= */

let teacherProfile =
    JSON.parse(
        localStorage.getItem(
            PROFILE_KEY
        ) || "null"
    );


function applyTeacherProfile() {

    if (!teacherProfile) return;


    const fullName =
        `${teacherProfile.firstName} ` +
        `${teacherProfile.lastName}`
            .trim();


    const box =
        document.getElementById(
            "teacherProfile"
        );


    if (!box) return;


    box.innerHTML =

        teacherProfile.photo

        ?

        `
        <img
            class="avatar"
            style="
                width:36px;
                height:36px;
                margin-right:3px
            "
            src="${esc(
                teacherProfile.photo
            )}"
            alt="Profil rasmi"
        >

        <span>
            O‘qituvchi:
        </span>

        <b id="teacherName">
            ${esc(fullName)}
        </b>

        <span>
            ▾
        </span>
        `

        :

        `
        🎓

        <span>
            O‘qituvchi:
        </span>

        <b id="teacherName">
            ${esc(fullName)}
        </b>

        <span>
            ▾
        </span>
        `;
}


/* =========================================
   PROFILNI SAQLASH
========================================= */

function saveProfile() {

    const firstName =
        document
            .getElementById(
                "editFirstName"
            )
            ?.value
            .trim() || "";


    const lastName =
        document
            .getElementById(
                "editLastName"
            )
            ?.value
            .trim() || "";


    const classesText =
        document
            .getElementById(
                "editClasses"
            )
            ?.value
            .trim() || "";


    const error =
        document.getElementById(
            "profileError"
        );


    if (
        !firstName ||
        !lastName ||
        !classesText
    ) {

        if (error) {

            error.textContent =
                "Ism, familiya va sinflarni kiriting.";

            error.style.display =
                "block";

        } else {

            alert(
                "Ism, familiya va sinflarni kiriting."
            );
        }

        return;
    }


    const classes =
        classesText
            .split(",")
            .map(x => x.trim())
            .filter(Boolean);


    if (!classes.length) {

        alert(
            "Kamida bitta sinf kiriting."
        );

        return;
    }


    const file =
        document
            .getElementById(
                "profilePhoto"
            )
            ?.files?.[0];


    const finish =
        photo => {

            teacherProfile = {

                ...(teacherProfile || {}),

                firstName,

                lastName,

                classes,

                photo:
                    photo || ""
            };


            localStorage.setItem(

                PROFILE_KEY,

                JSON.stringify(
                    teacherProfile
                )
            );


            localStorage.setItem(

                "ustozimProfileV2",

                JSON.stringify(
                    teacherProfile
                )
            );


            localStorage.setItem(

                "ustozimClassesV2",

                JSON.stringify(
                    classes
                )
            );


            currentClass =
                classes[0];


            localStorage.setItem(

                CLASS_KEY,

                currentClass
            );


            localStorage.setItem(

                "ustozimCurrentClass",

                currentClass
            );


            students =
                ensureClass(
                    currentClass
                );


            applyTeacherProfile();


            const gate =
                document.getElementById(
                    "profileGate"
                );


            if (gate) {

                gate.style.display =
                    "none";
            }


            renderMyClasses(
                classes
            );


            render();
        };


    if (file) {

        const reader =
            new FileReader();


        reader.onload =
            event =>
                finish(
                    event.target.result
                );


        reader.readAsDataURL(file);

    } else {

        finish("");
    }
}/* =========================================
   PROFIL EDITOR
========================================= */

function openProfileEditor() {

    if (!teacherProfile) return;


    const first =
        document.getElementById(
            "editFirstName"
        );

    const last =
        document.getElementById(
            "editLastName"
        );

    const classes =
        document.getElementById(
            "editClasses"
        );

    const preview =
        document.getElementById(
            "editPreview"
        );


    if (first) {

        first.value =
            teacherProfile.firstName ||
            "";
    }


    if (last) {

        last.value =
            teacherProfile.lastName ||
            "";
    }


    if (classes) {

        classes.value =
            (
                teacherProfile.classes ||
                []
            ).join(", ");
    }


    if (preview) {

        if (teacherProfile.photo) {

            preview.src =
                teacherProfile.photo;

            preview.style.display =
                "block";

        } else {

            preview.removeAttribute(
                "src"
            );

            preview.style.display =
                "none";
        }
    }


    const editor =
        document.getElementById(
            "profileEditor"
        );


    if (editor) {

        editor.style.display =
            "flex";
    }
}


function closeProfileEditor() {

    const editor =
        document.getElementById(
            "profileEditor"
        );

    if (editor) {

        editor.style.display =
            "none";
    }
}


/* =========================================
   PROFILNI YANGILASH
========================================= */

function updateProfile() {

    const firstName =
        document
            .getElementById(
                "editFirstName"
            )
            ?.value
            .trim() || "";


    const lastName =
        document
            .getElementById(
                "editLastName"
            )
            ?.value
            .trim() || "";


    const classesText =
        document
            .getElementById(
                "editClasses"
            )
            ?.value
            .trim() || "";


    if (
        !firstName ||
        !lastName ||
        !classesText
    ) {

        alert(
            "❗ Ism, familiya va sinflarni kiriting!"
        );

        return;
    }


    const classes =
        classesText
            .split(",")
            .map(x => x.trim())
            .filter(Boolean);


    if (!classes.length) {

        alert(
            "Kamida bitta sinf kiriting."
        );

        return;
    }


    const file =
        document
            .getElementById(
                "editPhoto"
            )
            ?.files?.[0];


    const finish =
        photo => {

            teacherProfile = {

                ...(teacherProfile || {}),

                firstName,

                lastName,

                classes,

                photo:
                    photo !== null
                    ? photo
                    : (
                        teacherProfile?.photo ||
                        ""
                    )
            };


            localStorage.setItem(

                PROFILE_KEY,

                JSON.stringify(
                    teacherProfile
                )
            );


            localStorage.setItem(

                "ustozimProfileV2",

                JSON.stringify(
                    teacherProfile
                )
            );


            localStorage.setItem(

                "ustozimClassesV2",

                JSON.stringify(
                    classes
                )
            );


            if (
                !classes.includes(
                    currentClass
                )
            ) {

                currentClass =
                    classes[0];


                localStorage.setItem(

                    CLASS_KEY,

                    currentClass
                );


                localStorage.setItem(

                    "ustozimCurrentClass",

                    currentClass
                );


                students =
                    ensureClass(
                        currentClass
                    );
            }


            applyTeacherProfile();

            renderMyClasses(
                classes
            );

            closeProfileEditor();

            render();
        };


    if (file) {

        const reader =
            new FileReader();


        reader.onload =
            event =>
                finish(
                    event.target.result
                );


        reader.readAsDataURL(file);

    } else {

        finish(null);
    }
}


/* =========================================
   EDIT PROFIL RASMI
========================================= */

const editPhoto =
    document.getElementById(
        "editPhoto"
    );


if (editPhoto) {

    editPhoto.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const preview =
                        document.getElementById(
                            "editPreview"
                        );


                    if (preview) {

                        preview.src =
                            event.target.result;

                        preview.style.display =
                            "block";
                    }
                };


            reader.readAsDataURL(file);
        }
    );
}


/* =========================================
   TEMA
========================================= */

function applyTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        ) || "light";


    const button =
        document.getElementById(
            "themeBtn"
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );


        if (button) {

            button.textContent =
                "☀️";

            button.title =
                "Kunduzgi rejim";
        }

    } else {

        document.body.classList.remove(
            "dark-mode"
        );


        if (button) {

            button.textContent =
                "🌙";

            button.title =
                "Tungi rejim";
        }
    }
}


function toggleTheme() {

    const dark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(

        THEME_KEY,

        dark
        ? "light"
        : "dark"
    );


    applyTheme();
}


/* =========================================
   MODAL YOPISH
========================================= */

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "modal"
            );


        const editor =
            document.getElementById(
                "profileEditor"
            );


        const resumeModal =
            document.getElementById(
                "resumeModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();
        }


        if (
            editor &&
            event.target === editor
        ) {

            closeProfileEditor();
        }


        if (
            resumeModal &&
            event.target === resumeModal
        ) {

            closeResume();
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeModal();

            closeProfileEditor();

            closeClassDropdown();

            closeResume();
        }
    }
);


/* =========================================
   BAHOLASH
========================================= */

function getSavedGrades() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "ustozim_baholar"
            ) || "{}"
        ) || {};

    } catch {

        return {};
    }
}


function saveGradesToStorage(
    grades
) {

    localStorage.setItem(

        "ustozim_baholar",

        JSON.stringify(
            grades
        )
    );
}


let gradingStudents = [];


/* =========================================
   BAHOLASH MODALI
========================================= */

function openGradingModal() {

    const modal =
        document.getElementById(
            "gradingModal"
        );


    if (!modal) return;


    gradingStudents =
        students.filter(
            s => !s.left
        );


    buildGradingList();


    modal.classList.add(
        "show"
    );


    modal.style.display =
        "flex";
}


function closeGradingModal() {

    const modal =
        document.getElementById(
            "gradingModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    modal.style.display =
        "none";
}


/* =========================================
   BAHOLARNI RO‘YXAT QILISH
========================================= */

function buildGradingList() {

    const list =
        document.getElementById(
            "gradingList"
        );


    if (!list) return;


    const grades =
        getSavedGrades();


    list.innerHTML = "";


    if (!gradingStudents.length) {

        list.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:40px;
                    color:#64748b
                "
            >

                <div
                    style="
                        font-size:45px
                    "
                >
                    👨‍🎓
                </div>

                <h3>
                    O‘quvchilar topilmadi
                </h3>

                <p>
                    Avval sinfga
                    o‘quvchilarni qo‘shing.
                </p>

            </div>

        `;


        calculateAverage();

        return;
    }


    gradingStudents.forEach(
        (student, index) => {

            const key =
                gradeKey(student);


            const score =

                student.ball !== undefined &&
                student.ball !== null &&
                student.ball !== ""

                ?

                student.ball

                :

                (
                    grades[key] ??
                    ""
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "grading-row";


            row.innerHTML = `

                <div
                    class="grading-number"
                >
                    ${index + 1}
                </div>


                <div
                    class="grading-student"
                >

                    ${
                        student.photo
                        ?

                        `
                        <img
                            class="
                                grading-student-img
                            "
                            src="${esc(
                                student.photo
                            )}"
                            alt=""
                        >
                        `

                        :

                        `
                        <div
                            class="
                                grading-student-img
                            "
                        >
                            👨‍🎓
                        </div>
                        `
                    }


                    <span>
                        ${esc(
                            student.surname
                        )}
                        ${esc(
                            student.name
                        )}
                    </span>

                </div>


                <input

                    class="grading-input"

                    type="number"

                    min="0"

                    max="10"

                    step="1"

                    value="${score}"

                    placeholder="0–10"

                    data-index="${students.indexOf(
                        student
                    )}"

                    oninput="
                        changeGrade(this)
                    "

                >


                <div
                    class="grade-result"
                >
                    ${
                        score !== ""
                        ?
                        `${score} — ${getGradeText(
                            score
                        )}`
                        :
                        "Ball kiriting"
                    }
                </div>

            `;


            list.appendChild(row);
        }
    );


    updateAllGradeResults();

    calculateAverage();
}


/* =========================================
   BAHO RANGI
========================================= */

function getGradeClass(score) {

    score = Number(score);


    if (score >= 9) {
        return "green";
    }


    if (score >= 7) {
        return "yellow";
    }


    return "red";
}


function getGradeText(score) {

    score = Number(score);


    if (score >= 9) {
        return "A’lo";
    }


    if (score >= 7) {
        return "Yaxshi";
    }


    return "Qoniqarsiz";
}


/* =========================================
   BALL O‘ZGARISHI
========================================= */

function changeGrade(input) {

    let value =
        input.value;


    if (value !== "") {

        let number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            input.value =
                "";

        } else {

            number =
                Math.max(
                    0,
                    Math.min(
                        10,
                        number
                    )
                );


            input.value =
                number;
        }
    }


    updateGradeResult(
        input
    );


    calculateAverage();
}


function updateGradeResult(
    input
) {

    const result =
        input.parentElement
            ?.querySelector(
                ".grade-result"
            );


    if (!result) return;


    result.className =
        "grade-result";


    if (input.value === "") {

        result.textContent =
            "Ball kiriting";

        return;
    }


    const score =
        Number(input.value);


    result.textContent =
        `${score} — ${getGradeText(
            score
        )}`;


    result.classList.add(
        getGradeClass(
            score
        )
    );
}


function updateAllGradeResults() {

    document
        .querySelectorAll(
            "#gradingList .grading-input"
        )
        .forEach(
            updateGradeResult
        );
}


/* =========================================
   O‘RTACHA BALL
========================================= */

function calculateAverage() {

    const inputs =
        document.querySelectorAll(
            "#gradingList .grading-input"
        );


    let total = 0;

    let count = 0;


    inputs.forEach(
        input => {

            if (
                input.value !== ""
            ) {

                const score =
                    Number(
                        input.value
                    );


                if (
                    !Number.isNaN(
                        score
                    )
                ) {

                    total += score;

                    count++;
                }
            }
        }
    );


    const average =
        count
        ? (total / count).toFixed(1)
        : "0.0";


    const element =
        document.getElementById(
            "averageScore"
        );


    if (element) {

        element.textContent =
            average;
    }
}


/* =========================================
   BARCHA BALLARNI SAQLASH
========================================= */

function saveAllGrades() {

    const grades =
        getSavedGrades();


    document
        .querySelectorAll(
            "#gradingList .grading-input"
        )
        .forEach(
            input => {

                const index =
                    Number(
                        input.dataset.index
                    );


                const student =
                    students[index];


                if (!student) return;


                const key =
                    gradeKey(
                        student
                    );


                const value =
                    input.value;


                if (value === "") {

                    student.ball =
                        "";

                    delete grades[key];

                } else {

                    const score =
                        Math.max(
                            0,
                            Math.min(
                                10,
                                Number(value)
                            )
                        );


                    student.ball =
                        score;


                    grades[key] =
                        score;
                }
            }
        );


    saveGradesToStorage(
        grades
    );


    saveData();

    render();

    closeGradingModal();


    alert(
        "✅ Barcha baholar muvaffaqiyatli saqlandi!"
    );
}


/* =========================================
   REZYUME
========================================= */

function openResume() {

    const modal =
        document.getElementById(
            "resumeModal"
        );


    if (!modal) return;


    const firstName =
        document.getElementById(
            "profileFirstName"
        )?.value ||

        document.getElementById(
            "editFirstName"
        )?.value ||

        teacherProfile?.firstName ||

        "";


    const lastName =
        document.getElementById(
            "profileLastName"
        )?.value ||

        document.getElementById(
            "editLastName"
        )?.value ||

        teacherProfile?.lastName ||

        "";


    const resumeFirstName =
        document.getElementById(
            "resumeFirstName"
        );


    const resumeLastName =
        document.getElementById(
            "resumeLastName"
        );


    const resumeName =
        document.getElementById(
            "resumeName"
        );


    if (resumeFirstName) {

        resumeFirstName.textContent =
            firstName || "—";
    }


    if (resumeLastName) {

        resumeLastName.textContent =
            lastName || "—";
    }


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    if (resumeName) {

        resumeName.textContent =
            fullName ||
            "O‘qituvchi";
    }


    const teacherName =
        document.getElementById(
            "teacherName"
        )?.textContent;


    if (
        !fullName &&
        teacherName &&
        resumeName
    ) {

        resumeName.textContent =
            teacherName;
    }


    const selectedClass =
        document.getElementById(
            "selectedClass"
        )?.textContent ||

        document.getElementById(
            "classTitle"
        )?.textContent ||

        "7-A";


    const resumeClass =
        document.getElementById(
            "resumeClass"
        );


    if (resumeClass) {

        resumeClass.textContent =
            selectedClass;
    }


    const profilePreview =
        document.getElementById(
            "profilePreview"
        );


    const resumePhoto =
        document.getElementById(
            "resumePhoto"
        );


    const resumePhotoIcon =
        document.getElementById(
            "resumePhotoIcon"
        );


    const savedPhoto =
        teacherProfile?.photo || "";


    const photo =
        savedPhoto ||

        (
            profilePreview &&
            profilePreview.src &&
            profilePreview.src !==
                window.location.href
            ?
            profilePreview.src
            :
            ""
        );


    if (
        photo &&
        resumePhoto
    ) {

        resumePhoto.src =
            photo;

        resumePhoto.classList.add(
            "show"
        );


        if (resumePhotoIcon) {

            resumePhotoIcon.style.display =
                "none";
        }

    } else {

        if (resumePhoto) {

            resumePhoto.classList.remove(
                "show"
            );
        }


        if (resumePhotoIcon) {

            resumePhotoIcon.style.display =
                "block";
        }
    }


    modal.classList.add(
        "show"
    );
}


function closeResume() {

    const modal =
        document.getElementById(
            "resumeModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}


/* =========================================
   O‘QITUVCHI SINFLARI
========================================= */

function renderMyClasses(classes) {

    const menu =
        document.getElementById(
            "classDropdownMenu"
        );


    if (!menu) return;


    menu.innerHTML = "";


    classes.forEach(
        className => {

            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "class-dropdown-item";


            item.textContent =
                className;


            item.onclick =
                function () {

                    changeClass(
                        className
                    );
                };


            menu.appendChild(
                item
            );
        }
    );


    updateClassDropdown();
}


/* =========================================
   BOSHLASH
========================================= */

createClassList();

changeClass(
    currentClass
);

applyTheme();


if (teacherProfile) {

    applyTeacherProfile();


    const gate =
        document.getElementById(
            "profileGate"
        );


    if (gate) {

        gate.style.display =
            "none";
    }


    renderMyClasses(
        teacherProfile.classes ||
        []
    );
}


render();


function getProfileClasses() {
    const input = document.getElementById("editClasses");

    if (!input) return [];

    return input.value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}


function saveProfile() {
    const firstName =
        document.getElementById("editFirstName")?.value.trim() || "";

    const lastName =
        document.getElementById("editLastName")?.value.trim() || "";

    const classes =
        getProfileClasses();


    if (!firstName) {
        alert("Ismingizni kiriting!");
        return;
    }

    if (!lastName) {
        alert("Familiyangizni kiriting!");
        return;
    }

    if (!classes.length) {
        alert("Kamida bitta sinf kiriting!");
        return;
    }


    const photoInput =
        document.getElementById("profilePhoto");

    const file =
        photoInput?.files?.[0];


    const finish = (photo) => {

        teacherProfile = {
            ...(teacherProfile || {}),

            firstName: firstName,

            lastName: lastName,

            classes: classes,

            photo:
                photo !== null
                    ? photo
                    : (
                        teacherProfile?.photo || ""
                    )
        };


        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(teacherProfile)
        );


        localStorage.setItem(
            "ustozimProfileV2",
            JSON.stringify(teacherProfile)
        );


        localStorage.setItem(
            "ustozimClassesV2",
            JSON.stringify(classes)
        );


        /*
         * Birinchi sinfni avtomatik ochamiz
         */
        currentClass = classes[0];


        localStorage.setItem(
            CLASS_KEY,
            currentClass
        );


        localStorage.setItem(
            "ustozimCurrentClass",
            currentClass
        );


        students =
            ensureClass(currentClass);


        applyTeacherProfile();


        renderMyClasses(classes);


        updateClassDropdown();


        render();


        closeProfileEditor();


        alert(
            `Profil saqlandi! ${classes.length} ta sinf qo‘shildi. ✅`
        );
    };


    if (file) {

        const reader =
            new FileReader();

        reader.onload = (event) => {

            finish(
                event.target.result
            );
        };

        reader.readAsDataURL(file);

    } else {

        finish(null);
    }
}
function openProfileEditor() {

    const editor =
        document.getElementById("profileEditor");

    if (!editor) return;


    const firstName =
        document.getElementById("editFirstName");

    const lastName =
        document.getElementById("editLastName");

    const classes =
        document.getElementById("editClasses");

    const preview =
        document.getElementById("editPreview");


    if (firstName) {
        firstName.value =
            teacherProfile?.firstName || "";
    }


    if (lastName) {
        lastName.value =
            teacherProfile?.lastName || "";
    }


    if (classes) {

        classes.value =
            (
                teacherProfile?.classes || []
            ).join(", ");
    }


    if (preview) {

        if (teacherProfile?.photo) {

            preview.src =
                teacherProfile.photo;

            preview.style.display =
                "block";

        } else {

            preview.removeAttribute("src");

            preview.style.display =
                "none";
        }
    }


    editor.style.display = "flex";
}

function openProfileEditor() {

    const editor =
        document.getElementById("profileEditor");

    if (!editor) return;


    const firstName =
        document.getElementById("editFirstName");

    const lastName =
        document.getElementById("editLastName");

    const classes =
        document.getElementById("editClasses");

    const preview =
        document.getElementById("editPreview");


    if (firstName) {
        firstName.value =
            teacherProfile?.firstName || "";
    }


    if (lastName) {
        lastName.value =
            teacherProfile?.lastName || "";
    }


    if (classes) {

        classes.value =
            (
                teacherProfile?.classes || []
            ).join(", ");
    }


    if (preview) {

        if (teacherProfile?.photo) {

            preview.src =
                teacherProfile.photo;

            preview.style.display =
                "block";

        } else {

            preview.removeAttribute("src");

            preview.style.display =
                "none";
        }
    }


    editor.style.display = "flex";
}

function renderMyClasses(classes) {

    const menu =
        document.getElementById(
            "classDropdownMenu"
        );


    if (!menu) return;


    menu.innerHTML = "";


    if (!Array.isArray(classes)) {
        classes = [];
    }


    classes.forEach(
        (className) => {

            const item =
                document.createElement("button");


            item.type = "button";


            item.className =
                "class-dropdown-item";


            item.textContent =
                className;


            /*
             * Bosilganda shu sinf ochiladi
             */
            item.onclick = function () {

                changeClass(
                    className
                );

            };


            menu.appendChild(item);
        }
    );


    updateClassDropdown();
}



/* =========================================================
   USTOZIM - YAKUNIY TUZATISHLAR
   Profil, sinflar va jadval funksiyalari
========================================================= */

function normalizeTeacherClasses(value) {
    if (Array.isArray(value)) {
        return value.map(x => String(x).trim()).filter(Boolean);
    }

    return String(value || "")
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);
}

function getTeacherClassList() {
    return normalizeTeacherClasses(teacherProfile?.classes || []);
}

function saveProfile() {
    const firstName = document.getElementById("profileFirstName")?.value.trim() || "";
    const lastName = document.getElementById("profileLastName")?.value.trim() || "";
    const classesText = document.getElementById("profileClasses")?.value.trim() || "";
    const error = document.getElementById("profileError");

    if (!firstName || !lastName || !classesText) {
        if (error) {
            error.textContent = "Ism, familiya va sinflarni kiriting.";
            error.style.display = "block";
        } else {
            alert("Ism, familiya va sinflarni kiriting.");
        }
        return;
    }

    const classes = normalizeTeacherClasses(classesText);

    if (!classes.length) {
        alert("Kamida bitta sinf kiriting.");
        return;
    }

    const photoInput = document.getElementById("profilePhoto");
    const file = photoInput?.files?.[0];

    const finish = (photo) => {
        teacherProfile = {
            ...(teacherProfile || {}),
            firstName,
            lastName,
            classes,
            photo: photo !== null ? photo : (teacherProfile?.photo || "")
        };

        localStorage.setItem(PROFILE_KEY, JSON.stringify(teacherProfile));
        localStorage.setItem("ustozimProfileV2", JSON.stringify(teacherProfile));
        localStorage.setItem("ustozimClassesV2", JSON.stringify(classes));

        currentClass = classes[0];
        localStorage.setItem(CLASS_KEY, currentClass);
        localStorage.setItem("ustozimCurrentClass", currentClass);

        students = ensureClass(currentClass);

        applyTeacherProfile();
        renderMyClasses(classes);
        updateClassDropdown();

        const gate = document.getElementById("profileGate");
        if (gate) gate.style.display = "none";

        render();
        alert(`Profil saqlandi! ${classes.length} ta sinf qo‘shildi. ✅`);
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = event => finish(event.target.result);
        reader.readAsDataURL(file);
    } else {
        finish(null);
    }
}

function renderMyClasses(classes) {
    const menu = document.getElementById("classDropdownMenu");
    if (!menu) return;

    const list = normalizeTeacherClasses(classes);
    menu.innerHTML = "";

    list.forEach(className => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "class-option";
        item.textContent = className;

        item.onclick = () => {
            changeClass(className);
        };

        menu.appendChild(item);
    });

    updateClassDropdown();
}

function changeClass(name) {
    if (!name) return;

    const allowed = getTeacherClassList();

    if (allowed.length && !allowed.includes(name)) {
        name = allowed[0];
    }

    currentClass = name;
    localStorage.setItem(CLASS_KEY, currentClass);
    localStorage.setItem("ustozimCurrentClass", currentClass);

    students = ensureClass(currentClass);

    const classTitle = document.getElementById("classTitle");
    const selectedClass = document.getElementById("selectedClass");
    const panelClass = document.getElementById("panelClass");
    const modalClassName = document.getElementById("modalClassName");

    if (classTitle) classTitle.textContent = `${currentClass} sinf`;
    if (selectedClass) selectedClass.textContent = currentClass;
    if (panelClass) panelClass.textContent = currentClass;
    if (modalClassName) modalClassName.textContent = currentClass;

    updateClassDropdown();
    closeClassDropdown();
    render();
}

function updateClassDropdown() {
    document.querySelectorAll("#classDropdownMenu .class-option, #classDropdownMenu .class-dropdown-item")
        .forEach(btn => {
            btn.classList.toggle("active", btn.textContent.trim() === currentClass);
        });
}

function openProfileEditor() {
    const editor = document.getElementById("profileEditor");
    if (!editor) return;

    const first = document.getElementById("editFirstName");
    const last = document.getElementById("editLastName");
    const classes = document.getElementById("editClasses");
    const preview = document.getElementById("editPreview");

    if (first) first.value = teacherProfile?.firstName || "";
    if (last) last.value = teacherProfile?.lastName || "";
    if (classes) classes.value = getTeacherClassList().join(", ");

    if (preview) {
        if (teacherProfile?.photo) {
            preview.src = teacherProfile.photo;
            preview.style.display = "block";
        } else {
            preview.removeAttribute("src");
            preview.style.display = "none";
        }
    }

    editor.style.display = "flex";
}

function updateProfile() {
    const firstName = document.getElementById("editFirstName")?.value.trim() || "";
    const lastName = document.getElementById("editLastName")?.value.trim() || "";
    const classes = normalizeTeacherClasses(
        document.getElementById("editClasses")?.value || ""
    );

    if (!firstName || !lastName || !classes.length) {
        alert("❗ Ism, familiya va sinflarni kiriting!");
        return;
    }

    const file = document.getElementById("editPhoto")?.files?.[0];

    const finish = (photo) => {
        const oldClasses = getTeacherClassList();

        teacherProfile = {
            ...(teacherProfile || {}),
            firstName,
            lastName,
            classes,
            photo: photo !== null ? photo : (teacherProfile?.photo || "")
        };

        localStorage.setItem(PROFILE_KEY, JSON.stringify(teacherProfile));
        localStorage.setItem("ustozimProfileV2", JSON.stringify(teacherProfile));
        localStorage.setItem("ustozimClassesV2", JSON.stringify(classes));

        if (!classes.includes(currentClass)) {
            currentClass = classes[0];
        }

        localStorage.setItem(CLASS_KEY, currentClass);
        localStorage.setItem("ustozimCurrentClass", currentClass);

        students = ensureClass(currentClass);

        applyTeacherProfile();
        renderMyClasses(classes);
        changeClass(currentClass);
        closeProfileEditor();

        if (oldClasses.join(",") !== classes.join(",")) {
            alert("Profil va sinflar saqlandi. ✅");
        }
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = event => finish(event.target.result);
        reader.readAsDataURL(file);
    } else {
        finish(null);
    }
}
function formatPhone(phone) {
    if (!phone) return "—";

    let digits = String(phone).replace(/\D/g, "");

    if (digits.startsWith("998")) {
        digits = digits.substring(3);
    }

    if (digits.length > 9) {
        digits = digits.substring(0, 9);
    }

    if (digits.length === 9) {
        return `+998 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
    }

    return phone;
}