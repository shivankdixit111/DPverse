const {OpenAI} = require('@langchain/openai')
const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { LLMChain  } = require('langchain/chains')
const dotenv = require('dotenv');
const { getScrappedData } = require('./leetcodeAPI');
dotenv.config(); 

async function getLLMAnswer({question, query}) {
    const openAiApiKey = process.env.OPENAI_API_KEY;
    //model
    const model = new OpenAI({
        apiKey: openAiApiKey, 
        temperature: 0,
        maxTokens: -1
    }) 

    console.log('questions ---------------> ', question, "  ", "query --------------<<<********---> ", query)

      const prompt = ChatPromptTemplate.fromTemplate(`
            You are a DSA assistant. Remember this problem and answer all queries about it.

            Problem Statement:
            {question}

            User Query:
            {query}

            Instructions:
            - You can provide code, explanation, edge cases, examples, or optimizations.
            - Provide full solution code if requested.
            - Explain edge cases and reasoning if asked.
            - Keep answers short (50-60 words) unless detailed explanation is requested.
            - If the question is unrelated, reply: "Sorry, I can only answer questions about this problem."
        `);


    //pipe the prompt into model using LCEL
    const chain = prompt.pipe(model);

    //invoke the chain
    const res = await chain.invoke({question: question, query: query });
    // console.log("response is ", res) 

    return res;
}

module.exports = { getLLMAnswer }