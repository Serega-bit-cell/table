document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('#data-table tbody tr:not(.chart-row)');

    rows.forEach(row => {
        const currentDayCell = row.cells[1]; // Ячейка "Текущий день"
        const yesterdayCell = row.cells[2]; // Ячейка "Вчера"

        const currentValue = parseFloat(currentDayCell.innerText) || 0; // Обработка NaN
        const yesterdayValue = parseFloat(yesterdayCell.innerText) || 0; // Обработка NaN

        // Проверяем, чтобы избежать деления на ноль
        let percentage = 0;
        if (currentValue > 0) {
            percentage = ((yesterdayValue / currentValue) * 100).toFixed(2);
        }

        // Обновляем ячейку "Вчера" с значением и процентом
        yesterdayCell.innerText = `${yesterdayValue} (${percentage}%)`;
    });

    // Получаем все строки таблицы
    const rowsWithChart = document.querySelectorAll('#data-table tbody tr:not(.chart-row)');

    // Обрабатываем клик на каждой строке
    rowsWithChart.forEach(row => {
        row.addEventListener('click', () => {
            // Извлекаем значения из ячеек <td>
            const values = Array.from(row.cells)
                .slice(1) // Пропускаем первую ячейку с показателем
                .map(cell => parseInt(cell.innerText, 10)); // Преобразуем текст в числа

            // Находим строку для графика, которая идет после текущей
            const chartRow = row.nextElementSibling;

            // Проверяем, виден ли график, и скрываем или показываем его
            if (chartRow.style.display === "none") {
                chartRow.style.display = "table-row"; // Показываем строку с графиком
                renderChart(values, row.cells[0].innerText, chartRow.querySelector('.chart-container'));
            } else {
                chartRow.style.display = "none"; // Скрываем строку с графиком
            }
        });
    });
});

function renderChart(data, title, container) {
    // Удаляем предыдущий график, если он существует
    container.innerHTML = '';

    // Создаем новый график
    Highcharts.chart(container, {
        chart: {
            type: 'spline' // Используем тип графика 'spline' для кривой
        },
        title: {
            text: title // Заголовок графика
        },
        xAxis: {
            categories: ['Текущий день', 'Вчера', 'Этот день недели'] // Подписи оси X
        },
        yAxis: {
            title: {
                text: 'Значение' // Заголовок оси Y
            }
        },
        series: [{
            name: title,
            data: data // Данные для графика
        }]
    });
}
