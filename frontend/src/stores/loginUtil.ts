import { JwtTokenKey, UserRoleKey } from "../config";

export function isPersistent() {
    const token = sessionStorage.getItem(JwtTokenKey);
    return !token;
}

export function storeJwtToken(token:string, isPersistent:boolean|"auto") {
    if (isPersistent) {
        localStorage.setItem(JwtTokenKey, token);
    } else {
        sessionStorage.setItem(JwtTokenKey, token);
    }
}

export function getJwtToken() {
    return (
        localStorage.getItem(JwtTokenKey) ||
        sessionStorage.getItem(JwtTokenKey)
    );
}
export function getUserRoleKey(){
    return (
        localStorage.getItem(UserRoleKey) ||
        sessionStorage.getItem(UserRoleKey)
    );    
}

export function clearJwtToken() {
    localStorage.removeItem(JwtTokenKey);
    sessionStorage.removeItem(JwtTokenKey);
    localStorage.removeItem(UserRoleKey);
    sessionStorage.removeItem(UserRoleKey);
}

