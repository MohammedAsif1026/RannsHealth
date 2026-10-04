$port = 3000
$path = "c:\ASIF"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $urlPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($urlPath)) {
        $urlPath = "index.html"
    }
    
    $filePath = Join-Path $path $urlPath
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".css"  { $response.ContentType = "text/css; charset=utf-8" }
            ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
            ".json" { $response.ContentType = "application/json; charset=utf-8" }
            ".png"  { $response.ContentType = "image/png" }
            ".jpg"  { $response.ContentType = "image/jpeg" }
            ".jpeg" { $response.ContentType = "image/jpeg" }
            ".svg"  { $response.ContentType = "image/svg+xml" }
            ".webm" { $response.ContentType = "video/webm" }
            ".mp4"  { $response.ContentType = "video/mp4" }
            default { $response.ContentType = "application/octet-stream" }
        }
        
        $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        $response.AddHeader("Pragma", "no-cache")
        $response.AddHeader("Expires", "0")
        $response.AddHeader("Accept-Ranges", "bytes")
        $rangeHeader = $request.Headers["Range"]
        if ($rangeHeader -and $rangeHeader -match "bytes=(\d+)-(\d*)") {
            $start = [int64]$matches[1]
            $end = if ($matches[2]) { [int64]$matches[2] } else { $content.Length - 1 }
            if ($end -ge $content.Length) { $end = $content.Length - 1 }
            $chunkLength = $end - $start + 1
            $response.StatusCode = 206
            $response.AddHeader("Content-Range", "bytes $start-$end/$($content.Length)")
            $response.ContentLength64 = $chunkLength
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($content, $start, $chunkLength)
            }
        } else {
            $response.ContentLength64 = $content.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($content, 0, $content.Length)
            }
        }
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    
    $response.OutputStream.Close()
}
