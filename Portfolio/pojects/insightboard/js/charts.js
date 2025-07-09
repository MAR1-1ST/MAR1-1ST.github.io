let trendChart, salesChart, categoryChart, trafficChart;

function createCharts() {
    const colors = getChartColors();

    // 1. Trends Line Chart (Dashboard)
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Sales',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: true,
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: colors.textColor },
                        grid: { color: colors.gridColor }
                    },
                    x: {
                        ticks: { color: colors.textColor },
                        grid: { color: colors.gridColor }
                    }
                },
                plugins: {
                    legend: { labels: { color: colors.textColor } }
                }
            }
        });
    }

    // 2. Sales by Region Bar Chart (Dashboard)
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        salesChart = new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['North', 'South', 'East', 'West', 'Central'],
                datasets: [{
                    label: 'Revenue (in thousands)',
                    data: [52, 44, 62, 38, 70],
                    backgroundColor: [colors.secondary, '#60a5fa', colors.tertiary, '#f87171', '#a78bfa'],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { ticks: { color: colors.textColor }, grid: { color: colors.gridColor } },
                    x: { ticks: { color: colors.textColor }, grid: { display: false } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // 3. Category Breakdown Pie Chart (Dashboard)
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        categoryChart = new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: ['Electronics', 'Apparel', 'Groceries', 'Books'],
                datasets: [{
                    data: [300, 150, 100, 50],
                    backgroundColor: [colors.primary, colors.secondary, colors.tertiary, '#6b7280'],
                    borderColor: getChartColors().gridColor === 'rgba(255, 255, 255, 0.1)' ? '#1f2937' : '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: colors.textColor }
                    }
                }
            }
        });
    }
    
    // 4. Traffic Sources Donut Chart (Analytics Page)
    const trafficCtx = document.getElementById('trafficChart');
    if(trafficCtx) {
        trafficChart = new Chart(trafficCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Organic Search', 'Referral', 'Social Media'],
                datasets: [{
                    data: [45, 25, 15, 15],
                    backgroundColor: [colors.primary, colors.secondary, '#60a5fa', colors.tertiary],
                    borderColor: getChartColors().gridColor === 'rgba(255, 255, 255, 0.1)' ? '#1f2937' : '#ffffff',
                    borderWidth: 2
                }]
            },
             options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: colors.textColor }
                    }
                }
            }
        });
    }
}

// Function to update chart themes
function updateAllChartsTheme() {
    const charts = [trendChart, salesChart, categoryChart, trafficChart];
    const colors = getChartColors();

    charts.forEach(chart => {
        if (chart) {
            // Update colors
            chart.options.scales.y.ticks.color = colors.textColor;
            chart.options.scales.x.ticks.color = colors.textColor;
            chart.options.scales.y.grid.color = colors.gridColor;
            chart.options.scales.x.grid.color = colors.gridColor;
            if (chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = colors.textColor;
            }
            if(chart.config.type === 'pie' || chart.config.type === 'doughnut') {
                chart.data.datasets[0].borderColor = (document.documentElement.getAttribute('data-theme') === 'dark') ? '#1f2937' : '#ffffff';
            }
            chart.update();
        }
    });
}

// Initial chart creation on page load
document.addEventListener('DOMContentLoaded', createCharts);