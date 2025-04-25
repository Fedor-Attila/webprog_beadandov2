self.onmessage = function(e) {
    if (e.data === "start") {
        let result = 0;
        
        // Számítási feladat - Fibonacci sorozat
        for (let i = 0; i < 40; i++) {
            result = fibonacci(i);
            self.postMessage(`Fibonacci(${i}) = ${result}`);
            
            // Szünet a demonstrációhoz
            if (i % 10 === 0) {
                const start = Date.now();
                while (Date.now() - start < 500) {}
            }
        }
        
        self.postMessage("Számítás befejeződött!");
    }
};

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}