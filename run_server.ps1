$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = (Get-Location).Path }
$listener = [System.Net.HttpListener]::new();
$listener.Prefixes.Add('http://localhost:8000/');
$listener.Start();
Write-Host 'Server started at http://localhost:8000';

function SerializeChatSessions($sessions) {
    if ($null -eq $sessions) { return "[]" }
    $arr = @($sessions)
    if ($arr.Count -eq 0) { return "[]" }
    if ($arr.Count -eq 1) { return (ConvertTo-Json -InputObject @(,$arr[0]) -Depth 10) }
    return (ConvertTo-Json -InputObject $arr -Depth 10)
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext();
        $request = $context.Request;
        $response = $context.Response;
        
        # Disable Keep-Alive to prevent connection hangs in our single-threaded loop
        $response.KeepAlive = $false;
        
        # Add Cache-Control headers to completely disable browser caching of assets
        $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        $response.Headers.Add("Pragma", "no-cache");
        $response.Headers.Add("Expires", "0");
        $response.Headers.Add("Access-Control-Allow-Origin", "*");
        
        $localPath = $request.Url.LocalPath;
        
        # Handle POST request to save database to assets/db.json
        if ($request.HttpMethod -eq 'POST' -and $localPath -eq '/api/save') {
            $reader = [System.IO.StreamReader]::new($request.InputStream, [System.Text.Encoding]::UTF8);
            $body = $reader.ReadToEnd();
            $dbPath = Join-Path $baseDir 'assets\db.json';
            [System.IO.File]::WriteAllText($dbPath, $body, [System.Text.Encoding]::UTF8);
            
            $response.StatusCode = 200;
            $response.ContentType = 'application/json';
            $responseBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status": "success"}');
            $response.ContentLength64 = $responseBytes.Length;
            $response.OutputStream.Write($responseBytes, 0, $responseBytes.Length);
            $response.Close();
            Write-Host "Request: POST /api/save -> Saved database to assets/db.json successfully!";
            continue;
        }

        # Handle POST request to upload image/video
        if ($request.HttpMethod -eq 'POST' -and $localPath -eq '/api/upload') {
            $fileName = $request.Headers["X-File-Name"];
            if ([string]::IsNullOrEmpty($fileName)) {
                $fileName = "upload_" + [Guid]::NewGuid().ToString() + ".bin";
            }
            # Clean filename to avoid path traversal
            $fileName = [System.IO.Path]::GetFileName($fileName);
            
            $uploadsDir = Join-Path $baseDir 'assets\uploads';
            if (-not (Test-Path $uploadsDir)) {
                [System.IO.Directory]::CreateDirectory($uploadsDir) | Out-Null;
            }
            
            $targetPath = Join-Path $uploadsDir $fileName;
            
            # Read input stream directly and save to file
            $fileStream = [System.IO.File]::Create($targetPath);
            $request.InputStream.CopyTo($fileStream);
            $fileStream.Close();
            
            $response.StatusCode = 200;
            $response.ContentType = 'application/json';
            $responseBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status": "success", "url": "/assets/uploads/' + $fileName + '"}');
            $response.ContentLength64 = $responseBytes.Length;
            $response.OutputStream.Write($responseBytes, 0, $responseBytes.Length);
            $response.Close();
            Write-Host "Request: POST /api/upload -> Saved upload to assets/uploads/$fileName successfully!";
            continue;
        }

        # Handle GET /api/chat
        if ($request.HttpMethod -eq 'GET' -and $localPath -eq '/api/chat') {
            $chatFile = Join-Path $baseDir 'assets\chat_sessions.json';
            $chatJson = "[]";
            if (Test-Path $chatFile) {
                $chatJson = [System.IO.File]::ReadAllText($chatFile, [System.Text.Encoding]::UTF8);
                if ([string]::IsNullOrWhiteSpace($chatJson)) { $chatJson = "[]"; }
            }
            $response.StatusCode = 200;
            $response.ContentType = 'application/json; charset=utf-8';
            $responseBytes = [System.Text.Encoding]::UTF8.GetBytes($chatJson);
            $response.ContentLength64 = $responseBytes.Length;
            $response.OutputStream.Write($responseBytes, 0, $responseBytes.Length);
            $response.Close();
            continue;
        }

        # Handle POST /api/chat
        if ($request.HttpMethod -eq 'POST' -and $localPath -eq '/api/chat') {
            $reader = [System.IO.StreamReader]::new($request.InputStream, [System.Text.Encoding]::UTF8);
            $body = $reader.ReadToEnd();
            $chatFile = Join-Path $baseDir 'assets\chat_sessions.json';
            
            $existingJson = "[]";
            if (Test-Path $chatFile) {
                $existingJson = [System.IO.File]::ReadAllText($chatFile, [System.Text.Encoding]::UTF8);
                if ([string]::IsNullOrWhiteSpace($existingJson)) { $existingJson = "[]"; }
            }
            
            $payload = $null;
            try {
                $payload = ConvertFrom-Json $body;
            } catch {
                Write-Host "Chat JSON parse error: $_";
            }
            
            if ($null -ne $payload) {
                if ($payload -is [System.Array]) {
                    [System.IO.File]::WriteAllText($chatFile, $body, [System.Text.Encoding]::UTF8);
                } elseif ($payload.action -eq 'save_all' -and $null -ne $payload.sessions) {
                    $jsonToSave = SerializeChatSessions $payload.sessions;
                    [System.IO.File]::WriteAllText($chatFile, $jsonToSave, [System.Text.Encoding]::UTF8);
                } elseif ($payload.action -eq 'customer_message') {
                    $sessions = @();
                    try {
                        $parsed = ConvertFrom-Json $existingJson;
                        if ($null -ne $parsed) { $sessions = @($parsed); }
                    } catch {}
                    
                    $target = $sessions | Where-Object { $_.id -eq $payload.sessionId } | Select-Object -First 1;
                    $now = [System.DateTime]::UtcNow.ToString("o");
                    
                    if ($null -eq $target) {
                        $cName = if ($payload.customerName) { $payload.customerName } else { "Visitor" };
                        $cEmail = if ($payload.customerEmail) { $payload.customerEmail } else { "" };
                        $newMessages = @([PSCustomObject]@{
                            text = $payload.message;
                            sender = "customer";
                            timestamp = $now;
                        });
                        $target = [PSCustomObject]@{
                            id = $payload.sessionId;
                            customerName = $cName;
                            customerEmail = $cEmail;
                            createdAt = $now;
                            updatedAt = $now;
                            unreadByAdmin = $true;
                            unreadByVisitor = $false;
                            lastMessage = $payload.message;
                            messages = $newMessages;
                        };
                        $sessions = @($target) + @($sessions);
                    } else {
                        $currMsgs = @();
                        if ($null -ne $target.messages) { $currMsgs = @($target.messages); }
                        $currMsgs = $currMsgs + @([PSCustomObject]@{
                            text = $payload.message;
                            sender = "customer";
                            timestamp = $now;
                        });
                        $target.messages = $currMsgs;
                        $target.updatedAt = $now;
                        $target.lastMessage = $payload.message;
                        $target.unreadByAdmin = $true;
                        $target.unreadByVisitor = $false;
                        if ($payload.customerName) { $target.customerName = $payload.customerName; }
                        if ($payload.customerEmail) { $target.customerEmail = $payload.customerEmail; }
                    }
                    
                    $outJson = SerializeChatSessions $sessions;
                    [System.IO.File]::WriteAllText($chatFile, $outJson, [System.Text.Encoding]::UTF8);
                } elseif ($payload.action -eq 'admin_reply') {
                    $sessions = @();
                    try {
                        $parsed = ConvertFrom-Json $existingJson;
                        if ($null -ne $parsed) { $sessions = @($parsed); }
                    } catch {}
                    
                    $target = $sessions | Where-Object { $_.id -eq $payload.sessionId } | Select-Object -First 1;
                    $now = [System.DateTime]::UtcNow.ToString("o");
                    
                    if ($null -ne $target) {
                        $currMsgs = @();
                        if ($null -ne $target.messages) { $currMsgs = @($target.messages); }
                        $currMsgs = $currMsgs + @([PSCustomObject]@{
                            text = $payload.message;
                            sender = "admin";
                            timestamp = $now;
                        });
                        $target.messages = $currMsgs;
                        $target.updatedAt = $now;
                        $target.lastMessage = $payload.message;
                        $target.unreadByAdmin = $false;
                        $target.unreadByVisitor = $true;
                        
                        $outJson = SerializeChatSessions $sessions;
                        [System.IO.File]::WriteAllText($chatFile, $outJson, [System.Text.Encoding]::UTF8);
                    }
                } elseif ($payload.action -eq 'mark_read') {
                    $sessions = @();
                    try {
                        $parsed = ConvertFrom-Json $existingJson;
                        if ($null -ne $parsed) { $sessions = @($parsed); }
                    } catch {}
                    $target = $sessions | Where-Object { $_.id -eq $payload.sessionId } | Select-Object -First 1;
                    if ($null -ne $target) {
                        $target.unreadByAdmin = $false;
                        $outJson = SerializeChatSessions $sessions;
                        [System.IO.File]::WriteAllText($chatFile, $outJson, [System.Text.Encoding]::UTF8);
                    }
                } elseif ($payload.action -eq 'delete_session') {
                    $sessions = @();
                    try {
                        $parsed = ConvertFrom-Json $existingJson;
                        if ($null -ne $parsed) { $sessions = @($parsed); }
                    } catch {}
                    $sessions = @($sessions | Where-Object { $_.id -ne $payload.sessionId });
                    $outJson = SerializeChatSessions $sessions;
                    [System.IO.File]::WriteAllText($chatFile, $outJson, [System.Text.Encoding]::UTF8);
                } elseif ($payload.action -eq 'clear_all') {
                    [System.IO.File]::WriteAllText($chatFile, "[]", [System.Text.Encoding]::UTF8);
                }
            }
            
            $finalJson = [System.IO.File]::ReadAllText($chatFile, [System.Text.Encoding]::UTF8);
            $response.StatusCode = 200;
            $response.ContentType = 'application/json; charset=utf-8';
            $responseBytes = [System.Text.Encoding]::UTF8.GetBytes($finalJson);
            $response.ContentLength64 = $responseBytes.Length;
            $response.OutputStream.Write($responseBytes, 0, $responseBytes.Length);
            $response.Close();
            continue;
        }
        
        if ($localPath -eq '/') { $localPath = '/index.html' };
        $filePath = Join-Path $baseDir $localPath.TrimStart('/');
        $status = 200;
        
        if ($localPath -eq '/admin' -or $localPath -eq '/admin/') {
            $filePath = Join-Path $baseDir 'admin.html'
        } elseif ($localPath -eq '/login' -or $localPath -eq '/login/') {
            $filePath = Join-Path $baseDir 'login.html'
        } elseif (-not (Test-Path $filePath)) {
            if ($localPath -notlike '*.*') {
                $filePath = Join-Path $baseDir 'index.html'
            }
        };
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath);
            $ext = [System.IO.Path]::GetExtension($filePath);
            $mime = switch($ext) {
                '.html' {'text/html'}
                '.css' {'text/css'}
                '.js' {'application/javascript'}
                '.json' {'application/json'}
                '.png' {'image/png'}
                '.jpg' {'image/jpeg'}
                '.jpeg' {'image/jpeg'}
                '.gif' {'image/gif'}
                '.webp' {'image/webp'}
                '.mp4' {'video/mp4'}
                '.webm' {'video/webm'}
                '.svg' {'image/svg+xml'}
                '.pdf' {'application/pdf'}
                '.txt' {'text/plain'}
                '.xml' {'application/xml'}
                default {'application/octet-stream'}
            };
            $response.ContentType = $mime;
            if ($ext -eq '.json' -or $ext -eq '.html' -or $ext -eq '.js' -or $ext -eq '.css') {
                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
            }
            $response.ContentLength64 = $content.Length;
            $response.OutputStream.Write($content, 0, $content.Length);
        } else {
            $status = 404;
            $response.StatusCode = 404;
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found");
            $response.ContentLength64 = $notFoundBytes.Length;
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length);
        };
        
        Write-Host "Request: $($request.HttpMethod) $($request.Url.PathAndQuery) -> Status $status";
        $response.Close();
    } catch {
        Write-Host "Error handling request: $_";
        if ($null -ne $response) {
            try { $response.Close() } catch {}
        }
    }
}
