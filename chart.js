document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('dataTable');
    const rows = table.querySelectorAll('tbody tr');
    const ctx = document.getElementById('myChart').getContext('2d');
    let chart;
    
    // Kezdeti diagram létrehozása
    createChart(0);
    
    // Eseményfigyelő a táblázat soraira
    rows.forEach((row, index) => {
        row.addEventListener('click', function() {
            createChart(index);
        });
    });
    
    function createChart(rowIndex) {
        // Táblázat adatainak kinyerése
        const labels = [];
        const data = [];
        const colors = [];
        
        const headerCells = table.querySelectorAll('thead th');
        const selectedRow = rows[rowIndex];
        const cells = selectedRow.querySelectorAll('td');
        
        // Kiemelés a kiválasztott sornak
        rows.forEach(row => row.style.backgroundColor = '');
        selectedRow.style.backgroundColor = '#ffece6';
        
        // Adatok összegyűjtése
        for (let i = 1; i < headerCells.length; i++) {
            labels.push(headerCells[i].textContent);
            data.push(parseFloat(cells[i].textContent.replace(/,/g, '')));
            colors.push(getRandomColor());
        }
        
        // Ha már létezik diagram, töröljük
        if (chart) {
            chart.destroy();
        }
        
        // Új diagram létrehozása
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Adatok ${cells[1].textContent}. évhez`,
                    data: data,
                    backgroundColor: colors,
                    borderColor: '#e8491d',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Vállalati teljesítmény adatok',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color + '80'; // 50% átlátszóság
    }
});