<?php
// Bülten (newsletter) abonelik uç noktası.
//
// NOT: Site "output: export" (statik) olarak derlendiği için Next.js API
// route'ları (app/api/subscribe) sunucuda hiç çalışmıyor — sadece statik
// HTML/JS/CSS dosyaları cPanel'e kopyalanıyor. Bu yüzden gerçek işi bu PHP
// dosyası yapıyor; components/NewsletterForm.tsx buraya istek atıyor.

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://drmustafakebat.com', 'https://www.drmustafakebat.com'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Sadece POST istekleri kabul edilir.']);
    exit;
}

$configFile = __DIR__ . '/subscribe-config.php';
if (!file_exists($configFile)) {
    http_response_code(503);
    echo json_encode(['error' => 'Sistem yapilandirma hatasi. Lutfen daha sonra tekrar deneyin.']);
    exit;
}
require_once $configFile;

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = trim($input['email'] ?? '');

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Gecerli bir e-posta adresi girin.']);
    exit;
}

$ch = curl_init('https://connect.mailerlite.com/api/subscribers');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => 'POST',
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . MAILERLITE_API_KEY,
    ],
    CURLOPT_POSTFIELDS => json_encode(['email' => $email, 'status' => 'active']),
    CURLOPT_TIMEOUT    => 15,
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($body === false) {
    http_response_code(502);
    echo json_encode(['error' => 'MailerLite\'a baglanilamadi: ' . $err]);
    exit;
}

if ($code < 200 || $code >= 300) {
    $data = json_decode($body, true);
    http_response_code($code);
    echo json_encode(['error' => $data['message'] ?? 'Abonelik islemi basarisiz oldu. Lutfen daha sonra tekrar deneyin.']);
    exit;
}

echo json_encode(['success' => true]);
