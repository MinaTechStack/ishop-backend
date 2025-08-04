/**
 * Function to create a slug from a given string.
 * @param {string} text - The input string to convert into a slug.
 * @returns {string} - The generated slug.
 */


import { toast } from 'react-toastify';
import axios from 'axios';



const axiosApiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});

function createSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text


}
function getCookies(name) {
    if (typeof document === 'undefined') return null; // ✅ only run in browser
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const notify = (msg, flag) => toast(msg, { type: flag ? "success" : "error" });

export { createSlug, notify, axiosApiInstance, getCookies };
