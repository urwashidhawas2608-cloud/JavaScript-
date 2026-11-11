// ---------- Accessing form elements ----------
const form = document.getElementById("registrationForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const birthday = document.getElementById("birthday");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const successMessage = document.getElementById("successMessage");
const strengthBox = document.getElementById("strength");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

// Birthday cannot be a future date
birthday.max = new Date().toISOString().split("T")[0];


// ---------- Validation rules ----------
// Each function returns an error message, or "" when the value is valid.

const namePattern = /^[A-Za-z][A-Za-z' -]*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function checkName(value, label) {
    value = value.trim();
    if (value === "") return `${label} is required.`;
    if (value.length < 2) return `${label} must have at least 2 letters.`;
    if (!namePattern.test(value)) return `${label} can contain letters only.`;
    return "";
}

function checkEmail() {
    const value = email.value.trim();
    if (value === "") return "Email is required.";
    if (!emailPattern.test(value)) return "Enter a valid email address.";
    return "";
}

function checkBirthday() {
    if (birthday.value === "") return "Birthday is required.";

    const born = new Date(birthday.value);
    const today = new Date();
    if (born > today) return "Birthday cannot be in the future.";

    let age = today.getFullYear() - born.getFullYear();
    const hadBirthday =
        today.getMonth() > born.getMonth() ||
        (today.getMonth() === born.getMonth() && today.getDate() >= born.getDate());
    if (!hadBirthday) age--;

    if (age < 13) return "You must be at least 13 years old.";
    return "";
}

function checkPassword() {
    const value = password.value;
    if (value === "") return "Password is required.";
    if (value.length < 6) return "Password must contain at least 6 characters.";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
        return "Password must include a letter and a number.";
    }
    return "";
}

function checkConfirmPassword() {
    if (confirmPassword.value === "") return "Please re-enter your password.";
    if (confirmPassword.value !== password.value) return "Passwords do not match.";
    return "";
}

function checkTerms() {
    return terms.checked ? "" : "You must agree to the Terms and Conditions.";
}


// ---------- Field list: input + error box + rule ----------
const fields = [
    { input: firstName, error: "firstNameError", rule: () => checkName(firstName.value, "First name") },
    { input: lastName, error: "lastNameError", rule: () => checkName(lastName.value, "Last name") },
    { input: email, error: "emailError", rule: checkEmail },
    { input: birthday, error: "birthdayError", rule: checkBirthday },
    { input: password, error: "passwordError", rule: checkPassword },
    { input: confirmPassword, error: "confirmPasswordError", rule: checkConfirmPassword },
    { input: terms, error: "termsError", rule: checkTerms }
];

// Runs a field's rule and shows (or clears) its error message
function validateField(field) {
    const message = field.rule();
    document.getElementById(field.error).textContent = message;

    if (field.input.type !== "checkbox") {
        field.input.classList.toggle("invalid", message !== "");
        field.input.classList.toggle("valid", message === "");
    }
    return message === "";
}


// ---------- Password strength meter ----------
function updateStrength() {
    const value = password.value;

    if (value === "") {
        strengthBox.style.display = "none";
        return;
    }

    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = [
        { text: "Weak", color: "#dc2626", width: "33%" },
        { text: "Medium", color: "#f59e0b", width: "66%" },
        { text: "Strong", color: "#16a34a", width: "100%" }
    ];
    const level = score <= 2 ? levels[0] : score <= 3 ? levels[1] : levels[2];

    strengthBox.style.display = "block";
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = "Strength: " + level.text;
    strengthText.style.color = level.color;
}


// ---------- Events ----------
fields.forEach(function (field) {
    const input = field.input;

    // FOCUS event: highlight the active field's label
    input.addEventListener("focus", function () {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) label.classList.add("active");
    });

    // BLUR event: remove highlight and validate when the user leaves
    input.addEventListener("blur", function () {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) label.classList.remove("active");
        validateField(field);
    });

    // INPUT event: live validation while the user types
    input.addEventListener(input.type === "checkbox" ? "change" : "input", function () {
        successMessage.textContent = "";
        validateField(field);
    });
});

// Password changed: refresh the meter and re-check the confirm box
password.addEventListener("input", function () {
    updateStrength();
    if (confirmPassword.value !== "") {
        validateField(fields[5]);
    }
});


// ---------- SUBMIT event ----------
form.addEventListener("submit", function (event) {
    // Stop the page from refreshing
    event.preventDefault();

    // Validate every field (don't stop at the first error)
    const results = fields.map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
        successMessage.textContent = "";
        const firstBad = fields.find((f, i) => !results[i]);
        firstBad.input.focus();
        return;
    }

    successMessage.textContent =
        `Registration successful! Welcome, ${firstName.value.trim()}.`;

    // Show the entered data in the console (password is never logged)
    console.log("First Name:", firstName.value.trim());
    console.log("Last Name:", lastName.value.trim());
    console.log("Email:", email.value.trim());
    console.log("Birthday:", birthday.value);

    // Reset the form and clear the validation styles
    form.reset();
    strengthBox.style.display = "none";
    fields.forEach(function (f) {
        f.input.classList.remove("valid", "invalid");
    });
});
