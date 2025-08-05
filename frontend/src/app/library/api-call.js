import { axiosApiInstance } from "./helper";

const getCategory = async (id = null) => {
    let API = "category";
    if (id != null) {
        API = `${API}/${id}`;
    }
    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${API}`;

    try {
        const response = await fetch(fullUrl, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch category data');
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
};

const getColor = async (id = null) => {
    let API = "color";
    if (id != null) {
        API = `${API}/${id}`;
    }

    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${API}`;

    try {
        const response = await fetch(fullUrl, {
            cache: 'no-store'
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
    if (slug) query.append("slug", slug);

    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${API}?${query.toString()}`;

    try {
        const response = await fetch(fullUrl, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return null;
    }
};

export { getCategory, getColor, getProduct };