export const fetchMeldekortKortInfo = async (oboToken: string, url: string) => {
    const response = await fetch(`${url}/din-side/microfrontend/meldekort-kort-info`, {
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
