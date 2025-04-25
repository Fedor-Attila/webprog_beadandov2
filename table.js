document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const addBtn = document.getElementById('addBtn');
    const updateBtn = document.getElementById('updateBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const emailInput = document.getElementById('email');
    const cityInput = document.getElementById('city');
    
    let data = [
        { id: 1, name: 'Kovács János', age: 25, email: 'kovacs.janos@example.com', city: 'Budapest' },
        { id: 2, name: 'Nagy Eszter', age: 30, email: 'nagy.eszter@example.com', city: 'Debrecen' },
        { id: 3, name: 'Tóth Béla', age: 22, email: 'toth.bela@example.com', city: 'Szeged' },
        { id: 4, name: 'Szabó Anna', age: 28, email: 'szabo.anna@example.com', city: 'Pécs' }
    ];
    
    let currentId = null;
    let currentSortColumn = null;
    let currentSortDirection = 'asc';
    
    // Táblázat feltöltése
    function renderTable(dataToRender) {
        tableBody.innerHTML = '';
        
        dataToRender.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.email}</td>
                <td>${item.city}</td>
                <td>
                    <button class="editBtn" data-id="${item.id}">Szerkesztés</button>
                    <button class="deleteBtn" data-id="${item.id}">Törlés</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Eseményfigyelők hozzáadása az új gombokhoz
        document.querySelectorAll('.editBtn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Űrlap mezőinek törlése
    function clearForm() {
        nameInput.value = '';
        ageInput.value = '';
        emailInput.value = '';
        cityInput.value = '';
        currentId = null;
        updateBtn.disabled = true;
        cancelBtn.disabled = true;
        addBtn.disabled = false;
    }
    
    // Adat hozzáadása
    function addData() {
        if (!validateForm()) return;
        
        const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
        
        const newItem = {
            id: newId,
            name: nameInput.value,
            age: parseInt(ageInput.value),
            email: emailInput.value,
            city: cityInput.value
        };
        
        data.push(newItem);
        renderTable(data);
        clearForm();
    }
    
    // Adat frissítése
    function updateData() {
        if (!validateForm()) return;
        
        const index = data.findIndex(item => item.id === currentId);
        if (index !== -1) {
            data[index] = {
                id: currentId,
                name: nameInput.value,
                age: parseInt(ageInput.value),
                email: emailInput.value,
                city: cityInput.value
            };
            
            renderTable(data);
            clearForm();
        }
    }
    
    // Adat szerkesztése
    function handleEdit(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const item = data.find(item => item.id === id);
        
        if (item) {
            nameInput.value = item.name;
            ageInput.value = item.age;
            emailInput.value = item.email;
            cityInput.value = item.city;
            currentId = id;
            
            addBtn.disabled = true;
            updateBtn.disabled = false;
            cancelBtn.disabled = false;
        }
    }
    
    // Adat törlése
    function handleDelete(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        data = data.filter(item => item.id !== id);
        renderTable(data);
        
        if (currentId === id) {
            clearForm();
        }
    }
    
    // Űrlap validáció
    function validateForm() {
        if (!nameInput.value || nameInput.value.length < 2 || nameInput.value.length > 30) {
            alert('A név megadása kötelező, és 2-30 karakter hosszú lehet!');
            return false;
        }
        
        if (!ageInput.value || ageInput.value < 1 || ageInput.value > 120) {
            alert('Az életkor megadása kötelező, és 1-120 között lehet!');
            return false;
        }
        
        if (!emailInput.value || !emailInput.value.includes('@')) {
            alert('Érvényes email cím megadása kötelező!');
            return false;
        }
        
        if (!cityInput.value || cityInput.value.length < 2 || cityInput.value.length > 30) {
            alert('A város megadása kötelező, és 2-30 karakter hosszú lehet!');
            return false;
        }
        
        return true;
    }
    
    // Keresés
    function searchData() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) return renderTable(data);
        
        const filteredData = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.age.toString().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm) ||
            item.city.toLowerCase().includes(searchTerm)
        );
        
        renderTable(filteredData);
    }
    
    // Rendezés
    function sortData(column, direction) {
        data.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];
            
            if (column === 'age') {
                valueA = parseInt(valueA);
                valueB = parseInt(valueB);
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                valueA = String(valueA).toLowerCase();
                valueB = String(valueB).toLowerCase();
                return direction === 'asc' 
                    ? valueA.localeCompare(valueB) 
                    : valueB.localeCompare(valueA);
            }
        });
        
        renderTable(data);
    }
    
    // Eseményfigyelők
    addBtn.addEventListener('click', addData);
    updateBtn.addEventListener('click', updateData);
    cancelBtn.addEventListener('click', clearForm);
    searchBtn.addEventListener('click', searchData);
    resetSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        renderTable(data);
    });
    
    // Rendezés eseményfigyelők
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const column = this.getAttribute('data-sort');
            
            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }
            
            sortData(column, currentSortDirection);
            
            // Rendezési ikonok frissítése
            document.querySelectorAll('.sort-icon').forEach(icon => {
                icon.textContent = '↑↓';
            });
            
            const currentIcon = this.querySelector('.sort-icon');
            currentIcon.textContent = currentSortDirection === 'asc' ? '↑' : '↓';
        });
    });
    
    // Kezdeti renderelés
    renderTable(data);
});