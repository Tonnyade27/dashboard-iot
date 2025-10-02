const API_URL = "http://localhost:3000/api";

// ------------------ LOGIN ------------------
async function login(event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Login failed. Please check your credentials.");
        }

        const data = await response.json();

        localStorage.setItem("authToken", data.token);

        window.location.href = "dashboard.html";
    } catch (error) {
        alert(error.message); 
    }
}

// ------------------ FETCH SENSOR DATA ------------------
async function fetchSensorData() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("You are not authenticated. Please login first.");
        window.location.href = "index.html";
        return;
    }

    console.log("authToken:", localStorage.getItem("authToken"));


    try {
        const response = await fetch(`${API_URL}/sensors`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch sensor data. Please try again.");
        }

        console.log("Raw response object:", response);
        const sensorData = await response.json();
        console.log("Parsed sensorData:", sensorData);


        if (!sensorData || sensorData.length === 0) {
            console.log("Data tidak ditemukan, set default 0");
            updateSensorUI({
                ec: 0,
                ph: 0,
                humidity: 0,
                nitrogen: 0,
                potassium: 0,
                phosphorus: 0,
                temperature: 0
            });
            return;
        }

        const latestRecord = sensorData[0]; // ambil data paling baru
        console.log("Latest record:", latestRecord);

        updateSensorUI(latestRecord.data);




    } catch (error) {
        console.error(error);
        alert(error.message);
        updateSensorUI({});
    }
}

// ------------------ UPDATE UI ------------------
function updateSensorUI(data) {
    // daftar id sensor sesuai backend
    const sensorList = [
        "nitrogen", 
        "phosphorus", 
        "potassium", 
        "ph", 
        "ec", 
        "humidity", 
        "temperature"
    ];
    console.log("Updating UI with:", data);

    sensorList.forEach(name => {
        const sensorElement = document.querySelector(`#${name}-value`);
        if (sensorElement) {
            // ambil nilai dari object sensors, fallback ke 0
            sensorElement.textContent = data[name] ?? 0;
        }
    });
}

// ------------------ EVENT LISTENER ------------------
const loginForm = document.querySelector("form");
if (loginForm) {
    loginForm.addEventListener("submit", login);
}

if (window.location.pathname.includes("dashboard.html")) {
    fetchSensorData();
    setInterval(fetchSensorData, 5000);
}

const powerData = [10, 20, 15, 30, 25, 40, 35]; 
const energyData = [1, 1.5, 2, 2.5, 3, 3.5, 4]; 
const labels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]; 

function createCharts() {
    
    const powerCtx = document.getElementById("powerChart").getContext("2d");
    new Chart(powerCtx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Daya (Watt)",
                    data: powerData,
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: "top" },
                title: { display: true, text: "Grafik Daya (Watt)" },
            },
            scales: {
                x: { title: { display: true, text: "Hari" } },
                y: { title: { display: true, text: "Daya (Watt)" } },
            },
        },
    });

    
    const energyCtx = document.getElementById("energyChart").getContext("2d");
    new Chart(energyCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Energi (kWh)",
                    data: energyData,
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgb(255, 159, 64)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: "top" },
                title: { display: true, text: "Grafik Energi (kWh)" },
            },
            scales: {
                x: { title: { display: true, text: "Hari" } },
                y: { title: { display: true, text: "Energi (kWh)" } },
            },
        },
    });
}



if (window.location.pathname.includes("dashboard.html")) {
    fetchSensorData();  
    createCharts();     
}

async function toggleDevice(deviceName) {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("You are not authenticated. Please login first.");
        window.location.href = "index.html";
        return;
    }

    const button = document.getElementById(`${deviceName}-button`);
    const currentStatus = button.classList.contains("bg-green-500") ? 1 : 0; 

    const dataToSend = {
        name: deviceName,  
        value: currentStatus === 0 ? 1 : 0  
    };

    try {
        const response = await fetch(`${API_URL}/actuator`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(dataToSend)  
        });

        if (!response.ok) {
            throw new Error(`Failed to toggle ${deviceName}. HTTP Status: ${response.status}`);
        }

        const result = await response.json();

        console.log(result); 

        if (result.actuator && result.actuator.value === 1) {
            button.classList.remove("bg-blue-500");
            button.classList.add("bg-green-500", "animate-pulse");
        } else {
            button.classList.remove("bg-green-500", "animate-pulse");
            button.classList.add("bg-blue-500");
        }
    } catch (error) {
        console.error("Error:", error); 
        alert(error.message);  
    }
}



document.getElementById("kipas-button").addEventListener("click", () => toggleDevice("kipas"));
document.getElementById("ac-button").addEventListener("click", () => toggleDevice("ac"));
document.getElementById("tv-button").addEventListener("click", () => toggleDevice("tv"));
document.getElementById("lampu-button").addEventListener("click", () => toggleDevice("lampu"));

