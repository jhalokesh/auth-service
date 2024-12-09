import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        notEmpty: true,
        errorMessage: 'Email is required!',
        trim: true,
        isEmail: {
            errorMessage: 'Not a valid email!',
        },
    },
    firstName: {
        notEmpty: true,
        trim: true,
        errorMessage: 'First name is required!',
    },
    lastName: {
        notEmpty: true,
        trim: true,
        errorMessage: 'Last name is required!',
    },
    password: {
        notEmpty: true,
        errorMessage: 'Password is required!',
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: 'Password length should be at least of 8 chars!',
        },
    },
});
