async function tryBackupAPI(prompt, imageElement, statusElement) {
    try {
        statusElement.textContent = "Генерация через резервный API...";
        
        // 1. Улучшенный запрос к DeepAI
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: { 
                'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(prompt)}&grid_size=1`
        });

        // 2. Расширенная проверка ответа
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Ошибка API:", errorData);
            throw new Error(errorData.output || "Ошибка генерации");
        }

        const data = await response.json();
        console.log("Полный ответ:", data);

        // 3. Проверка и обработка ссылки
        if (!data.output_url) {
            throw new Error("Ссылка на изображение не получена");
        }

        // 4. Убедимся, что URL корректен
        let imageUrl = data.output_url;
        if (!imageUrl.startsWith('http')) {
            imageUrl = 'https://api.deepai.org/' + imageUrl;
        }

        // 5. Загрузка с обработкой ошибок
        await new Promise((resolve, reject) => {
            imageElement.onload = resolve;
            imageElement.onerror = () => reject(new Error("Ошибка загрузки изображения"));
            imageElement.src = imageUrl;
        });

        imageElement.style.display = 'block';
        statusElement.textContent = "Готово!";
        
    } catch (error) {
        console.error("Ошибка:", error);
        statusElement.textContent = `Ошибка: ${error.message}`;
        imageElement.style.display = 'none';
        
        // Попробуем абсолютно другой API
        await trySuperBackupAPI(prompt, imageElement, statusElement);
    }
}

async function trySuperBackupAPI(prompt, imageElement, statusElement) {
    try {
        statusElement.textContent = "Пробуем последний вариант...";
        const response = await fetch('https://backend.prodia.com/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                model: "stable_diffusion",
                steps: 25
            })
        });
        
        const data = await response.json();
        imageElement.src = data.imageUrl;
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово через экстренный API!";
    } catch (error) {
        statusElement.textContent = "Все сервисы перегружены. Попробуйте позже";
    }
}
