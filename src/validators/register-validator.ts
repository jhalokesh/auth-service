import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        notEmpty: true,
        trim: true,
        errorMessage: 'Email is required!',
    },
});

// export default [body('email').notEmpty().withMessage('Email is required!')];
