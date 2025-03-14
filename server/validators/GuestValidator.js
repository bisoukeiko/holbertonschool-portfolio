class GuestValidator {
    constructor(guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail) {
        this.guestName = guestName;
        this.guestRelation = guestRelation;
        this.guestAllergy = guestAllergy;
        this.otherInfo = otherInfo;
        this.parentPhone = parentPhone;
        this.parentEmail = parentEmail;
        this.errors = [];
    }

    validateGuestName() {
        if (!this.guestName || this.guestName.trim() === '') {
            this.errors.push('Guest name is required.')
        } else if (this.guestName.length > 50 ) {
            this.errors.push('Guest name must be less than 50 letters.')
        } 
    }

    validateGuestRelation() {
        if (this.guestRelation && this.guestRelation.length > 50) {
            this.errors.push('Relation must be less than 50 letters.')
        }
    }

    validateGuestAllergy() {
        if (this.guestAllergy && this.guestAllergy.length > 200) {
            this.errors.push('Guest Allergy must be less than 200 letters.')
        }
    }

    validateOtherInfo() {
        if (this.otherInfo && this.otherInfo.length > 200) {
            this.errors.push('Other information must be less than 200 letters.')
        }
    }

    validateGuestPhone() {
        const phoneRegex = /^\d{10}$/;
        // remove -, space
        const phoneReplace = this.parentPhone?.replace(/[-\s.]/g, '');

        if (this.parentPhone && !phoneRegex.test(phoneReplace)) {
            this.errors.push('Please enter a valid telephone number.');
        }
    }

    validateGuestEmail() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (this.parentEmail && !emailRegex.test(this.parentEmail)) {
            this.errors.push('Please enter a valid email address.')
        }
    }


    validate() {
        this.errors = [];
        this.validateGuestName();
        this.validateGuestRelation();
        this.validateGuestAllergy();
        this.validateOtherInfo();
        this.validateGuestPhone();
        this.validateGuestEmail();

        return this.errors.length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

export default GuestValidator;
