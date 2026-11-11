const form = document.getElementById("jobForm");

function setError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + "Error");

    input.classList.remove("valid");
    input.classList.add("invalid");
    error.textContent = message;
}

function setValid(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + "Error");

    input.classList.remove("invalid");
    input.classList.add("valid");
    error.textContent = "";
}

/* Full Name */
function validateName() {
    const value = document.getElementById("name").value.trim();

    if (!/^[A-Za-z ]{3,}$/.test(value)) {
        setError("name", "Enter a valid name.");
        return false;
    }

    setValid("name");
    return true;
}

/* Date of Birth */
function validateDOB() {
    const value = document.getElementById("dob").value;

    if (value === "") {
        setError("dob", "Please select your date of birth.");
        return false;
    }

    setValid("dob");
    return true;
}

/* Gender */
function validateGender() {
    const value = document.getElementById("gender").value;

    if (value === "") {
        setError("gender", "Please select your gender.");
        return false;
    }

    setValid("gender");
    return true;
}

/* Email */
function validateEmail() {
    const value = document.getElementById("email").value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(value)) {
        setError("email", "Enter a valid email address.");
        return false;
    }

    setValid("email");
    return true;
}

/* Mobile */
function validateMobile() {
    const value = document.getElementById("mobile").value;

    if (!/^[6-9]\d{9}$/.test(value)) {
        setError("mobile", "Enter a valid 10-digit mobile number.");
        return false;
    }

    setValid("mobile");
    return true;
}

/* Address */
function validateAddress() {
    const value = document.getElementById("address").value.trim();

    if (value.length < 10) {
        setError("address", "Address must contain at least 10 characters.");
        return false;
    }

    setValid("address");
    return true;
}

/* City */
function validateCity() {
    const value = document.getElementById("city").value.trim();

    if (value.length < 3) {
        setError("city", "Enter a valid city/state.");
        return false;
    }

    setValid("city");
    return true;
}

/* PIN */
function validatePin() {
    const value = document.getElementById("pin").value;

    if (!/^\d{6}$/.test(value)) {
        setError("pin", "PIN code must contain 6 digits.");
        return false;
    }

    setValid("pin");
    return true;
}

/* Generic required field */
function validateRequired(id, message) {
    const value = document.getElementById(id).value.trim();

    if (value === "") {
        setError(id, message);
        return false;
    }

    setValid(id);
    return true;
}

/* Live validation */
document.getElementById("name").addEventListener("input", validateName);
document.getElementById("dob").addEventListener("change", validateDOB);
document.getElementById("gender").addEventListener("change", validateGender);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("mobile").addEventListener("input", validateMobile);
document.getElementById("address").addEventListener("input", validateAddress);
document.getElementById("city").addEventListener("input", validateCity);
document.getElementById("pin").addEventListener("input", validatePin);

/* Only numbers in mobile and PIN */
document.getElementById("mobile").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

document.getElementById("pin").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 6);
});

/* Submit */
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let valid = true;

    if (!validateName()) valid = false;
    if (!validateDOB()) valid = false;
    if (!validateGender()) valid = false;
    if (!validateEmail()) valid = false;
    if (!validateMobile()) valid = false;
    if (!validateAddress()) valid = false;
    if (!validateCity()) valid = false;
    if (!validatePin()) valid = false;

    if (!validateRequired(
        "qualification",
        "Please select your highest qualification."
    )) valid = false;

    if (!validateRequired(
        "university",
        "Enter your university/institute."
    )) valid = false;

    if (!validateRequired(
        "passingYear",
        "Enter your passing year."
    )) valid = false;

    if (!validateRequired(
        "percentage",
        "Enter your percentage/CGPA."
    )) valid = false;

    if (!validateRequired(
        "position",
        "Enter the job position."
    )) valid = false;

    if (!validateRequired(
        "experience",
        "Please select your experience."
    )) valid = false;

    if (!validateRequired(
        "languages",
        "Enter your programming languages."
    )) valid = false;

    if (!validateRequired(
        "skills",
        "Enter your technical skills."
    )) valid = false;

    if (valid) {
        const success = document.getElementById("success");
        success.style.display = "block";
        success.textContent =
            "✓ Application submitted successfully!";

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }
});

/* Reset */
form.addEventListener("reset", function () {
    setTimeout(() => {
        document.querySelectorAll("input, select, textarea")
            .forEach(element => {
                element.classList.remove("valid", "invalid");
            });

        document.querySelectorAll("small")
            .forEach(element => {
                element.textContent = "";
            });

        document.getElementById("success").style.display = "none";
    }, 50);
});
