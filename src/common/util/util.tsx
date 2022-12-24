import { AuthenticationResult } from "../../authentication/service/authentication-service";

export function getImagePath(imagePath: string, size: 'sm' | 'xl' = 'sm') {
    const splitPath = imagePath.split('.');
    const extension = splitPath.pop();
    const path = splitPath.join('.');
    return `${path}-${size}.${extension}`;
}

export function addTokenToLocalStore(authResult: AuthenticationResult) {
    localStorage.setItem('token', JSON.stringify(authResult));
}

export function getTokenFromLocalStore() {
    const token = localStorage.getItem('token');
    
    return token ? JSON.parse(token) : null;
}

export function removeTokenFromLocalStore() {
    localStorage.removeItem('token');
}