async function tryBackupAPI(prompt, imageElement, statusElement) {
    try {
        statusElement.textContent = "Пробуем альтернативный сервис...";
        
        // 1. Делаем запрос к резервному API
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: { 
                'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                text: prompt,
                grid_size: "1"
            })
        });

        // 2. Проверяем ответ
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();
        console.log("Полный ответ API:", data); // Для диагностики

        // 3. Проверяем наличие изображения
        if (!data.output_url) {
            throw new Error("API не вернул ссылку на изображение");
        }

        // 4. Загружаем изображение
        imageElement.onload = () => {
            statusElement.textContent = "Готово через резервный API!";
            imageElement.style.display = 'block';
        };
        imageElement.onerror = () => {
            throw new Error("Не удалось загрузить изображение");
        };
        imageElement.src = data.output_url;

    } catch (error) {
        console.error("Ошибка резервного API:", error);
        statusElement.textContent = `Ошибка: ${error.message}`;
        imageElement.style.display = 'none';
    }
}
