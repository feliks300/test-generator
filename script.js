async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const statusElement = document.getElementById('status');
    const imageElement = document.getElementById('output-image');

    if (!prompt) {
        statusElement.textContent = "Введите описание!";
        return;
    }

    statusElement.textContent = "Генерация... (может занять до 1 минуты)";
    imageElement.style.display = 'none';

    try {
        // 1. Проверяем статус модели
        const modelStatus = await fetch(
            'https://api-inference.huggingface.co/status/stabilityai/stable-diffusion-xl-base-1.0',
            {
                headers: {
                    'Authorization': 'Bearer ВАШ_НАСТОЯЩИЙ_КЛЮЧ', // Замените на реальный!
                    'Content-Type': 'application/json',
                }
            }
        );

        // 2. Если модель не готова - запускаем
        if (!modelStatus.ok) {
            await fetch(
                'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ВАШ_НАСТОЯЩИЙ_КЛЮЧ',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ options: { wait_for_model: true } })
                }
            );
        }

        // 3. Делаем запрос на генерацию
        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            {
                method: 'POST',
                headers: {
                    'Authorization': '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',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    inputs: prompt,
                    options: { wait_for_model: true }
                }),
            }
        );

        if (!response.ok) throw new Error(await response.text());

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        imageElement.src = imageUrl;
        imageElement.style.display = 'block';
        statusElement.textContent = "Готово!";
    } catch (error) {
        statusElement.textContent = `Ошибка: ${error.message}`;
        console.error(error);
    }
}
