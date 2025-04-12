async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const statusElement = document.getElementById('status');
    const imageElement = document.getElementById('output-image');

    if (!prompt) {
        statusElement.textContent = "Введите описание изображения";
        return;
    }

    statusElement.textContent = "Генерация... (это займет 20-40 секунд)";
    imageElement.style.display = 'none';

    try {
        // 1. Проверяем статус модели
        const modelStatus = await fetch(
            'https://api-inference.huggingface.co/status/stabilityai/stable-diffusion-xl-base-1.0',
            {
                headers: {
                    'Authorization': 'Bearer hf_ваш_ключ',
                    'Content-Type': 'application/json'
                }
            }
        );

        // 2. Если модель не готова - ждем
        if (modelStatus.status === 404) {
            throw new Error("Модель не найдена. Используем резервный API");
        }

        // 3. Основной запрос
        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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 ',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: { wait_for_model: true }
                }),
            }
        );

        // Обработка ответа
        if (response.status === 404) {
            throw new Error("Модель временно недоступна");
        }

        const imageBlob = await response.blob();
        imageElement.src = URL.createObjectURL(imageBlob);
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово! Кликните правой кнопкой для сохранения";

    } catch (error) {
        console.error("Ошибка:", error);
        await tryBackupAPI(prompt, imageElement, statusElement);
    }
}

// Резервный API
async function tryBackupAPI(prompt, imageElement, statusElement) {
    try {
        statusElement.textContent = "Пробуем альтернативный сервис...";
        
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: { 'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' },
            body: new URLSearchParams({ text: prompt })
        });
        
        const data = await response.json();
        imageElement.src = data.output_url;
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово через резервный API!";
    } catch (backupError) {
        statusElement.textContent = "Все сервисы перегружены. Попробуйте позже";
    }
}
