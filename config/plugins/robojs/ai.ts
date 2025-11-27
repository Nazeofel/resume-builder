import { OpenAiEngine } from '@robojs/ai/engines/openai'

export default {
    instructions: 'You are a professional resume and cover letter writing assistant. Generate tailored, compelling cover letters based on resume data and job descriptions.',
    engine: new OpenAiEngine({
        clientOptions: {
            apiKey: process.env.OPENAI_API_KEY
        },
        chat: {
            model: 'gpt-5',
            temperature: 0.7,
            maxOutputTokens: 1000
        }
    }),
    // usage: {
    //     limits: [
    //         {
    //             window: 'day',
    //             mode: 'alert',
    //             maxTokens: 500_000
    //         },
    //         {
    //             window: 'month',
    //             mode: 'block',
    //             maxTokens: 2_000_000
    //         }
    //     ]
    // }
}
