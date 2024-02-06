import { auth } from './firebase-admin';

export async function checkToken(header: any) {

    const token = header?.split("Bearer ")[1];

    if (!token) return false;

    try {
        await auth.verifyIdToken(token);
        return true;
    } catch (error) {
        return false;
    }
    
}