document.addEventListener('DOMContentLoaded', () => {
    function getRandomNumber(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }

    const min = 0;
    const max = 100;
    const data = {
        nitrogen: getRandomNumber(min, max),
        phosphorus: getRandomNumber(min, max),
        potassium: getRandomNumber(min, max),
        pH: getRandomNumber(0, 14), 
        conductivity: getRandomNumber(0, 2000), 
        temperature: getRandomNumber(-10, 50),
        humidity: getRandomNumber(0, 100)
    };

    function updateValue() {
        document.querySelector('.node:nth-child(1) .value').textContent = `${data.nitrogen} ppm`;
        document.querySelector('.node:nth-child(2) .value').textContent = `${data.phosphorus} ppm`;
        document.querySelector('.node:nth-child(3) .value').textContent = `${data.potassium} ppm`;
        document.querySelector('.node:nth-child(4) .value').textContent = `${data.pH}`;
        document.querySelector('.node:nth-child(5) .value').textContent = `${data.conductivity} µS/cm`;
        document.querySelector('.node:nth-child(6) .value').textContent = `${data.temperature}°C`;
        document.querySelector('.node:nth-child(7) .value').textContent = `${data.humidity}%`;
        // document.querySelector('.node-1:nth-child(1) .value').textContent = `${data2.current} A`;
    }
    updateValue();
    setInterval(() => {
        data.nitrogen = getRandomNumber(min, max);
        data.phosphorus = getRandomNumber(min, max);
        data.potassium = getRandomNumber(min, max);
        data.pH = getRandomNumber(0, 14);
        data.conductivity = getRandomNumber(0, 2000);
        data.temperature = getRandomNumber(-10, 50);
        data.humidity = getRandomNumber(0, 100);

        updateValue();
    }, 3000);
});

// data chart
// Function to get current time in HH:MM format
function getCurrentTime(offsetMinutes) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - offsetMinutes);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to generate random data
function generateRandomData(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate data for the past 7 minutes
function generateData() {
    const data = [];
    for (let i = 6; i >= 0; i--) {
    data.push({
        timestamp: getCurrentTime(i),
        power: generateRandomData(10, 50),
        current: generateRandomData(2, 10),
        voltage: generateRandomData(210, 260),
        temperature: generateRandomData(20, 40) // Random temperature between 20°C and 40°C
    });
    }
    return data;
}

// Function to update the chart with new data
function updateChart(chart, data, type) {
    chart.data.labels = data.map(item => item.timestamp);
    chart.data.datasets[0].data = data.map(item => item[type]);
    chart.update();
}

// Initial random data
let randomData = generateData();

// Create charts
const powerCtx = document.getElementById('powerChart').getContext('2d');
const currentCtx = document.getElementById('currentChart').getContext('2d');
const voltageCtx = document.getElementById('voltageChart').getContext('2d');
const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');

const powerChart = new Chart(powerCtx, {
    type: 'line',
    data: {
    labels: randomData.map(item => item.timestamp),
    datasets: [{
        label: 'Power (W)',
        data: randomData.map(item => item.power),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false
    }]
    },
    options: {
    scales: {
        x: {
        type: 'category',
        ticks: {
            autoSkip: true,
            maxTicksLimit: 10
        }
        },
        y: {
        beginAtZero: true
        }
    }
    }
});

const currentChart = new Chart(currentCtx, {
    type: 'line',
    data: {
    labels: randomData.map(item => item.timestamp),
    datasets: [{
        label: 'Current (A)',
        data: randomData.map(item => item.current),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        fill: false
    }]
    },
    options: {
    scales: {
        x: {
        type: 'category',
        ticks: {
            autoSkip: true,
            maxTicksLimit: 10
        }
        },
        y: {
        beginAtZero: true
        }
    }
    }
});

const voltageChart = new Chart(voltageCtx, {
    type: 'line',
    data: {
    labels: randomData.map(item => item.timestamp),
    datasets: [{
        label: 'Voltage (V)',
        data: randomData.map(item => item.voltage),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        fill: false
    }]
    },
    options: {
    scales: {
        x: {
        type: 'category',
        ticks: {
            autoSkip: true,
            maxTicksLimit: 10
        }
        },
        y: {
        beginAtZero: true
        }
    }
    }
});

const temperatureChart = new Chart(temperatureCtx, {
    type: 'line',
    data: {
    labels: randomData.map(item => item.timestamp),
    datasets: [{
        label: 'Temperature (°C)',
        data: randomData.map(item => item.temperature),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: false
    }]
    },
    options: {
    scales: {
        x: {
        type: 'category',
        ticks: {
            autoSkip: true,
            maxTicksLimit: 10
        }
        },
        y: {
        beginAtZero: true
        }
    }
    }
});

// Update the charts every 7 minutes
setInterval(() => {
    randomData = generateData();
    updateChart(powerChart, randomData, 'power');
    updateChart(currentChart, randomData, 'current');
    updateChart(voltageChart, randomData, 'voltage');
    updateChart(temperatureChart, randomData, 'temperature');
}, 7 * 60 * 1000); // 7 minutes in milliseconds
