class UserValidator {
    constructor(userName, userEmail, userPhone) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.errors = [];
    }

    validateUserName() {
        if (!this.userName || this.userName.trim() === '') {
            this.errors.push('user name is required.')
        }
    }

    validateUserEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.userEmail || this.userEmail.trim() === '') {
            this.errors.push('E-mail is reqired.')
        } else if (!emailRegex.test(this.userEmail)) {
            this.errors.push('Please enter a valid email address.')
        }
    }

    validateUserPhone() {
        const phoneRegex = /^\d{10}$/;

        // remove -, space
        const phoneReplace = this.userPhone?.replace(/[-\s.]/g, '');

        if (this.userPhone && !phoneRegex.test(phoneReplace)) {
            this.errors.push('Please enter a valid telephone numbre.');
        }
    }

    validate() {
        this.errors = [];
        this.validateUserName();
        this.validateUserEmail();
        this.validateUserPhone();

        return this.errors.length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

export default UserValidator;
