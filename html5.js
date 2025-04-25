document.addEventListener('DOMContentLoaded', function() {
    // Web Storage példa
    const storageInput = document.getElementById('storageInput');
    const storageOutput = document.getElementById('storageOutput');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    saveBtn.addEventListener('click', function() {
        localStorage.setItem('userInput', storageInput.value);
        storageOutput.textContent = 'Adatok elmentve!';
    });
    
    loadBtn.addEventListener('click', function() {
        const savedData = localStorage.getItem('userInput');
        if (savedData) {
            storageInput.value = savedData;
            storageOutput.textContent = 'Adatok betöltve!';
        } else {
            storageOutput.textContent = 'Nincsenek mentett adatok!';
        }
    });
    
    clearBtn.addEventListener('click', function() {
        localStorage.removeItem('userInput');
        storageInput.value = '';
        storageOutput.textContent = 'Adatok törölve!';
    });
    
    // Web Workers példa
    const startWorkerBtn = document.getElementById('startWorkerBtn');
    const stopWorkerBtn = document.getElementById('stopWorkerBtn');
    const workerOutput = document.getElementById('workerOutput');
    let worker;
    
    startWorkerBtn.addEventListener('click', function() {
        if (typeof(Worker) !== "undefined") {
            if (typeof(worker) == "undefined") {
                worker = new Worker("worker.js");
            }
            
            worker.onmessage = function(event) {
                workerOutput.textContent = event.data;
            };
            
            worker.postMessage("start");
        } else {
            workerOutput.textContent = "A böngésző nem támogatja a Web Workers-t!";
        }
    });
    
    stopWorkerBtn.addEventListener('click', function() {
        if (worker) {
            worker.terminate();
            worker = undefined;
            workerOutput.textContent = "Számítás megszakítva!";
        }
    });
    
    // Server-Sent Events példa
    const startSSEBtn = document.getElementById('startSSEBtn');
    const stopSSEBtn = document.getElementById('stopSSEBtn');
    const sseOutput = document.getElementById('sseOutput');
    let eventSource;
    
    startSSEBtn.addEventListener('click', function() {
        if (typeof(EventSource) !== "undefined") {
            eventSource = new EventSource("sse.php");
            
            eventSource.onmessage = function(event) {
                sseOutput.textContent = "Üzenet: " + event.data;
            };
            
            eventSource.onerror = function() {
                sseOutput.textContent = "Hiba történt az SSE kapcsolatban!";
                eventSource.close();
            };
        } else {
            sseOutput.textContent = "A böngésző nem támogatja a Server-Sent Events-t!";
        }
    });
    
    stopSSEBtn.addEventListener('click', function() {
        if (eventSource) {
            eventSource.close();
            sseOutput.textContent = "SSE kapcsolat lezárva!";
        }
    });
    
    // Geolocation API példa
    const geolocationBtn = document.getElementById('geolocationBtn');
    const geolocationOutput = document.getElementById('geolocationOutput');
    
    geolocationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    geolocationOutput.textContent = 
                        `Szélesség: ${position.coords.latitude}, Hosszúság: ${position.coords.longitude}`;
                },
                function(error) {
                    geolocationOutput.textContent = 
                        `Hiba történt: ${error.message}`;
                }
            );
        } else {
            geolocationOutput.textContent = "A böngésző nem támogatja a geolokációt!";
        }
    });
    
    // Drag and Drop API példa
    const dragImage = document.getElementById('dragImage');
    const dropArea = document.getElementById('dropArea');
    
    dragImage.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    });
    
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropArea.classList.add('highlight');
    });
    
    dropArea.addEventListener('dragleave', function() {
        dropArea.classList.remove('highlight');
    });
    
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        dropArea.classList.remove('highlight');
        
        const id = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        
        dropArea.innerHTML = '';
        const clonedElement = draggedElement.cloneNode(true);
        clonedElement.style.width = '100%';
        clonedElement.style.height = '100%';
        clonedElement.style.objectFit = 'cover';
        clonedElement.draggable = false;
        dropArea.appendChild(clonedElement);
    });
    
    // Canvas példa
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const drawBtn = document.getElementById('drawBtn');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    
    drawBtn.addEventListener('click', function() {
        // Háttér
        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Kör
        ctx.beginPath();
        ctx.arc(150, 100, 50, 0, Math.PI * 2);
        ctx.fillStyle = '#e8491d';
        ctx.fill();
        
        // Szöveg
        ctx.font = '20px Arial';
        ctx.fillStyle = '#35424a';
        ctx.textAlign = 'center';
        ctx.fillText('Canvas', 150, 110);
        
        // Vonal
        ctx.beginPath();
        ctx.moveTo(50, 150);
        ctx.lineTo(250, 150);
        ctx.strokeStyle = '#35424a';
        ctx.lineWidth = 3;
        ctx.stroke();
    });
    
    clearCanvasBtn.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Rajzolás alapértelmezettként
    drawBtn.click();
});