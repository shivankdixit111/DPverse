const puppeteer = require('puppeteer'); 

async function getScrappedData(slug) {
    const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com", 
            "user-agent": "Mozilla/5.0",

        },
        body: JSON.stringify({
            "operationName": "questionData",
            "variables": {
                "titleSlug": slug,
            },
            "query": `query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId title titleSlug content difficulty likes dislikes topicTags { name slug } } }`
        })
    });
    const data = await response.json();  
    return data;
}

module.exports = { getScrappedData };

