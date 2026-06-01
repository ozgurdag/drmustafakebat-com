<?php
header('Content-Type: application/json; charset=utf-8');

$configFile = __DIR__ . '/proxy-config.php';
if (!file_exists($configFile)) {
    http_response_code(503);
    echo json_encode(['error' => 'proxy-config.php bulunamadi.']);
    exit;
}
require_once $configFile;

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://drmustafakebat.com', 'https://www.drmustafakebat.com'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_secure', '1');
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', '1');
ini_set('session.gc_maxlifetime', 86400);

// Özel session dizini (cPanel ortak temizlik aracının oturumu silmesini engeller)
$sessDir = __DIR__ . '/sessions';
if (!file_exists($sessDir)) {
    mkdir($sessDir, 0700, true);
    file_put_contents($sessDir . '/.htaccess', "Deny from all\n");
}
session_save_path($sessDir);

session_set_cookie_params(['lifetime' => 86400, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
session_start();

$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

function isLocked(): bool {
    if (!isset($_SESSION['lockout_until'])) return false;
    if ($_SESSION['lockout_until'] > time()) return true;
    unset($_SESSION['lockout_until'], $_SESSION['login_attempts']);
    return false;
}
function remainingSec(): int { return max(0, ($_SESSION['lockout_until'] ?? 0) - time()); }
function recordFail(): void {
    $_SESSION['login_attempts'] = ($_SESSION['login_attempts'] ?? 0) + 1;
    if ($_SESSION['login_attempts'] >= 3) $_SESSION['lockout_until'] = time() + 900;
}
function clearAttempts(): void { unset($_SESSION['login_attempts'], $_SESSION['lockout_until']); }

function gh(string $url, string $method = 'GET', ?array $body = null): array {
    $ch = curl_init($url);
    $headers = [
        'Authorization: Bearer ' . GITHUB_PAT,
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: drmustafakebat-proxy/1.0',
    ];
    if ($body !== null) $headers[] = 'Content-Type: application/json';
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $headers, CURLOPT_TIMEOUT => 30]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'body' => $resp];
}

function validPath(string $p): bool {
    return (bool) preg_match('#^content/articles/[a-z]+/[a-zA-Z0-9_-]+\.mdx$#', $p);
}

$base = 'https://api.github.com/repos/' . GITHUB_OWNER . '/' . GITHUB_REPO;

if ($action === 'login') {
    if (isLocked()) { http_response_code(429); echo json_encode(['error' => 'too_many_attempts', 'remaining_seconds' => remainingSec()]); exit; }
    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';
    if ($username === ADMIN_USER && hash('sha256', $password) === ADMIN_PASS_HASH) {
        clearAttempts();
        session_regenerate_id(true);
        $_SESSION['authenticated'] = true;
        $_SESSION['auth_time'] = time();
        echo json_encode(['ok' => true]);
    } else {
        recordFail();
        $attempts = $_SESSION['login_attempts'] ?? 0;
        if ($attempts >= 3) { http_response_code(429); echo json_encode(['error' => 'too_many_attempts', 'remaining_seconds' => remainingSec()]); }
        else { http_response_code(401); echo json_encode(['error' => 'invalid_credentials', 'remaining_attempts' => 3 - $attempts]); }
    }
    exit;
}
if ($action === 'logout') { session_destroy(); echo json_encode(['ok' => true]); exit; }
if ($action === 'check') { echo json_encode(['ok' => !empty($_SESSION['authenticated'])]); exit; }

if (empty($_SESSION['authenticated'])) { http_response_code(401); echo json_encode(['error' => 'unauthorized']); exit; }

if ($action === 'list_files') {
    $cat = $_GET['category'] ?? '';
    if (!preg_match('/^[a-z]+$/', $cat)) { http_response_code(400); echo json_encode(['error' => 'invalid_category']); exit; }
    $r = gh("$base/contents/content/articles/$cat?ref=main");
    http_response_code($r['code']); echo $r['body']; exit;
}
if ($action === 'get_file') {
    $path = $_GET['path'] ?? '';
    if (!validPath($path)) { http_response_code(400); echo json_encode(['error' => 'invalid_path']); exit; }
    $r = gh("$base/contents/$path?ref=main");
    http_response_code($r['code']); echo $r['body']; exit;
}
if ($action === 'put_file') {
    $path = $input['path'] ?? '';
    $payload = $input['payload'] ?? [];
    if (!validPath($path)) { http_response_code(400); echo json_encode(['error' => 'invalid_path']); exit; }
    $r = gh("$base/contents/$path", 'PUT', $payload);
    http_response_code($r['code']); echo $r['body']; exit;
}
if ($action === 'delete_file') {
    $path = $input['path'] ?? '';
    $payload = $input['payload'] ?? [];
    if (!validPath($path)) { http_response_code(400); echo json_encode(['error' => 'invalid_path']); exit; }
    $r = gh("$base/contents/$path", 'DELETE', $payload);
    http_response_code($r['code']); echo $r['body']; exit;
}
if ($action === 'get_runs') {
    $r = gh("$base/actions/runs?per_page=1&branch=main");
    http_response_code($r['code']); echo $r['body']; exit;
}

http_response_code(400);
echo json_encode(['error' => 'unknown_action']);
