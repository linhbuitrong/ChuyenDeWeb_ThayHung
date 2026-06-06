export const RSSFeed = async (rssUrl: any) => {
    console.log("rssUrl", rssUrl);
    try {
        const response = await fetch(`http://localhost:4000/rss?url=${encodeURIComponent(rssUrl)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
};
