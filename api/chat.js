// Vercel Serverless Function - Claude API Proxy
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { systemPrompt, userPrompt } = req.body;
        
        if (!systemPrompt || !userPrompt) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Get API key from environment variable
        const apiKey = process.env.ANTHROPIC_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured on server' });
        }
        
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2048,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ]
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Claude API error:', error);
            return res.status(response.status).json({ 
                error: error.error?.message || 'API request failed' 
            });
        }
        
        const data = await response.json();
        
        // Return the response
        return res.status(200).json({
            response: data.content[0].text
        });
        
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
}