<?php
// DEPRECATED — bu dosya kaldırıldı.
//
// Bu script hardcoded bir "auth_key" ve herkese açık (wildcard) CORS ile
// çalışıyordu; public/api/upload.php ile aynı işi oturum tabanlı kimlik
// doğrulamayla ve kısıtlı CORS ile zaten güvenli şekilde yapıyor.
//
// Bu dosya sunucuda (cPanel) hâlâ mevcutsa MANUEL OLARAK SİLİN:
//   /home/<kullanici>/public_html/scripts/cpanel_upload.php (veya benzer yol)
// Eski "dr-mustafa-kebat-v1-secret" anahtarı sızmış kabul edilmeli, artık
// hiçbir işlevi kalmaması için bu dosya devre dışı bırakılmıştır.

http_response_code(410);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Bu uc nokta kaldirildi. Lutfen /api/upload.php kullanin.']);
exit;
