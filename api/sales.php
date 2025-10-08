<?php
header('Access-Control-Allow-Origin: http://localhost:3003');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/connection.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

$userId = requireAuth();

// Get all sales
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT s.*, 
                   GROUP_CONCAT(CONCAT(si.quantity, 'x ', i.name) SEPARATOR ', ') as items_description
            FROM sales s 
            LEFT JOIN sale_items si ON s.id = si.sale_id
            LEFT JOIN items i ON si.item_id = i.id
            WHERE s.user_id = ? 
            GROUP BY s.id 
            ORDER BY s.sale_date DESC
        ");
        $stmt->execute([$userId]);
        $sales = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse([
            'success' => true,
            'data' => $sales
        ]);
        
    } catch (PDOException $e) {
        sendResponse([
            'success' => false,
            'error' => 'Failed to fetch sales: ' . $e->getMessage()
        ], 500);
    }
}

// Create new sale
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getRequestBody();
    
    // Validate required fields
    $errors = validateRequiredFields($input, ['items', 'total_amount']);
    if (!empty($errors)) {
        sendResponse([
            'success' => false,
            'error' => 'Validation failed',
            'details' => $errors
        ], 400);
    }
    
    try {
        $pdo->beginTransaction();
        
        // Create sale record
        $stmt = $pdo->prepare("
            INSERT INTO sales (user_id, total_amount) 
            VALUES (?, ?)
        ");
        $stmt->execute([$userId, $input['total_amount']]);
        $saleId = $pdo->lastInsertId();
        
        // Create sale items and update product quantities
        foreach ($input['items'] as $item) {
            // Add sale item
            $stmt = $pdo->prepare("
                INSERT INTO sale_items (sale_id, item_id, quantity, unit_price) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$saleId, $item['productId'], $item['qty'], $item['price']]);
            
            // Update product quantity
            $stmt = $pdo->prepare("
                UPDATE items 
                SET quantity = quantity - ? 
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([$item['qty'], $item['productId'], $userId]);
            
            // Check if update was successful
            if ($stmt->rowCount() === 0) {
                throw new Exception("Failed to update product quantity or product not found");
            }
        }
        
        $pdo->commit();
        
        sendResponse([
            'success' => true,
            'message' => 'Sale recorded successfully',
            'sale_id' => $saleId
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        sendResponse([
            'success' => false,
            'error' => 'Failed to record sale: ' . $e->getMessage()
        ], 500);
    }
}
?>