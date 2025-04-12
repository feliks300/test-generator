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
        // Вариант 1: Рабочий API без ключа (для теста)
        const response = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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 ', 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        // Проверяем статус ответа
        if (response.status === 503) {
            // Модель загружается
            const data = await response.json();
            statusElement.textContent = "Модель загружается, попробуйте через 30 секунд";
            return;
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Получаем изображение
        const imageBlob = await response.blob();
        
        if (imageBlob.size === 0) {
            throw new Error("Получен пустой файл изображения");
        }

        const imageUrl = URL.createObjectURL(imageBlob);
        imageElement.onload = () => {
            URL.revokeObjectURL(imageUrl); // Освобождаем память
        };
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово! Кликните правой кнопкой для сохранения";

    } catch (error) {
        console.error("Полная ошибка:", error);
        statusElement.textContent = `Ошибка: ${error.message}. Попробуйте другой запрос`;
        
        // Вариант 2: Резервный API
        if (error.message.includes("Failed to fetch")) {
            statusElement.textContent += "\nПробуем альтернативный источник...";
            await tryBackupAPI(prompt, imageElement, statusElement);
        }
    }
}

async function tryBackupAPI(prompt, imageElement, statusElement) {
    try {
        const backupResponse = await fetch('https://backend.prodia.com/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "stable_diffusion",
                width: 512,
                height: 512
            })
        });

        const result = await backupResponse.json();
        if (result.imageUrl) {
            imageElement.src = result.imageUrl;
            imageElement.style.display = 'block';
            statusElement.textContent = "Готово через резервный API!";
        } else {
            throw new Error("Резервный API не вернул изображение");
        }
    } catch (backupError) {
        console.error("Ошибка резервного API:", backupError);
        statusElement.textContent = "Все сервисы временно недоступны. Попробуйте позже";
    }
}
