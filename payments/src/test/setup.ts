import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (userId?: string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51Q42MCHaVJGWdlNsoGHXUDA5sZYKiO2HZxgTqOE7dRqPrg3CQkfg2CQbyOGIC3hfZv4EzMTWc4jmsSMEhyWMyG9800R7DVU6iQ';

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'dsada';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();

    const db = mongoose?.connection?.db;

    if (!db) {
        throw new Error("Database connection is not established.");
    }

    const collections = await db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = (userId?: string) => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: userId || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT!

    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object { jwt: MY_JWT }

    const session = { jwt: token };

    // Turn that session into JSON

    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64

    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data

    return [`session=${base64}`];
};