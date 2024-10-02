import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest } from '@votickets/common/build';
import { BadRequestError } from '@votickets/common/build';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const exisingUser = await User.findOne({ email });

        if (!exisingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(exisingUser.password, password);

        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        // Generate JWT

        const userJwt = jwt.sign({
            id: exisingUser.id,
            email: exisingUser.email
        }, process.env.JWT_KEY!);

        //Store it on session object

        req.session = {
            jwt: userJwt
        };

        res.status(200).send(exisingUser);
});

export { router as signInRouter };
