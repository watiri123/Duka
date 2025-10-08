<?php
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getRequestBody() {
    $input = json_decode(file_get_contents('php://input'), true);
    return $input ?? [];
}

function validateRequiredFields($data, $requiredFields) {
    $errors = [];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            $errors[] = "Field '$field' is required";
        }
    }
    return $errors;
}

function formatCurrency($amount) {
    return 'KES ' . number_format($amount, 2);
}

function formatDate($dateString) {
    return date('M j, Y g:i A', strtotime($dateString));
}

function calculateTotal($items) {
    $total = 0;
    foreach ($items as $item) {
        $total += $item['quantity'] * $item['price'];
    }
    return $total;
}
?>