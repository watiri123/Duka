<?php
require_once '../config/database.php';
require_once '../includes/auth.php';

$userId = requireAuth(); // Ensures user is logged in

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return all user's items
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new item
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Update existing item
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete item
}
?>