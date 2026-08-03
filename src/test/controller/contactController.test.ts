import { jest, test, expect, describe, afterAll, beforeAll } from '@jest/globals';
import { type StartedTestContainer, type StartedNetwork, Network, GenericContainer} from 'testcontainers';
import path from 'path';
import contactController from '../../controllers/contactController.ts';
import httpMocks from 'node-mocks-http';
import { type Contact } from '../../types/types.ts';


describe ('Testing the contact controller tests.', () => {
    let postgres: StartedTestContainer;
    let network: StartedNetwork;

    beforeAll(async () => {
        network = await new Network().start();
        postgres = await new GenericContainer('postgres:15.3')
        .withNetworkMode(network.getName())
        .withNetworkAliases('postgres')
        .withAutoRemove(true)
        .withEnvironment({
            'POSTGRES_USER': 'ouss',
            'POSTGRES_PASSWORD': 'password',
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
        .start();
    }, 60000000);

    test('Contact route', async () => {        
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/contact',
            headers: { 'content-type': 'application/json' }
        });
        const res = httpMocks.createResponse();

        try {
        await contactController.getContacts(req, res);

        expect(res._getStatusCode()).toBe(200);
        console.log('res._getData():', res._getJSONData()["contacts"]);
        const data = res._getJSONData()["contacts"] as Contact[];

        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expect(data.at(0)?.firstName).toBe('ouss');
        expect(data.at(0)?.lastName).toBe('bou');

        expect(postgres).toBeDefined();
        } catch (error) {
            console.error('Error during test execution:', error);
        }
        
    }, 6000000);

    test('Create contact route', async () => {
         const req = httpMocks.createRequest({
            method: 'POST',
            url: '/contact',
            body: {
                email: 'test@example.com', 
                'message': 'Hello!',
            },
            headers: { 'content-type': 'application/json' }
        });
        const res = httpMocks.createResponse();

        await contactController.createContact(req, res);

        expect(res._getStatusCode()).toBe(200);
        console.log('res._getData():', res._getData());

    }, 6000000);

    afterAll(async () => {
        if (postgres) {
            await postgres.stop();
        }
        if(network) {
            await network.stop();
        }
    }, 6000000);
});