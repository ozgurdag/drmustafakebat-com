<?php
// Custom GitHub Webhook for cPanel Git Version Control
// This script allows GitHub to trigger a pull and deploy on Turhost

$secret = 'drmustafa_deploy_secret_2026';

// Güvenlik kontrolü
if (!isset($_GET['token']) || $_GET['token'] !== $secret) {
    http_response_code(403);
    die('Yetkisiz erisim. - Unauthorized.');
}

// cPanel ekranında yazan birebir Repository Path
$repo_path = '/home/drmust11//home/drmust11/deploy_repo';

// 1. Depoyu Güncelle (GitHub'dan son dosyaları çek)
$update_cmd = "uapi VersionControl update_repository repository_root='{$repo_path}' 2>&1";
$update_result = shell_exec($update_cmd);

// 2. Deployment'ı Başlat (.cpanel.yml içindeki kopyalama talimatını çalıştır)
$deploy_cmd = "uapi VersionControl start_deployment repository_root='{$repo_path}' 2>&1";
$deploy_result = shell_exec($deploy_cmd);

// Yedek plan: Eğer .cpanel.yml çalışmazsa diye dosyaları elle kopyala
shell_exec("cp -R {$repo_path}/* /home/drmust11/public_html/ 2>&1");

// GitHub'a yanıt dön
header('Content-Type: text/plain');
echo "Deployment Triggered Successfully!\n\n";
echo "--- Update Phase ---\n$update_result\n\n";
echo "--- Deploy Phase ---\n$deploy_result\n";
?>
