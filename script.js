async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const statusElement = document.getElementById('status');
    const imageElement = document.getElementById('output-image');

    if (!prompt) {
        statusElement.textContent = "Введите описание!";
        return;
    }

    statusElement.textContent = "Генерация... (ожидайте 10-30 секунд)";
    imageElement.style.display = 'none';

    try {
        // Вариант 1: Альтернативный бесплатный API (не требует ключа)
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: prompt,
                grid_size: "1"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.output || "Ошибка API");
        }

        const result = await response.json();
        
        if (!result.output_url) {
            throw new Error("Не удалось сгенерировать изображение");
        }

        imageElement.src = result.output_url;
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово! Нажмите для сохранения";

    } catch (error) {
        statusElement.textContent = `Ошибка: ${error.message}`;
        console.error("Детали ошибки:", error);
    }
}
