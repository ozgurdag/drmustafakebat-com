<?php
// Custom GitHub Webhook for cPanel Git Version Control
//
// NOT: Bu sunucuda shell_exec/escapeshellarg (ve exec, system, popen,
// proc_open) disable_functions ile kapatılmış. Bu yüzden "uapi" komutunu
// shell'e değil, cPanel'in HTTP tabanlı UAPI'sine curl ile çağırıyoruz;
// dosya kopyalama için de cp -R yerine saf PHP fonksiyonları kullanıyoruz.

header('Content-Type: text/plain; charset=utf-8');
@set_time_limit(60);

$configFile = __DIR__ . '/deploy-config.php';
if (!file_exists($configFile)) {
    http_response_code(503);
    echo "deploy-config.php bulunamadi. Once bu dosyayi sunucuya elle yukleyin.\n";
    exit;
}
require_once $configFile;

// Güvenlik kontrolü — timing-safe karşılaştırma
$token = $_GET['token'] ?? '';
if (!is_string($token) || !hash_equals(DEPLOY_SECRET, $token)) {
    http_response_code(403);
    die('Yetkisiz erisim. - Unauthorized.');
}

// GitHub webhook'u her push'ta (main dahil) tetiklenir. Sadece asil site
// icerigini tasiyan DEPLOY_BRANCH (production) push'landiginda calismali;
// diger dallara push'ta hicbir sey yapmadan erken cikalim (200 dondururuz ki
// GitHub bunu "basarisiz teslimat" olarak isaretlemesin). Manuel tarayici
// testlerinde (govde/body yok) bu kontrol atlanir, script normal calisir.
$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody, true);
if (is_array($payload) && isset($payload['ref'])) {
    $expectedRef = 'refs/heads/' . DEPLOY_BRANCH;
    if ($payload['ref'] !== $expectedRef) {
        http_response_code(200);
        echo "Ilgisiz dal push edildi ({$payload['ref']}), atlandi.\n";
        exit;
    }
}

$repo_path   = DEPLOY_REPO_PATH;
$target_path = DEPLOY_TARGET_PATH;

/**
 * cPanel UAPI'yi shell yerine HTTPS üzerinden (curl) çağırır.
 * Belgeler: https://api.docs.cpanel.net/openapi/cpanel/ (UAPI over HTTP)
 */
function cpanelApi(string $module, string $function, array $params = []): array {
    $url = 'https://' . DEPLOY_CPANEL_HOST . ':2083/execute/' . $module . '/' . $function;
    if ($params) $url .= '?' . http_build_query($params);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Authorization: cpanel ' . DEPLOY_CPANEL_USER . ':' . DEPLOY_CPANEL_API_TOKEN],
        CURLOPT_CONNECTTIMEOUT => 8,   // baglanti kurulamazsa hemen vazgec (asili kalmasin)
        CURLOPT_TIMEOUT        => 15,
    ]);
    $body = curl_exec($ch);
    $err  = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body === false) {
        return ['ok' => false, 'code' => 0, 'body' => "curl hatasi: $err"];
    }
    return ['ok' => $code >= 200 && $code < 300, 'code' => $code, 'body' => $body];
}

/**
 * cp -R yerine: repo_path kökünü target_path'e saf PHP ile kopyalar.
 * Gizli dosyaları (.git dahil, "." ile başlayan her şeyi) atlar — eskiden
 * shell'deki "*" joker karakterinin yaptığı ile aynı davranış.
 */
function recursiveCopy(string $src, string $dst): array {
    $errors = [];
    if (!is_dir($dst) && !@mkdir($dst, 0755, true) && !is_dir($dst)) {
        return ["HATA: hedef klasor olusturulamadi: $dst"];
    }
    $items = @scandir($src);
    if ($items === false) {
        return ["HATA: kaynak klasor okunamadi: $src"];
    }
    foreach ($items as $item) {
        if ($item === '.' || $item === '..' || $item[0] === '.') continue; // gizli dosya/klasor atla
        $srcPath = $src . '/' . $item;
        $dstPath = $dst . '/' . $item;
        if (is_dir($srcPath)) {
            $errors = array_merge($errors, recursiveCopy($srcPath, $dstPath));
        } elseif (!@copy($srcPath, $dstPath)) {
            $errors[] = "Kopyalanamadi: $srcPath -> $dstPath";
        }
    }
    return $errors;
}

// 1. Depoyu Güncelle (GitHub'dan son dosyaları çek) — doğru UAPI fonksiyonu
// "VersionControl/update_repository" değil, "VersionControl/update" ve
// "branch" parametresi zorunlu (bkz. pinkasey/cpanel-deploy-action kaynağı).
$update = cpanelApi('VersionControl', 'update', [
    'repository_root' => $repo_path,
    'branch'          => DEPLOY_BRANCH,
]);

// 2. Deployment'ı Başlat — bu da "VersionControl" değil ayrı bir modül:
// "VersionControlDeployment/create". Bir task_id döner, kısa süre pollarız.
$deploy = cpanelApi('VersionControlDeployment', 'create', ['repository_root' => $repo_path]);

// Not: Burada bilerek uzun bir polling döngüsü YOK — sunucunun PHP çalışma
// süresi sınırını (max_execution_time) aşıp 500 vermesine neden oluyordu.
// Sonucunu beklemiyoruz; asagidaki saf PHP kopyalama zaten kendi basina
// dosyalari guncel tutmaya yetiyor.
$deployData = json_decode($deploy['body'], true);
$deployStatus = ($deployData['status'] ?? 0) == 1
    ? "Deployment tetiklendi (status: basarili)."
    : ("Deployment yaniti belirsiz/hata: " . $deploy['body']);

// 3. Yedek plan: .cpanel.yml çalışmazsa diye dosyaları saf PHP ile kopyala.
$fallback_result = '';
if (is_dir($repo_path)) {
    $copyErrors = recursiveCopy(rtrim($repo_path, '/'), rtrim($target_path, '/'));
    $fallback_result = $copyErrors ? implode("\n", $copyErrors) : "OK - hatasiz kopyalandi.";
} else {
    $fallback_result = "UYARI: {$repo_path} bulunamadi, yedek kopyalama adimi atlandi.\n";
}

// GitHub'a yanıt dön
echo "Deployment Triggered Successfully!\n\n";
echo "--- Update Phase (HTTP $update[code]) ---\n{$update['body']}\n\n";
echo "--- Deploy Phase (HTTP $deploy[code]) ---\n{$deploy['body']}\n";
echo "--- Deploy Status ---\n$deployStatus\n\n";
echo "--- Fallback Copy ---\n$fallback_result\n";
