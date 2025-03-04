class PartyValidator {
    constructor(partyDate, partyTimeFrom, partyTimeTo, partyPlace, partyPlace2, partyPlace3, partyContact1, partyContact2) {
        this.partyDate = partyDate;
        this.partyTimeFrom = partyTimeFrom;
        this.partyTimeTo = partyTimeTo;
        this.partyPlace = partyPlace;
        this.partyPlace2 = partyPlace2;
        this.partyPlace3 = partyPlace3;
        this.partyContact1 = partyContact1;
        this.partyContact2 = partyContact2;
        this.errors = [];
    }

    validatePartyDate() {

        if (!this.partyDate || this.partyDate.trim() === '') {
            this.errors.push('Party date is required.')
            return;
        }


        const partyDate = new Date(this.partyDate);
        const today = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 100);

        // Check if the date is valid
        if (isNaN(partyDate.getTime())) {
            this.errors.push('Invalid date format.');
            return;
        }

        // Checking for a past date
        if (partyDate < today) {
            this.errors.push('Party date cannot be in the past.');
            return;
        }

        // Checking for a future date
        if (partyDate > maxDate) {
            this.errors.push('Party date cannot be more than 100 years in the future.');
            return;
        }

    }


    validatePartyTime() {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        // partyTimeFrom
        if (this.partyTimeFrom && this.partyTimeFrom.trim() !== '') {
            if (!timeRegex.test(this.partyTimeFrom)) {
                this.errors.push('Invalid start time format. Use HH:MM.');
            }
        }

        // partyTimeTo
        if (this.partyTimeTo && this.partyTimeTo.trim() !== '') {
            if (!timeRegex.test(this.partyTimeTo)) {
                this.errors.push('Invalid end time format. Use HH:MM.');
            }
        }

        if (this.partyTimeFrom && this.partyTimeTo) {
            const [fromHour, fromMinute] = this.partyTimeFrom.split(':').map(Number);
            const [toHour, toMinute] = this.partyTimeTo.split(':').map(Number);

            const fromTime = fromHour * 60 + fromMinute; // 分単位に変換
            const toTime = toHour * 60 + toMinute;

            if (fromTime >= toTime) {
                this.errors.push('Party start time must be before the end time.');
            }
        }
    }


    validatePartyPlace() {
        if (this.partyPlace && this.partyPlace.length > 35) {
            this.errors.push('Location must be less than 35 letters.')
        }
        if (this.partyPlace2 && this.partyPlace2.length > 35) {
            this.errors.push('Location must be less than 35 letters.')
        }
        if (this.partyPlace3 && this.partyPlace3.length > 35) {
            this.errors.push('Location must be less than 35 letters.')
        }
    }


    validatePartyContact() {
        const phoneRegex = /^\d{10}$/;

        if (this.partyContact1) {
            const phoneReplace = this.partyContact1?.replace(/[-\s]/g, '');   // remove -, space

            if (!phoneRegex.test(phoneReplace)) {
                this.errors.push('Please enter a valid telephone numbre.');
            }
        }
        if (this.partyContact2) {
            const phoneReplace = this.partyContact2?.replace(/[-\s]/g, '');   // remove -, space

            if (!phoneRegex.test(phoneReplace)) {
                this.errors.push('Please enter a valid telephone numbre.');
            }
        }
    }


    validate() {
        this.errors = [];
        this.validatePartyDate();
        this.validatePartyTime();
        this.validatePartyPlace();
        this.validatePartyContact();

        return this.errors.length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

export default PartyValidator;
