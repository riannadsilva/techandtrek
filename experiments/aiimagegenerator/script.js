const outputImg = document.getElementById('output-img');

document.getElementById('submit-btn').addEventListener("click", async () => {
    const prompt = document.getElementById("instruction").value.trim();
    
    // Validate input
    if (!prompt) {
        outputImg.innerHTML = `<p style="color: red;">Please enter a description for your image!</p>`;
        return;
    }
    
    // Show loading state
    outputImg.innerHTML = `<p>Generating image...</p>`;
    console.log('Generating image for prompt:', prompt);

    try {
        // Make request with proper headers
        const res = await fetch("/.netlify/functions/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt }),
        });

        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);

        // Check if response is ok
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        // Parse JSON response
        const data = await res.json();
        console.log('Response data:', data);

        // Check for API errors
        if (data.error) {
            throw new Error(data.error.message || 'API returned an error');
        }

        // Extract image URL
        const imageUrl = data?.data?.[0]?.url;

        if (imageUrl) {
            outputImg.innerHTML = `
                <img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 8px;" />
                <p style="margin-top: 10px; color: green;">✅ Image generated successfully!</p>
            `;
            console.log('Image generated successfully:', imageUrl);
        } else {
            throw new Error('No image URL found in response');
        }

    } catch (error) {
        console.error('Generation error:', error);
        
        // Show user-friendly error message
        let errorMessage = 'Image generation failed. ';
        
        if (error.message.includes('404')) {
            errorMessage += 'Function not found. Check your deployment.';
        } else if (error.message.includes('500')) {
            errorMessage += 'Server error. Check your API key and function logs.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Network error. Check your connection.';
        } else {
            errorMessage += error.message;
        }
        
        outputImg.innerHTML = `<p style="color: red;">❌ ${errorMessage}</p>`;
    }
});
