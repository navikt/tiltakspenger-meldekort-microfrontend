export const getDataFromAPI = async (oboToken: string, url: string) => {
    console.debug(`Attempting to reach: ${url}`);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oboToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Http error with status: ${response.status}`);
    }

    return await response.json();
};
