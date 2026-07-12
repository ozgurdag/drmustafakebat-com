<?php
// Bu dosyayı deploy-config.php olarak kaydedin ve değerleri doldurun.
// deploy-config.php asla git'e gitmez, sunucuya bir kez elle yüklenir.

// GitHub webhook URL'sindeki ?token= değeriyle birebir aynı olmalı.
// Rastgele/uzun bir değer üretin, örn: bin2hex(random_bytes(32))
define('DEPLOY_SECRET', 'BURAYA_UZUN_RASTGELE_BIR_DEGER_YAZIN');

// cPanel > Git Version Control ekranındaki "Repository Path" alanında ne
// yazıyorsa BİREBİR onu kullanın — bazı cPanel hesaplarında ev dizini iki kez
// tekrar eder (ör. /home/kullanici//home/kullanici/deploy_repo). Bu normal bir
// cPanel/CageFS görünümüdür, "düzeltmeyin".
define('DEPLOY_REPO_PATH', '/home/kullanici//home/kullanici/deploy_repo');

// public_html'in tam yolu (derlenmiş statik sitenin kopyalanacağı hedef)
define('DEPLOY_TARGET_PATH', '/home/kullanici/public_html');

// GitHub Actions'ın derlenmiş siteyi push ettiği dal (bkz. .github/workflows/deploy.yml -> publish_branch)
define('DEPLOY_BRANCH', 'production');

// Bazı sunucularda shell_exec/escapeshellarg kapalı olur (disable_functions).
// Bu yüzden "uapi" komutu shell yerine cPanel'in HTTP tabanlı UAPI'siyle
// (curl) çağrılıyor. cPanel > Security > Manage API Tokens > Create Token
// ile bir "unrestricted" token oluşturup buraya yapıştırın.
define('DEPLOY_CPANEL_HOST', 'siteniz.com');
define('DEPLOY_CPANEL_USER', 'cpanel_kullanici_adiniz');
define('DEPLOY_CPANEL_API_TOKEN', 'CPANEL_API_TOKENINIZ');
