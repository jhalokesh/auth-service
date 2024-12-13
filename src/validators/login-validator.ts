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
    password: {
        notEmpty: true,
        errorMessage: 'Password is required!',
    },
});
