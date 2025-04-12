async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const statusElement = document.getElementById('status');
    const imageElement = document.getElementById('output-image');

    if (!prompt) {
        statusElement.textContent = "Введите описание изображения";
        return;
    }

    statusElement.textContent = "Генерация...";
    imageElement.style.display = 'none';

    try {
        // Вариант 1: Основной API
        const response = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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 ', // 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        // Обработка 403 ошибки
        if (response.status === 403) {
            throw new Error("Доступ запрещен. Проверьте API-ключ и лицензию модели");
        }

        // Обработка других ошибок
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const imageBlob = await response.blob();
        imageElement.src = URL.createObjectURL(imageBlob);
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово!";

    } catch (error) {
        console.error("Детали ошибки:", error);
        statusElement.innerHTML = `
            Ошибка: ${error.message}<br>
            <small>Попробуйте:</small>
            <ul>
                <li>Проверить API-ключ</li>
                <li>Принять лицензию модели</li>
                <li>Использовать <button onclick="useBackupAPI()">резервный API</button></li>
            </ul>
        `;
    }
}

// Резервный API
async function useBackupAPI() {
    const prompt = document.getElementById('prompt').value;
    const statusElement = document.getElementById('status');
    
    statusElement.textContent = "Пробуем альтернативный сервис...";
    
    try {
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: { 'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' }, // Бесплатный демо-ключ
            body: new URLSearchParams({ text: prompt })
        });
        
        const data = await response.json();
        document.getElementById('output-image').src = data.output_url;
        statusElement.textContent = "Успешно через резервный API!";
    } catch (error) {
        statusElement.textContent = `Ошибка резервного API: ${error.message}`;
    }
}
