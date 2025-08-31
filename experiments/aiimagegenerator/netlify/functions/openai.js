exports.handler = async function(event, context) {
    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Check environment variable (change this to match your Netlify setup)
        const apiKey = process.env.OPENAI_API_KEY_PROD; // Changed from OPENAI_API_KEY_PROD
        
        if (!apiKey) {
            console.error('Missing API key. Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: { message: 'OpenAI API key not configured' }
                })
            };
        }

        // Parse and validate request
        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: { message: 'Request body is required' } })
            };
        }

        const { prompt } = JSON.parse(event.body);
        
        if (!prompt || prompt.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: { message: 'Prompt is required' } })
            };
        }

        console.log(`Generating image for prompt: "${prompt.substring(0, 50)}..."`);

        // Call OpenAI API (using built-in fetch)
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt.trim(),
                n: 1,
                size: "256x256"
            })
        });

        console.log(`OpenAI API response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify(errorData)
            };
        }

        const data = await response.json();
        console.log('Image generated successfully');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: { 
                    message: 'Internal server error',
                    details: error.message 
                }
            })
        };
    }
};
