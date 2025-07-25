const outputImg = document.getElementById('output-img');

document.getElementById('submit-btn').addEventListener("click", async () => {
    const prompt = document.getElementById("instruction").value;
    outputImg.innerHTML = `<p>Generating image...</p>`;

    const res = await fetch("/.netlify/functions/openai", {
        method: "POST",
        body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    const imageUrl = data?.data?.[0]?.url;

    if (imageUrl) {
        outputImg.innerHTML = `<img src="${imageUrl}" alt="Generated Image" />`;
    } else {
        outputImg.innerHTML = `<p>Image generation failed.</p>`;
    }
});




