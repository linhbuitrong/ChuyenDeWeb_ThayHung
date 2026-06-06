export const DetailFeed = async (artUrl: any) => {
    try {
        const response = await fetch(`http://localhost:4000/scrape?url=${encodeURIComponent(artUrl)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
};
