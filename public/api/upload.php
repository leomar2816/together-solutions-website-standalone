<?php
// Admin image upload, replacing Base44's Core.UploadFile. Files land in /uploads/YYYY/MM/.
declare(strict_types=1);
if (!defined('TSW_API')) { http_response_code(404); exit; }

const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
const UPLOAD_TYPES = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/webp' => 'webp', 'image/gif' => 'gif', 'image/svg+xml' => 'svg'];

function handle_upload(): void
{
    $file = $_FILES['file'] ?? null;
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) fail(400, 'No file uploaded');
    if ($file['size'] > UPLOAD_MAX_BYTES) fail(413, 'File is larger than 10 MB');

    // Trust the file's bytes, not the browser's claimed type or name.
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if ($mime === 'text/xml' || $mime === 'application/xml' || $mime === 'text/plain') {
        $head = file_get_contents($file['tmp_name'], false, null, 0, 1024);
        if (stripos($head, '<svg') !== false) $mime = 'image/svg+xml';
    }
    $ext = UPLOAD_TYPES[$mime] ?? null;
    if (!$ext) fail(415, 'Only PNG, JPG, WebP, GIF or SVG images are allowed');

    $sub = gmdate('Y/m');
    $dir = dirname(__DIR__) . "/uploads/$sub";
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) fail(500, 'Upload folder is not writable');
    $name = bin2hex(random_bytes(8)) . ".$ext";
    if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) fail(500, 'Could not save the file');
    chmod("$dir/$name", 0644);
    respond(['file_url' => "/uploads/$sub/$name"]);
}
