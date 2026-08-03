import { jest, test, expect, describe, afterAll, beforeAll } from '@jest/globals';
import { type StartedTestContainer, type StartedNetwork, Network, GenericContainer} from 'testcontainers';
import path from 'path';
import { createUser } from '../../controllers/userController.ts';
import httpMocks from 'node-mocks-http';


describe ('Testing the user controller tests.', () => {
    let postgres: StartedTestContainer;
    let network: StartedNetwork;

    beforeAll(async () => {
        network = await new Network().start();
        postgres = await new GenericContainer('postgres:15.3')
        .withNetworkMode(network.getName())
        .withEnvironment({
            'POSTGRES_USER': 'oussadmin',
            'POSTGRES_PASSWORD': 'passwordadmin',
            'POSTGRES_DB': 'Web',
            'DB_HOST': 'localhost',
            })
        .withCopyFilesToContainer([
            {
                source: path.resolve(__dirname, "../db/init.sql"),
                target: "/docker-entrypoint-initdb.d/init.sql",
            },
        ])
        .withExposedPorts(5432)
        .withAutoRemove(true)
        .start();
    }, 60000000);

    test('Create a user test', async () => {
         const req = httpMocks.createRequest({
            method: 'POST',
            url: '/user',
            body: {
                'email': 'test1@example.com', 
                'password': 'Hello!',
            },
            headers: { 'content-type': 'application/json' }
        });
        const res = httpMocks.createResponse();

        try {
            await createUser(req, res);

            expect(res._getStatusCode()).toBe(200);
            expect(res._getData()).toBe(`Account created for user ${req.body.email}!`);
            console.log('res._getData():', res._getData());
        } catch (error) {
            console.error('Error during test execution:', error);
        }
    }, 6000000);
    

    test('Create an already existing user test', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/user',
            body: {
                email: 'user@example.com', 
                'password': 'Hello!',
            },
            headers: { 'content-type': 'application/json' }
        });
        const res = httpMocks.createResponse();

        try {
            await createUser(req, res);

            expect(res._getStatusCode()).toBe(200);

            const secondReq = httpMocks.createRequest({
                method: 'POST',
                url: '/user',
                body: {
                    email: 'user@example.com', 
                    'password': 'Hello!',
                },
                headers: { 'content-type': 'application/json' }
            });

            const secondRes = httpMocks.createResponse();

            await createUser(secondReq, secondRes);
            expect(secondRes._getStatusCode()).toBe(409);
            expect(secondRes._getData()).toBe(`Cannot create user with email : ${secondReq.body.email}`);
            console.log('resSecond._getData():', secondRes._getData());
        } catch (error) {
            console.error('Error during test execution:', error);
        }      
    }, 6000000);

    afterAll(async () => {
        if (postgres) {
            await postgres.stop({remove: true});
        }
        if(network) {
            await network.stop();
        }
    }, 6000000);
});