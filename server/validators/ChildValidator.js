class ChildValidator {
    constructor(childName, childBirth) {
        this.childName = childName;
        this.childBirth = childBirth;
        this.errors = [];
    }

    validateChildName() {
        if (!this.childName || this.childName.trim() === '') {
            this.errors.push('Child name is required.')
        }
    }

    validateChildBirth() {

        if (!this.childBirth || this.childName.trim() === '') {
            this.errors.push('Child birthday is required.')
        }


        const birthDate = new Date(this.childBirth);
        const today = new Date();

        // Check if the date is valid
        if (isNaN(birthDate.getTime())) {
            this.errors.push('Invalid date format.');
            return;
        }

        // Checking for a future date
        if (birthDate > today) {
            this.errors.push('Birthday cannot be in the future.');
            return;
        }

        // Age range check (0-100 years)
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 0 || age > 100) {
            this.errors.push('Invalid age. Please enter a valid birthdate.');
        }
    }


    validate() {
        this.errors = [];
        this.validateChildName();
        this.validateChildBirth();

        return this.errors.length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

export default ChildValidator;
