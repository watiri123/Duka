<?php
// TEMPORARY DEBUG - REMOVE LATER
echo "<h2>Database Debug from index.php</h2>";

try {
    $pdo = new PDO("mysql:host=localhost;dbname=dukapro_db", 'root', '');
    echo "<p style='color: green; font-size: 20px;'>✅ DATABASE CONNECTED SUCCESSFULLY!</p>";
    
    // Test if we can create the database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS dukapro_db");
    echo "<p style='color: green;'>✅ Database 'dukapro_db' is ready</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red; font-size: 20px;'>❌ DATABASE ERROR: " . $e->getMessage() . "</p>";
    
    // Try without database name
    try {
        $pdo = new PDO("mysql:host=localhost", 'root', '');
        echo "<p style='color: orange;'>⚠ Can connect to MySQL but database 'dukapro_db' doesn't exist</p>";
        
        // Create the database
        $pdo->exec("CREATE DATABASE dukapro_db");
        echo "<p style='color: green;'>✅ Database 'dukapro_db' created successfully!</p>";
        
    } catch (PDOException $e2) {
        echo "<p style='color: red;'>❌ Cannot connect to MySQL server: " . $e2->getMessage() . "</p>";
    }
}
// END TEMPORARY DEBUG

// Original API docs below
echo "<hr>";
?>
{
    "message": "DukaPro - Soko Manager API",
    "version": "1.0.0",
    "endpoints": {
        "auth": {
            "POST \/api\/auth.php": "User authentication (login\/logout)",
            "GET \/api\/auth.php": "Check authentication status"
        },
        "items": {
            "GET \/api\/items.php": "Get all items",
            "POST \/api\/items.php": "Create new item",
            "PUT \/api\/items.php?id={id}": "Update item",
            "DELETE \/api\/items.php?id={id}": "Delete item"
        },
        "sales": {
            "GET \/api\/sales.php": "Get all sales",
            "POST \/api\/sales.php": "Create new sale record"
        },
        "debts": {
            "GET \/api\/debts.php": "Get all debts (optional: ?status=pending|paid|all)",
            "POST \/api\/debts.php": "Create new debt record",
            "PUT \/api\/debts.php?id={id}": "Update debt record",
            "DELETE \/api\/debts.php?id={id}": "Delete debt record"
        },
        "dashboard": {
            "GET \/api\/dashboard.php": "Get dashboard statistics"
        }
    },
    "authentication": "All endpoints (except auth) require session-based authentication",
    "demo_credentials": {
        "username": "admin",
        "password": "admin123"
    }
}