// ========================================
// SSC RESULT CHECKER
// Clean Worker Version V 4.0 
// Part 1
// ========================================

"use strict";


// ========================================
// API CONFIGURATION
// ========================================




// ========================================
// GLOBAL VARIABLES
// ========================================

let sessionToken = "";

let loadingState = false;


// ========================================
// DOM ELEMENTS
// ========================================


// Form

const resultForm =
    document.getElementById("resultForm");


// Select Inputs

const exam =
    document.getElementById("exam");

const year =
    document.getElementById("year");

const board =
    document.getElementById("board");


// Text Inputs

const roll =
    document.getElementById("roll");

const registration =
    document.getElementById("registration");

const captchaInput =
    document.getElementById("captcha");


// Captcha

const captchaImage =
    document.getElementById("captchaImage");

    const captchaLoader =
    document.getElementById("captchaLoader");

const refreshCaptchaBtn =
    document.getElementById("refreshCaptcha");


// Buttons

const searchBtn =
    document.getElementById("searchBtn");

const resetBtn =
    document.getElementById("resetBtn");

const printBtn =
    document.getElementById("printBtn");


// Messages

const errorBox =
    document.getElementById("errorMessage");


// Result Container

const resultSection =
    document.getElementById("resultSection");


// Student Fields

const studentName =
    document.getElementById("studentName");

const fatherName =
    document.getElementById("fatherName");

const motherName =
    document.getElementById("motherName");


const studentRoll =
    document.getElementById("studentRoll");

const studentRegistration =
    document.getElementById("studentRegistration");


const studentBoard =
    document.getElementById("studentBoard");

const studentGroup =
    document.getElementById("studentGroup");

const studentSession =
    document.getElementById("studentSession");


// Summary

const gpaValue =
    document.getElementById("gpaValue");


const resultStatus =
    document.getElementById("resultStatus");


// Subjects

const subjectTableBody =
    document.getElementById("subjectTableBody");


// ========================================
// API REQUEST FUNCTION
// ========================================

async function apiRequest(url, formData = new FormData()) {

    try {

        const response = await fetch(url, {

            method: "POST",

            body: formData,

            cache: "no-store"

        });

        let json;

        try {

            json = await response.json();

        }

        catch {

            json = {

                ok: false,

                error: "invalid_response",

                message: `Server returned HTTP ${response.status}.`

            };

        }

        return json;

    }

    catch (error) {

        console.error("API Error:", error);

        return {

            ok: false,

            error: "network_error",

            message: "Unable to connect to the result server. Please check your internet connection and try again."

        };

    }

}
// ========================================
// CAPTCHA FUNCTIONS
// ========================================

// When CAPTCHA image loads successfully
captchaImage.onload = function () {

    if (captchaLoader) {
        captchaLoader.style.display = "none";
    }

    captchaImage.style.opacity = "1";

    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.disabled = false;
    }

};

// If CAPTCHA image fails to load
captchaImage.onerror = function () {

    if (captchaLoader) {
        captchaLoader.style.display = "none";
    }

    captchaImage.style.opacity = "1";

    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.disabled = false;
    }

    showError(
        "Failed to load security code. Please refresh."
    );

};

// Load a new CAPTCHA
async function loadCaptcha() {

    // Show loader
    if (captchaLoader) {
        captchaLoader.style.display = "flex";
    }

    // Hide current image while loading
    captchaImage.style.opacity = "0";

    // Prevent multiple refresh clicks
    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.disabled = true;
    }

    try {

        const response =
            await apiRequest(
                API.CAPTCHA
            );

        if (!response.ok) {

    if (response.error === "captcha_unavailable") {

        showError(
            "The official Education Board servers are temporarily busy. Please wait a few minutes and refresh the security code."
        );

        return;

    }

    throw new Error(
        response.message ||
        "Unable to load the security code. Please try again."
    );

}

        // Save session
        sessionToken =
            response.session;

        // Clear previous input
        captchaInput.value = "";

        // Hide any previous error
        hideError();

        // Image will become visible in onload()
        captchaImage.src =
            response.image;

    }

    catch (error) {

        if (captchaLoader) {
            captchaLoader.style.display = "none";
        }

        captchaImage.style.opacity = "1";

        if (refreshCaptchaBtn) {
            refreshCaptchaBtn.disabled = false;
        }

        showError(
            error.message ||
            "Failed to load security code."
        );

    }

}

// ========================================
// ERROR HANDLING
// ========================================


function showError(message) {


    if (!errorBox) return;



    errorBox.textContent =
        message;



    errorBox.style.display =
        "block";


}



function hideError() {


    if (!errorBox) return;



    errorBox.textContent =
        "";



    errorBox.style.display =
        "none";


}



// ========================================
// LOADING FUNCTIONS
// ========================================


function showLoading() {


    loadingState =
        true;



    if (searchBtn) {


        searchBtn.disabled =
            true;



        searchBtn.textContent =
            "Checking...";


    }


}



function hideLoading() {


    loadingState =
        false;



    if (searchBtn) {


        searchBtn.disabled =
            false;



        searchBtn.textContent =
            "Get Result";


    }


}



// ========================================
// SAFE VALUE
// ========================================


function safe(value) {


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";

    }


    return value;


}
// ========================================
// FORM DATA
// ========================================


function getFormData() {


    return {


        exam:
            exam.value,


        year:
            year.value,


        board:
            board.value,


        roll:
            roll.value.trim(),


        reg:
            registration.value.trim(),


        captcha:
            captchaInput.value.trim()


    };


}



// ========================================
// FORM VALIDATION
// ========================================


function validateForm(data) {

    hideError();

    [
        roll,
        registration,
        captchaInput
    ].forEach(input => {

        input.classList.remove("input-error");

    });

    if (!data.roll) {

        roll.classList.add("input-error");
        roll.focus();

        showError("Please enter your Roll Number.");

        return false;

    }

    if (!data.reg) {

        registration.classList.add("input-error");
        registration.focus();

        showError("Please enter your Registration Number.");

        return false;

    }

    if (!data.captcha) {

        captchaInput.classList.add("input-error");
        captchaInput.focus();

        showError("Please enter the Security Code.");

        return false;

    }

    if (!sessionToken) {

        showError("Security code expired. Please refresh it.");

        return false;

    }

    return true;

}



// ========================================
// RESULT API REQUEST
// ========================================


async function fetchResult(data) {


    const formData =
        new FormData();



    formData.append(
        "exam",
        data.exam
    );


    formData.append(
        "year",
        data.year
    );


    formData.append(
        "board",
        data.board
    );


    formData.append(
        "roll",
        data.roll
    );


    formData.append(
        "reg",
        data.reg
    );


    formData.append(
        "captcha",
        data.captcha
    );


    formData.append(
        "session",
        sessionToken
    );


    formData.append(
        "type",
        "1"
    );


    formData.append(
        "result_type",
        "1"
    );



    return await apiRequest(
        API.RESULT,
        formData
    );


}



// ========================================
// SEARCH RESULT
// ========================================


async function searchResult() {


    if (loadingState) return;



    hideError();



    const data =
        getFormData();



    try {


       if (!validateForm(data)) {
    return null;
}



        showLoading();



        const response =
            await fetchResult(data);



        hideLoading();



        if (!response.ok) {


            throw new Error(
                response.message ||
                "Result not found."
            );


        }



        return response.data;



    }


    catch(error) {


        hideLoading();



        throw error;


    }


}
// ========================================
// DISPLAY RESULT
// ========================================


function displayResult(data) {


    if (!data || !data.res) {


        throw new Error(
            "Invalid result data."
        );


    }



    const student =
        data.res;



    studentName.textContent =
        safe(student.name);



    fatherName.textContent =
        safe(student.fname);



    motherName.textContent =
        safe(student.mname);



    studentRoll.textContent =
        safe(student.roll_no);



    studentRegistration.textContent =
        safe(student.regno);



    studentBoard.textContent =
        safe(student.board_name);



    studentGroup.textContent =
        safe(student.stud_group);



    studentSession.textContent =
        safe(student.session);



    gpaValue.textContent =
        extractGPA(student.res_detail);



   resultStatus.textContent =
    safe(student.res_detail);



    renderSubjects(data);



    resultSection.style.display =
        "block";


}



// ========================================
// SUBJECT TABLE
// ========================================


function renderSubjects(data) {


    subjectTableBody.innerHTML = "";


    const gradeMap = {};

    const details =
        data.res.display_details || "";



    if(details){


        details
        .split(",")
        .forEach(item => {


            const parts =
            item.trim().split(":");


            if(parts.length === 2){


                gradeMap[
                    parts[0].trim()
                ] =
                    parts[1].trim();


            }


        });


    }



    if(!data.sub_details){
    return;
}


data.sub_details.forEach(subject => {



        const grade =
        gradeMap[
            subject.SUB_CODE
        ] || "-";



        const point =
        getPoint(grade);



        const row =
        document.createElement("tr");



        row.innerHTML = `

            <td>
                ${subject.SUB_CODE}
            </td>


            <td>
                ${subject.SUB_NAME}
            </td>


            <td>
                ${grade}
            </td>


            <td>
                ${point}
            </td>

        `;



        subjectTableBody.appendChild(row);



    });



}



// =================================
// Grade To Point Conversion
// =================================


function getPoint(grade){


    const points = {


        "A+": "5.00",

        "A": "4.00",

        "A-": "3.50",

        "B": "3.00",

        "C": "2.00",

        "D": "1.00",

        "F": "0.00"


    };


    return points[grade] || "-";


}

function extractGPA(text){


    if(!text){

        return "-";

    }


    const match = text.match(/GPA=([0-9.]+)/);


    return match
        ? match[1]
        : "-";


}


// ========================================
// RESET RESULT
// ========================================


function clearResult() {


    if (resultSection) {


        resultSection.style.display =
            "none";


    }



    if (subjectTableBody) {


        subjectTableBody.innerHTML =
            "";


    }


}

// ========================================
// EVENT LISTENERS
// ========================================


// Form Submit

if(resultForm) {

    resultForm.addEventListener(
        "submit",
        async function(event) {


            event.preventDefault();


            try {


                const result = await searchResult();

if (result === null) {
    return;
}

displayResult(result);



            }


            catch(error) {


                showError(
                    error.message
                );


                await loadCaptcha();


            }



        }

    );

}



// Refresh Captcha

if (refreshCaptchaBtn) {


    refreshCaptchaBtn.addEventListener(
        "click",
        function() {


            loadCaptcha();


        }
    );


}



// Reset Button

// Reset Button

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        function () {

            // Reset all form fields to default values
            resultForm.reset();

            // Clear captcha input
            captchaInput.value = "";

            // Clear current captcha session
            sessionToken = "";

            // Hide result section
            clearResult();

            // Hide error message
            hideError();

            // Load a fresh captcha
            loadCaptcha();

            // Put cursor in Roll Number field
            roll.focus();

        }
    );

}



// Print Button

if (printBtn) {


    printBtn.addEventListener(
        "click",
        function() {


            window.print();


        }
    );


}



// ========================================
// INITIALIZE APP
// ========================================

[
    roll,
    registration,
    captchaInput
].forEach(input => {

    input.addEventListener("input", () => {

        input.classList.remove("input-error");

        if (
            roll.value.trim() &&
            registration.value.trim() &&
            captchaInput.value.trim()
        ) {
            hideError();
        }

    });

});

clearResult();

loadCaptcha();
