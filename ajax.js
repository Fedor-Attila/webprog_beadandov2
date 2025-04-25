document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://gamf.nhely.hu/ajax2/';
    const CODE = 'CCP9C6lw34mw'; // Neptun kód + egyedi kód
    
    // Gombok és mezők
    const readBtn = document.getElementById('readBtn');
    const readOutput = document.getElementById('readOutput');
    const statsOutput = document.getElementById('statsOutput');
    
    const createBtn = document.getElementById('createBtn');
    const createName = document.getElementById('createName');
    const createHeight = document.getElementById('createHeight');
    const createWeight = document.getElementById('createWeight');
    const createOutput = document.getElementById('createOutput');
    
    const getDataBtn = document.getElementById('getDataBtn');
    const updateBtn = document.getElementById('updateBtn');
    const updateId = document.getElementById('updateId');
    const updateName = document.getElementById('updateName');
    const updateHeight = document.getElementById('updateHeight');
    const updateWeight = document.getElementById('updateWeight');
    const updateOutput = document.getElementById('updateOutput');
    
    const deleteBtn = document.getElementById('deleteBtn');
    const deleteId = document.getElementById('deleteId');
    const deleteOutput = document.getElementById('deleteOutput');
    
    // Read művelet
    readBtn.addEventListener('click', function() {
        fetchData('read', null, function(response) {
            if (response.list && response.list.length > 0) {
                let html = '<h4>Adatok:</h4><ul>';
                response.list.forEach(item => {
                    html += `<li>ID: ${item.id}, Név: ${item.name}, Magasság: ${item.height}, Súly: ${item.weight}</li>`;
                });
                html += '</ul>';
                readOutput.innerHTML = html;
                
                // Statisztikák
                const heights = response.list.map(item => parseFloat(item.height) || 0);
                const sum = heights.reduce((a, b) => a + b, 0);
                const avg = sum / heights.length;
                const max = Math.max(...heights);
                
                statsOutput.innerHTML = `
                    <h4>Magasság statisztikák:</h4>
                    <p>Összeg: ${sum.toFixed(2)}</p>
                    <p>Átlag: ${avg.toFixed(2)}</p>
                    <p>Legnagyobb: ${max.toFixed(2)}</p>
                `;
            } else {
                readOutput.innerHTML = '<p>Nincsenek adatok.</p>';
                statsOutput.innerHTML = '';
            }
        });
    });
    
    // Create művelet
    createBtn.addEventListener('click', function() {
        if (!validateInput(createName, 'Név') || 
            !validateInput(createHeight, 'Magasság') || 
            !validateInput(createWeight, 'Súly')) {
            return;
        }
        
        const params = {
            name: createName.value,
            height: createHeight.value,
            weight: createWeight.value,
            code: CODE,
            op: 'create'
        };
        
        fetchData('create', params, function(response) {
            if (response === 1) {
                createOutput.innerHTML = '<p style="color: green;">Adat sikeresen létrehozva!</p>';
                createName.value = '';
                createHeight.value = '';
                createWeight.value = '';
            } else {
                createOutput.innerHTML = '<p style="color: red;">Hiba történt az adat létrehozásakor!</p>';
            }
        });
    });
    
    // Adatok lekérése ID alapján
    getDataBtn.addEventListener('click', function() {
        if (!updateId.value) {
            updateOutput.innerHTML = '<p style="color: red;">ID megadása kötelező!</p>';
            return;
        }
        
        fetchData('read', null, function(response) {
            if (response.list && response.list.length > 0) {
                const item = response.list.find(i => i.id === updateId.value);
                if (item) {
                    updateName.value = item.name;
                    updateHeight.value = item.height;
                    updateWeight.value = item.weight;
                    updateOutput.innerHTML = '<p style="color: green;">Adatok betöltve!</p>';
                } else {
                    updateOutput.innerHTML = '<p style="color: red;">Nem található adat a megadott ID-vel!</p>';
                }
            } else {
                updateOutput.innerHTML = '<p style="color: red;">Nincsenek adatok.</p>';
            }
        });
    });
    
    // Update művelet
    updateBtn.addEventListener('click', function() {
        if (!updateId.value) {
            updateOutput.innerHTML = '<p style="color: red;">ID megadása kötelező!</p>';
            return;
        }
        
        if (!validateInput(updateName, 'Név') || 
            !validateInput(updateHeight, 'Magasság') || 
            !validateInput(updateWeight, 'Súly')) {
            return;
        }
        
        const params = {
            id: updateId.value,
            name: updateName.value,
            height: updateHeight.value,
            weight: updateWeight.value,
            code: CODE,
            op: 'update'
        };
        
        fetchData('update', params, function(response) {
            if (response === 1) {
                updateOutput.innerHTML = '<p style="color: green;">Adat sikeresen frissítve!</p>';
            } else {
                updateOutput.innerHTML = '<p style="color: red;">Hiba történt az adat frissítésekor!</p>';
            }
        });
    });
    
    // Delete művelet
    deleteBtn.addEventListener('click', function() {
        if (!deleteId.value) {
            deleteOutput.innerHTML = '<p style="color: red;">ID megadása kötelező!</p>';
            return;
        }
        
        const params = {
            id: deleteId.value,
            code: CODE,
            op: 'delete'
        };
        
        fetchData('delete', params, function(response) {
            if (response === 1) {
                deleteOutput.innerHTML = '<p style="color: green;">Adat sikeresen törölve!</p>';
                deleteId.value = '';
            } else {
                deleteOutput.innerHTML = '<p style="color: red;">Hiba történt az adat törlésekor!</p>';
            }
        });
    });
    
    // API hívás
    function fetchData(operation, params, callback) {
        let url = API_URL;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(params)
        };
        
        if (operation === 'read') {
            options.body = new URLSearchParams({
                op: 'read',
                code: CODE
            });
        }
        
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hálózati hiba történt');
                }
                return response.json();
            })
            .then(data => {
                callback(data);
            })
            .catch(error => {
                console.error('Hiba:', error);
                const outputElement = operation === 'read' ? readOutput : 
                                    operation === 'create' ? createOutput : 
                                    operation === 'update' ? updateOutput : deleteOutput;
                outputElement.innerHTML = `<p style="color: red;">Hiba történt: ${error.message}</p>`;
            });
    }
    
    // Validáció
    function validateInput(input, fieldName) {
        if (!input.value || input.value.trim() === '') {
            alert(`${fieldName} megadása kötelező!`);
            input.focus();
            return false;
        }
        
        if (input.value.length > 30) {
            alert(`${fieldName} maximum 30 karakter hosszú lehet!`);
            input.focus();
            return false;
        }
        
        return true;
    }
});