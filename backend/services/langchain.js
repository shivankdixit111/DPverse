const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');
const { AIMessage, HumanMessage } = require('@langchain/core/messages');
const dotenv = require('dotenv');
dotenv.config();

// Store conversations in memory (in production, use Redis or database)
const conversationMemory = new Map();

async function getLLMAnswer({ question, query, sessionId }) {
    try {
        const openAiApiKey = process.env.OPENAI_API_KEY;
        
        const model = new ChatOpenAI({
            apiKey: openAiApiKey, 
            temperature: 0.3,
            modelName: 'gpt-3.5-turbo',
            maxTokens: 1500
        });

        console.log('Session ID:', sessionId);
        console.log('Problem:', question.substring(0, 100));
        console.log('Query:', query);

        // Get or create memory for this session
        let memory = conversationMemory.get(sessionId);
        if (!memory) {
            memory = new BufferMemory({
                returnMessages: true,
                memoryKey: "chat_history",
                inputKey: "input",
                outputKey: "output",
                maxTokenLimit: 2000, // Limit history to prevent token overflow
            });
            conversationMemory.set(sessionId, memory);
            
            // Initialize with problem context
            await memory.chatHistory.addMessage(
                new AIMessage(`I'm helping you with this problem:\n\n${question}\n\nI'll provide hints, edge cases, and solutions as needed.`)
            );
        }

        const systemPrompt = `You are a DSA mentor for Tier3PlacementHub. You're helping a student solve a coding problem.

            IMPORTANT CONTEXT:
            You have already discussed the problem with the student. Remember your previous responses and build upon them.

            TEACHING METHODOLOGY:
            1. NEVER give full solution immediately unless explicitly asked
            2. If student asks for "hint" - Give progressive hints
            3. If student asks for "edge cases" - Focus on edge cases
            4. If student asks for "solution" or "code" - Provide full solution
            5. If student asks for "explain" - Provide detailed explanation
            6. Build upon previous hints and discussions

            RESPONSE FORMATS:

            FOR HINTS:
            💡 **HINT 1:** [Basic observation]
            💡 **HINT 2:** [Key insight]  
            💡 **HINT 3:** [Approach to take]
            ❓ Would you like to try implementing it, or shall I explain the edge cases?

            FOR EDGE CASES:
            ⚠️ **IMPORTANT EDGE CASES:**
            1. [Edge case] - Why it matters
            2. [Edge case] - How to handle
            3. [Edge case] - Common pitfalls

            FOR SOLUTION:
            📝 **APPROACH:** [Algorithm explanation]
            ⏱️ **TIME COMPLEXITY:** O(?)
            💾 **SPACE COMPLEXITY:** O(?)

            \`\`\`javascript
            [Full code with comments]
            \`\`\`

            🎯 **KEY INSIGHTS:**
            - [Important takeaways from this solution]

            RULES:
            - Reference previous hints/discussions if applicable
            - Be encouraging and patient
            - If query is completely unrelated: "Sorry, I can only answer questions about this DSA problem."
            - Keep responses concise but informative

            Current conversation history shows what we've discussed so far. Use that context to provide relevant follow-up help.`;

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"]
        ]);

        const chain = prompt.pipe(model).pipe(new StringOutputParser());

        // Get chat history from memory
        const chatHistory = await memory.chatHistory.getMessages();
        
        // Invoke with context
        const response = await chain.invoke({
            chat_history: chatHistory,
            input: query
        });

        // Save to memory
        await memory.chatHistory.addMessage(new HumanMessage(query));
        await memory.chatHistory.addMessage(new AIMessage(response));

        console.log("Response generated successfully");
        return response;

    } catch (error) {
        console.error("Error in getLLMAnswer:", error);
        return "I encountered an error while processing your request. Please try again.";
    }
}

// Optional: Clean up old sessions (run periodically)
function cleanupOldSessions() {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    
    for (const [sessionId, memory] of conversationMemory.entries()) {
        // Check if memory has timestamp and is old
        if (memory.createdAt && (now - memory.createdAt) > ONE_HOUR) {
            conversationMemory.delete(sessionId);
        }
    }
}

// Run cleanup every hour
setInterval(cleanupOldSessions, 60 * 60 * 1000);

module.exports = { getLLMAnswer };