Add-Type -AssemblyName System.Drawing

$logoPath = "public/images/mine-skills-logo.png"
$bytes = [System.IO.File]::ReadAllBytes($logoPath)
$ms = [System.IO.MemoryStream]::new($bytes)
$src = [System.Drawing.Bitmap]::new($ms)

$srcRect = [System.Drawing.Rectangle]::new(190, 74, 654, 502)

function CreateIcon($srcImg, $srcR, $canvasSize, $contentSize, $outputPath) {
    $bmp = [System.Drawing.Bitmap]::new($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $targetH = [int]($srcR.Height * ($contentSize / [double]$srcR.Width))
    $targetX = [int](($canvasSize - $contentSize) / 2)
    $targetY = [int](($canvasSize - $targetH) / 2)

    $destRect = [System.Drawing.Rectangle]::new($targetX, $targetY, $contentSize, $targetH)
    $g.DrawImage($srcImg, $destRect, $srcR, [System.Drawing.GraphicsUnit]::Pixel)

    $fs = [System.IO.FileStream]::new($outputPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
    $bmp.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
    $fs.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

CreateIcon $src $srcRect 512 420 "public/pwa-512x512.png"
CreateIcon $src $srcRect 192 156 "public/pwa-192x192.png"
CreateIcon $src $srcRect 512 360 "public/pwa-maskable-512x512.png"
CreateIcon $src $srcRect 180 146 "public/apple-touch-icon.png"
CreateIcon $src $srcRect 64 52 "public/favicon.png"

$src.Dispose()
$ms.Dispose()

Write-Host "All PWA icons successfully generated!"
