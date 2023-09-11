import decode from 'jwt-decode';

export const TokenValidation = (user) => {

    const token = user?.token;
    let isValid = false;

    if (token) {
        const decodeToken = decode(token);

        if (decodeToken.exp * 1000 < new Date().getTime())
            isValid = false;
        else
            isValid = true;
    }

    return isValid;
};
