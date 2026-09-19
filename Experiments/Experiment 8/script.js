document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // ACCESS FORM ELEMENTS
    // ================================

    const form = document.getElementById("gymForm");

    const nameInput = document.getElementById("name");
    const dobInput = document.getElementById("dob");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const genderInput = document.getElementById("gender");
    const occupationInput = document.getElementById("occupation");

    const planInput = document.getElementById("plan");
    const startDateInput = document.getElementById("startDate");
    const goalInput = document.getElementById("goal");

    const emergencyNameInput =
        document.getElementById("emergencyName");

    const emergencyPhoneInput =
        document.getElementById("emergencyPhone");

    const addressInput = document.getElementById("address");

    const termsInput = document.getElementById("terms");

    const clearButton = document.getElementById("clearBtn");
    const printButton = document.getElementById("printBtn");

    const successMessage =
        document.getElementById("successMessage");

    const receipt =
        document.getElementById("receipt");


    // ================================
    // SET MINIMUM DATES
    // ================================

    const today = new Date();
    const todayString = formatDateForInput(today);

    startDateInput.min = todayString;

    const maximumDob = new Date();
    maximumDob.setFullYear(maximumDob.getFullYear() - 16);

    dobInput.max = formatDateForInput(maximumDob);


    // ================================
    // HELPER FUNCTIONS
    // ================================

    function formatDateForInput(date) {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function formatDate(dateString) {

        if (!dateString) {
            return "---";
        }

        const date = new Date(dateString + "T00:00:00");

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function showError(input, errorId, message) {

        const errorElement =
            document.getElementById(errorId);

        input.classList.remove("input-valid");
        input.classList.add("input-invalid");

        errorElement.textContent = message;

        return false;
    }


    function showSuccess(input, errorId) {

        const errorElement =
            document.getElementById(errorId);

        input.classList.remove("input-invalid");
        input.classList.add("input-valid");

        errorElement.textContent = "";

        return true;
    }


    // ================================
    // NAME VALIDATION
    // ================================

    function validateName() {

        const value = nameInput.value.trim();

        const namePattern = /^[A-Za-z ]+$/;

        if (value === "") {

            return showError(
                nameInput,
                "nameError",
                "Please enter your name."
            );
        }

        if (value.length < 3) {

            return showError(
                nameInput,
                "nameError",
                "Name must contain at least 3 characters."
            );
        }

        if (!namePattern.test(value)) {

            return showError(
                nameInput,
                "nameError",
                "Name can contain only letters and spaces."
            );
        }

        return showSuccess(nameInput, "nameError");
    }


    // ================================
    // DOB VALIDATION
    // ================================

    function validateDob() {

        const value = dobInput.value;

        if (value === "") {

            return showError(
                dobInput,
                "dobError",
                "Please select your date of birth."
            );
        }

        const birthDate = new Date(value + "T00:00:00");
        const currentDate = new Date();

        if (birthDate > currentDate) {

            return showError(
                dobInput,
                "dobError",
                "Date of birth cannot be in the future."
            );
        }

        let age =
            currentDate.getFullYear() -
            birthDate.getFullYear();

        const monthDifference =
            currentDate.getMonth() -
            birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                currentDate.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        if (age < 16) {

            return showError(
                dobInput,
                "dobError",
                "Member must be at least 16 years old."
            );
        }

        return showSuccess(dobInput, "dobError");
    }


    // ================================
    // EMAIL VALIDATION
    // ================================

    function validateEmail() {

        const value = emailInput.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (value === "") {

            return showError(
                emailInput,
                "emailError",
                "Please enter your email address."
            );
        }

        if (!emailPattern.test(value)) {

            return showError(
                emailInput,
                "emailError",
                "Please enter a valid email address."
            );
        }

        return showSuccess(emailInput, "emailError");
    }


    // ================================
    // PHONE VALIDATION
    // ================================

    function validatePhone() {

        const value = phoneInput.value.trim();

        const phonePattern = /^[6-9][0-9]{9}$/;

        if (value === "") {

            return showError(
                phoneInput,
                "phoneError",
                "Please enter your mobile number."
            );
        }

        if (!phonePattern.test(value)) {

            return showError(
                phoneInput,
                "phoneError",
                "Enter a valid 10-digit Indian mobile number."
            );
        }

        return showSuccess(phoneInput, "phoneError");
    }


    // ================================
    // GENDER VALIDATION
    // ================================

    function validateGender() {

        if (genderInput.value === "") {

            return showError(
                genderInput,
                "genderError",
                "Please select your gender."
            );
        }

        return showSuccess(genderInput, "genderError");
    }


    // ================================
    // PLAN VALIDATION
    // ================================

    function validatePlan() {

        if (planInput.value === "") {

            return showError(
                planInput,
                "planError",
                "Please select a membership plan."
            );
        }

        return showSuccess(planInput, "planError");
    }


    // ================================
    // START DATE VALIDATION
    // ================================

    function validateStartDate() {

        const value = startDateInput.value;

        if (value === "") {

            return showError(
                startDateInput,
                "startDateError",
                "Please select a start date."
            );
        }

        const selectedDate =
            new Date(value + "T00:00:00");

        const currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {

            return showError(
                startDateInput,
                "startDateError",
                "Start date cannot be in the past."
            );
        }

        return showSuccess(
            startDateInput,
            "startDateError"
        );
    }


    // ================================
    // GOAL VALIDATION
    // ================================

    function validateGoal() {

        if (goalInput.value === "") {

            return showError(
                goalInput,
                "goalError",
                "Please select your fitness goal."
            );
        }

        return showSuccess(goalInput, "goalError");
    }


    // ================================
    // EMERGENCY NAME
    // ================================

    function validateEmergencyName() {

        const value =
            emergencyNameInput.value.trim();

        const namePattern = /^[A-Za-z ]+$/;

        if (value === "") {

            return showError(
                emergencyNameInput,
                "emergencyNameError",
                "Please enter an emergency contact name."
            );
        }

        if (!namePattern.test(value)) {

            return showError(
                emergencyNameInput,
                "emergencyNameError",
                "Name can contain only letters and spaces."
            );
        }

        return showSuccess(
            emergencyNameInput,
            "emergencyNameError"
        );
    }


    // ================================
    // EMERGENCY PHONE
    // ================================

    function validateEmergencyPhone() {

        const value =
            emergencyPhoneInput.value.trim();

        const phonePattern = /^[6-9][0-9]{9}$/;

        if (value === "") {

            return showError(
                emergencyPhoneInput,
                "emergencyPhoneError",
                "Please enter an emergency contact number."
            );
        }

        if (!phonePattern.test(value)) {

            return showError(
                emergencyPhoneInput,
                "emergencyPhoneError",
                "Enter a valid 10-digit mobile number."
            );
        }

        return showSuccess(
            emergencyPhoneInput,
            "emergencyPhoneError"
        );
    }


    // ================================
    // ADDRESS VALIDATION
    // ================================

    function validateAddress() {

        const value =
            addressInput.value.trim();

        if (value === "") {

            return showError(
                addressInput,
                "addressError",
                "Please enter your address."
            );
        }

        if (value.length < 10) {

            return showError(
                addressInput,
                "addressError",
                "Please enter a complete address."
            );
        }

        return showSuccess(
            addressInput,
            "addressError"
        );
    }


    // ================================
    // TERMS VALIDATION
    // ================================

    function validateTerms() {

        const errorElement =
            document.getElementById("termsError");

        if (!termsInput.checked) {

            errorElement.textContent =
                "Please accept the terms and conditions.";

            return false;
        }

        errorElement.textContent = "";

        return true;
    }


    // ================================
    // LIVE INPUT EVENTS
    // ================================

    nameInput.addEventListener("input", validateName);

    dobInput.addEventListener("change", validateDob);

    emailInput.addEventListener("input", validateEmail);

    phoneInput.addEventListener("input", function () {

        phoneInput.value =
            phoneInput.value.replace(/\D/g, "");

        validatePhone();
    });

    genderInput.addEventListener("change", validateGender);

    planInput.addEventListener("change", validatePlan);

    startDateInput.addEventListener(
        "change",
        validateStartDate
    );

    goalInput.addEventListener("change", validateGoal);

    emergencyNameInput.addEventListener(
        "input",
        validateEmergencyName
    );

    emergencyPhoneInput.addEventListener(
        "input",
        function () {

            emergencyPhoneInput.value =
                emergencyPhoneInput.value.replace(/\D/g, "");

            validateEmergencyPhone();
        }
    );

    addressInput.addEventListener(
        "input",
        validateAddress
    );

    termsInput.addEventListener(
        "change",
        validateTerms
    );


    // ================================
    // FORM SUBMIT EVENT
    // ================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const validName = validateName();
        const validDob = validateDob();
        const validEmail = validateEmail();
        const validPhone = validatePhone();
        const validGender = validateGender();

        const validPlan = validatePlan();
        const validStartDate = validateStartDate();
        const validGoal = validateGoal();

        const validEmergencyName =
            validateEmergencyName();

        const validEmergencyPhone =
            validateEmergencyPhone();

        const validAddress =
            validateAddress();

        const validTerms =
            validateTerms();


        const isFormValid =
            validName &&
            validDob &&
            validEmail &&
            validPhone &&
            validGender &&
            validPlan &&
            validStartDate &&
            validGoal &&
            validEmergencyName &&
            validEmergencyPhone &&
            validAddress &&
            validTerms;


        if (!isFormValid) {

            alert(
                "Please correct the highlighted fields before submitting."
            );

            return;
        }


        createReceipt();

    });


    // ================================
    // CREATE RECEIPT
    // ================================

    function createReceipt() {

        const planData =
            planInput.value.split("|");

        const planName = planData[0];

        const planFee = planData[1];


        const registrationId =
            "FC-" +
            Math.floor(
                100000 + Math.random() * 900000
            );


        const registrationDate =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        // Access form values and put them into receipt

        document.getElementById("receiptId")
            .textContent = registrationId;

        document.getElementById("receiptDate")
            .textContent = registrationDate;


        document.getElementById("rName")
            .textContent = nameInput.value.trim();

        document.getElementById("rDob")
            .textContent = formatDate(dobInput.value);

        document.getElementById("rEmail")
            .textContent = emailInput.value.trim();

        document.getElementById("rPhone")
            .textContent = phoneInput.value.trim();

        document.getElementById("rGender")
            .textContent = genderInput.value;

        document.getElementById("rOccupation")
            .textContent =
            occupationInput.value.trim() || "Not provided";


        document.getElementById("rPlan")
            .textContent = planName;

        document.getElementById("rFee")
            .textContent = "₹" + planFee + " / Month";

        document.getElementById("rGoal")
            .textContent = goalInput.value;

        document.getElementById("rStartDate")
            .textContent =
            formatDate(startDateInput.value);


        document.getElementById("rEmergencyName")
            .textContent =
            emergencyNameInput.value.trim();

        document.getElementById("rEmergencyPhone")
            .textContent =
            emergencyPhoneInput.value.trim();

        document.getElementById("rAddress")
            .textContent =
            addressInput.value.trim();


        // Show success message

        successMessage.classList.add("show");

        receipt.classList.add("show");


        // Scroll to success message

        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    // ================================
    // CLEAR FORM EVENT
    // ================================

    clearButton.addEventListener(
        "click",
        function () {

            form.reset();


            const inputs =
                form.querySelectorAll(
                    "input, select, textarea"
                );


            inputs.forEach(function (input) {

                input.classList.remove(
                    "input-valid",
                    "input-invalid"
                );

            });


            const errors =
                form.querySelectorAll(".error");


            errors.forEach(function (error) {

                error.textContent = "";

            });


            successMessage.classList.remove("show");

            receipt.classList.remove("show");

        }
    );


    // ================================
    // PRINT RECEIPT EVENT
    // ================================

    printButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

});