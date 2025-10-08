<?php
header('Access-Control-Allow-Origin: http://localhost:3003');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/connection.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

$userId = requireAuth();

// Get all debts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $status = $_GET['status'] ?? 'all';
        
        $query = "SELECT * FROM debts WHERE user_id = ?";
        $params = [$userId];
        
        if ($status !== 'all') {
            $query .= " AND status = ?";
            $params[] = $status;
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $debts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse([
            'success' => true,
            'data' => $debts
        ]);
        
    } catch (PDOException $e) {
        sendResponse([
            'success' => false,
            'error' => 'Failed to fetch debts: ' . $e->getMessage()
        ], 500);
    }
}

// Create new debt
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getRequestBody();
    
    $errors = validateRequiredFields($input, ['customer_name', 'amount']);
    if (!empty($errors)) {
        sendResponse([
            'success' => false,
            'error' => 'Validation failed',
            'details' => $errors
        ], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO debts (user_id, customer_name, customer_phone, amount, description, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $userId,
            $input['customer_name'],
            $input['customer_phone'] ?? '',
            $input['amount'],
            $input['description'] ?? '',
            $input['status'] ?? 'pending'
        ]);
        
        $debtId = $pdo->lastInsertId();
        
        sendResponse([
            'success' => true,
            'message' => 'Debt record created successfully',
            'debt_id' => $debtId
        ]);
        
    } catch (PDOException $e) {
        sendResponse([
            'success' => false,
            'error' => 'Failed to create debt record: ' . $e->getMessage()
        ], 500);
    }
}

// Update debt (mark as paid, etc.)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = getRequestBody();
    $debtId = $_GET['id'] ?? null;
    
    if (!$debtId) {
        sendResponse([
            'success' => false,
            'error' => 'Debt ID is required'
        ], 400);
    }
    
    // Verify ownership
    $stmt = $pdo->prepare("SELECT user_id FROM debts WHERE id = ?");
    $stmt->execute([$debtId]);
    $debt = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$debt || $debt['user_id'] != $userId) {
        sendResponse([
            'success' => false,
            'error' => 'Debt record not found or access denied'
        ], 404);
    }
    
    try {
        $allowedFields = ['customer_name', 'customer_phone', 'amount', 'description', 'status'];
        $updates = [];
        $params = [];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updates[] = "$field = ?";
                $params[] = $input[$field];
            }
        }
        
        if (empty($updates)) {
            sendResponse([
                'success' => false,
                'error' => 'No valid fields to update'
            ], 400);
        }
        
        $params[] = $debtId;
        $params[] = $userId;
        
        $stmt = $pdo->prepare("
            UPDATE debts 
            SET " . implode(', ', $updates) . " 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute($params);
        
        sendResponse([
            'success' => true,
            'message' => 'Debt record updated successfully'
        ]);
        
    } catch (PDOException $e) {
        sendResponse([
            'success' => false,
            'error' => 'Failed to update debt record: ' . $e->getMessage()
        ], 500);
    }
}

// Delete debt
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $debtId = $_GET['id'] ?? null;
    
    if (!$debtId) {
        sendResponse([
            'success' => false,
            'error' => 'Debt ID is required'
        ], 400);
    }
    
    // Verify ownership
    $stmt = $pdo->prepare("SELECT user_id FROM debts WHERE id = ?");
    $stmt->execute([$debtId]);
    $debt = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$debt || $debt['user_id'] != $userId) {
        sendResponse([
            'success' => false,
            'error' => 'Debt record not found or access denied'
        ], 404);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM debts WHERE id = ? AND user_id = ?");
        $stmt->execute([$debtId, $userId]);
        
        sendResponse([
            'success' => true,
            'message' => 'Debt record deleted successfully'
        ]);
        
    } catch (PDOException $e) {
        sendResponse([
            'success' => false,
            'error' => 'Failed to delete debt record: ' . $e->getMessage()
        ], 500);
    }
}
?>