<?php
// SSE (Server-Sent Events) példafájl
// A böngészővel való folyamatos kapcsolatot tart fenn, és eseményeket küld

// Szükséges header
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// Végtelen ciklus a folyamatos küldéshez
while (true) {
    // Az aktuális idő elküldése kliensnek
    echo "data: " . date('Y-m-d H:i:s') . "\n\n";
    ob_flush();
    flush();
    
    // 1 másodperc szünet két üzenet között
    sleep(1);
}
?>