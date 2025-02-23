class TodoValidator {
    constructor(task) {
        this.todoTask = task;
        this.errors = [];
    }

    validateTodoTask() {
        if (!this.todoTask || this.todoTask.trim() === '') {
            this.errors.push('Task is required.')
        }

        if (this.todoTask.length > 50 ) {
            this.errors.push('Task must be less than 50 letters.')
        } 
    }


    validate() {
        this.errors = [];
        this.validateTodoTask();
        return this.errors.length === 0;
    }

    getErrors() {
        return this.errors;
    }
}

export default TodoValidator;
