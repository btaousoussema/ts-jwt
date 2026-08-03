import { jest, test, expect, describe } from '@jest/globals';
import { generateRefreshTokenFromId, verifyRefreshToken } from './refreshTokenService.ts';
import { getRefreshToken, insertRefreshToken, invalidateTokenForUser } from '../repo/refreshTokenModel.ts';
//import * as repo from '../repo/refreshTokenModel.ts';
import { v4 as uuid } from 'uuid';
import type { RefreshToken } from '../types/types.ts';

jest.mock('../repo/refreshTokenModel.ts');
jest.mock('uuid');

describe('RefreshTokenService test', () => {
    test('It should return a new RefreshToken', async ()=> {
        const mockRefreshToken:RefreshToken = {
            id: 1,
            user_id: 123,
            token: 'mock-token',
            expiry_date: 'mock-date',
            active: true,
        };

        (uuid as jest.Mock).mockReturnValue('mock-token');


        const mockedInsertRefreshToken = insertRefreshToken as jest.MockedFunction<typeof insertRefreshToken>;
        mockedInsertRefreshToken.mockResolvedValue(mockRefreshToken);

         const result = await generateRefreshTokenFromId(123);

        expect(invalidateTokenForUser).toHaveBeenCalledWith(123);

        expect(insertRefreshToken).toHaveBeenCalledWith(
            123,
            'mock-token',
            expect.any(String)
        );

        expect(result).toEqual(mockRefreshToken);
    });

    test('It should return a null', async ()=> {
        const mockRefreshToken = null;

        (uuid as jest.Mock).mockReturnValue('mock-token');

        const mockedInvalidatedTokenUser = invalidateTokenForUser as jest.MockedFunction<typeof invalidateTokenForUser>;
        mockedInvalidatedTokenUser.mockResolvedValue(undefined); 

        const mockedInsertRefreshToken = insertRefreshToken as jest.MockedFunction<typeof insertRefreshToken>;
        mockedInsertRefreshToken.mockResolvedValue(mockRefreshToken);

         const result = await generateRefreshTokenFromId(123);

        expect(invalidateTokenForUser).toHaveBeenCalledWith(123);

        expect(insertRefreshToken).toHaveBeenCalledWith(
            123,
            'mock-token',
            expect.any(String)
        );

        expect(result).toEqual(null);
    });
});

describe('VerifyRefreshToken test', () => {
    
    test('It should return a null when the refreshToken is null', async ()=> {
        const refreshToken = "";

        const mockGetRefreshToken = getRefreshToken as jest.MockedFunction<typeof getRefreshToken>;
        mockGetRefreshToken.mockResolvedValue(null);

        const result = await verifyRefreshToken(refreshToken);

        expect(result).toBe(null);
    });

    test('It should return null when a refreshToken is not active', async ()=> {
        const mockRefreshToken:RefreshToken = {
            id: 1,
            user_id: 123,
            token: 'mock-token',
            expiry_date: 'mock-date',
            active: false,
        };

        const mockedInvalidatedTokenUser = invalidateTokenForUser as jest.MockedFunction<typeof invalidateTokenForUser>;
        mockedInvalidatedTokenUser.mockResolvedValue(undefined); 

        const mockGetRefreshToken = getRefreshToken as jest.MockedFunction<typeof getRefreshToken>;
        mockGetRefreshToken.mockResolvedValue(mockRefreshToken);

        const result = await verifyRefreshToken("refreshToken");

        expect(result).toBe(null);
        expect(invalidateTokenForUser).toHaveBeenCalled();
    });
});