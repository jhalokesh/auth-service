import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        notEmpty: {
            errorMessage: 'Email is required!',
            bail: true,
        },
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
