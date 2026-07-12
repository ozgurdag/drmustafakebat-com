<?php
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://drmustafakebat.com', 'https://www.drmustafakebat.com'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// Özel session dizini (proxy.php ile aynı)
$sessDir = __DIR__ . '/sessions';
if (!file_exists($sessDir)) {
    mkdir($sessDir, 0700, true);
    file_put_contents($sessDir . '/.htaccess', "Deny from all\n");
}

ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_secure', '1');
ini_set('session.cookie_samesite', 'Strict');
session_save_path($sessDir);
session_start();
session_write_close(); // Oturum kilidini hemen serbest bırak

if (empty($_SESSION['authenticated'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Yetkisiz erişim. Lütfen önce giriş yapın.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Sadece POST istekleri kabul edilir.']);
    exit;
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Yüklenecek görsel bulunamadı.']);
    exit;
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Dosya yükleme hatası oluştu (Hata kodu: ' . $file['error'] . ')']);
    exit;
}

// 5MB limit
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'Dosya boyutu çok büyük (Maksimum 5MB)']);
    exit;
}

$file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed_types = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
if (!in_array($file_extension, $allowed_types, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Sadece JPG, JPEG, PNG, WEBP ve GIF formatları desteklenir.']);
    exit;
}

$target_dir = $_SERVER['DOCUMENT_ROOT'] . '/images/uploads/';
if (!file_exists($target_dir)) {
    if (!mkdir($target_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Yükleme dizini oluşturulamadı.']);
        exit;
    }
}

// Benzersiz dosya ismi oluştur
$new_filename = uniqid('img_', true) . '.' . $file_extension;
$target_file = $target_dir . $new_filename;

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    echo json_encode([
        'success' => true,
        'url' => '/images/uploads/' . $new_filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Dosya sunucuya kaydedilirken hata oluştu. Lütfen klasör izinlerini kontrol edin.']);
}
