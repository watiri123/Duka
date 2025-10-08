<?php
header('Access-Control-Allow-Origin: http://localhost:3003');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/connection.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

$userId = requireAuth();

try {
    // Get dashboard statistics
    $stats = [];
    
    // Total products
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM items WHERE user_id = ?");
    $stmt->execute([$userId]);
    $stats['totalProducts'] = $stmt->fetchColumn();
    
    // Total sales today
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM sales 
        WHERE user_id = ? AND DATE(sale_date) = CURDATE()
    ");
    $stmt->execute([$userId]);
    $stats['todaySales'] = $stmt->fetchColumn();
    
    // Total sales amount today
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(total_amount), 0) as total 
        FROM sales 
        WHERE user_id = ? AND DATE(sale_date) = CURDATE()
    ");
    $stmt->execute([$userId]);
    $stats['todayRevenue'] = (float)$stmt->fetchColumn();
    
    // Pending debts
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total 
        FROM debts 
        WHERE user_id = ? AND status = 'pending'
    ");
    $stmt->execute([$userId]);
    $debtResult = $stmt->fetch(PDO::FETCH_ASSOC);
    $stats['pendingDebts'] = $debtResult['count'];
    $stats['totalDebts'] = (float)$debtResult['total'];
    
    // Low stock items (quantity < 10)
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM items 
        WHERE user_id = ? AND quantity < 10
    ");
    $stmt->execute([$userId]);
    $stats['lowStockItems'] = $stmt->fetchColumn();
    
    // Recent sales (last 5)
    $stmt = $pdo->prepare("
        SELECT s.*, COUNT(si.id) as items_count
        FROM sales s 
        LEFT JOIN sale_items si ON s.id = si.sale_id
        WHERE s.user_id = ? 
        GROUP BY s.id 
        ORDER BY s.sale_date DESC 
        LIMIT 5
    ");
    $stmt->execute([$userId]);
    $stats['recentSales'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse([
        'success' => true,
        'data' => $stats
    ]);
    
} catch (PDOException $e) {
    sendResponse([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ], 500);
}
?>