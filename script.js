async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const statusElement = document.getElementById('status');
    const imageElement = document.getElementById('output-image');

    if (!prompt) {
        statusElement.textContent = "Введите описание!";
        return;
    }

    statusElement.textContent = "Генерация...";
    imageElement.style.display = 'none';

    try {
        // Используем бесплатный демо-API (ограничено 50 запросами/день)
        const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) throw new Error('Ошибка API');

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово!";
    } catch (error) {
        statusElement.textContent = "Ошибка: " + error.message;
    }
}
