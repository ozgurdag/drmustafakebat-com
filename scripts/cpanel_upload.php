<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Güvenlik anahtarı - Admin panelinizden gönderilecek olanla eşleşmeli
$AUTH_KEY = "dr-mustafa-kebat-v1-secret"; 

if (!isset($_POST['auth_key']) || $_POST['auth_key'] !== $AUTH_KEY) {
    http_response_code(403);
    echo json_encode(["error" => "Yetkisiz erişim"]);
    exit;
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(["error" => "Görsel yüklenemedi"]);
    exit;
}

$target_dir = "../images/uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
$new_filename = uniqid() . "." . $file_extension;
$target_file = $target_dir . $new_filename;

// Sadece görsel dosyalarına izin ver
$allowed_types = ["jpg", "jpeg", "png", "webp", "gif"];
if (!in_array($file_extension, $allowed_types)) {
    echo json_encode(["error" => "Sadece JPG, PNG, WEBP ve GIF formatları desteklenir."]);
    exit;
}

if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
    echo json_encode([
        "success" => true,
        "url" => "https://drmustafakebat.com/images/uploads/" . $new_filename
    ]);
} else {
    echo json_encode(["error" => "Dosya sunucuya kaydedilirken hata oluştu."]);
}
?>
