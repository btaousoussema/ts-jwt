import { jest, test, expect, describe } from '@jest/globals';
import { generateRefreshTokenFromId } from './refreshTokenService.ts';
import { insertRefreshToken, invalidateTokenForUser } from '../repo/refreshTokenModel.ts';
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

        expect(result).toEqual(mockRefreshToken);
    });
});