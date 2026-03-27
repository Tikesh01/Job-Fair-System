export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const setCookie = (name, value, options = {}) => {
    let cookieString = `${name}=${value}`;
    if (options.path) cookieString += `; path=${options.path}`;
    if (options.secure) cookieString += '; secure';
    if (options.samesite) cookieString += `; samesite=${options.samesite}`;
    if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
    document.cookie = cookieString;
};