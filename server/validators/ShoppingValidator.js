class ShoppingValidator {
    constructor(shop_item) {
        this.shoppingItem = shop_item;
        this.errors = [];
    }

    validateShoppingItem() {
        if (!this.shoppingItem || this.shoppingItem.trim() === '') {
            this.errors.push('Item is required.')
        } else if (this.shoppingItem.length > 50 ) {
            this.errors.push('Item must be less than 50 letters.')
        } 
    }


    validate() {
        this.errors = [];
        this.validateShoppingItem();
        return this.errors.length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

export default ShoppingValidator;
