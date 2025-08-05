import { axiosApiInstance } from "./helper";

const { default: axios } = require("axios")

const getCategory = async (id = null) => {
    let API = "category";
    if (id != null) {
        API = `${API}/${id}`;
    }
    return axiosApiInstance.get(API).then(
        (response) => {
            return response.data
        }
    )
        .catch(
            (error) => {
                return null
            }
        )
};

const getColor = async (id = null) => {
    let API = "color";
    if (id != null) {
        API = `${API}/${id}`;
    }

    // Construct the full URL for the API call using your environment variable
    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${API}`;

    try {
        const response = await fetch(fullUrl, {
            cache: 'no-store' // This is the key to bypass the Next.js cache
        });

        if (!response.ok) {
            throw new Error('Failed to fetch color data');
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching colors:", error);
        return null;
    }
};

const getProduct = async (id = null, category_slug = null, color = null, limit = 0, minPrice = null, maxPrice = null, slug = null) => {
    let API = "product";
    if (id != null) {
        API = `${API}/${id}`;
    }

    const query = new URLSearchParams();

    if (category_slug) query.append("category", category_slug);
    if (color) query.append("color", color);
    if (limit) query.append("limit", limit);
    if (minPrice !== null) query.append("minPrice", minPrice);
    if (maxPrice !== null) query.append("maxPrice", maxPrice);
    if (slug) query.append("slug", slug); // ✅ support for slug

    return axiosApiInstance.get(API + `?${query.toString()}`)
        .then((response) => response.data)
        .catch(() => null);
};

export { getCategory, getColor, getProduct };