Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630

$bg     = [System.Drawing.Color]::FromArgb(10, 10, 10)
$text   = [System.Drawing.Color]::FromArgb(237, 237, 237)
$dim    = [System.Drawing.Color]::FromArgb(154, 154, 154)
$faint  = [System.Drawing.Color]::FromArgb(122, 122, 122)
$line   = [System.Drawing.Color]::FromArgb(36, 36, 36)
$segA   = [System.Drawing.Color]::FromArgb(46, 46, 46)
$segB   = [System.Drawing.Color]::FromArgb(74, 74, 74)

$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear($bg)

$penLine = New-Object System.Drawing.Pen($line, 2)
$g.DrawRectangle($penLine, 24, 24, $width - 48, $height - 48)

$cx = 600
$cy = 195
$r = 100
for ($i = 0; $i -lt 8; $i++) {
  $color = if ($i % 2 -eq 0) { $segA } else { $segB }
  $brush = New-Object System.Drawing.SolidBrush($color)
  $g.FillPie($brush, $cx - $r, $cy - $r, 2 * $r, 2 * $r, $i * 45, 45)
  $brush.Dispose()
}

$penRing = New-Object System.Drawing.Pen($text, 3)
$ringR = $r + 9
$g.DrawEllipse($penRing, $cx - $ringR, $cy - $ringR, 2 * $ringR, 2 * $ringR)

$hubBrush = New-Object System.Drawing.SolidBrush($text)
$g.FillEllipse($hubBrush, $cx - 15, $cy - 15, 30, 30)

$familyNames = [System.Drawing.FontFamily]::Families | ForEach-Object { $_.Name }
$displayFace = if ($familyNames -contains 'Space Grotesk') { 'Space Grotesk' } else { 'Segoe UI' }

$fontTitle = New-Object System.Drawing.Font($displayFace, 88, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontSub   = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fontFoot  = New-Object System.Drawing.Font('Consolas', 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center


$titleBrush = New-Object System.Drawing.SolidBrush($text)
$subBrush   = New-Object System.Drawing.SolidBrush($dim)
$footBrush  = New-Object System.Drawing.SolidBrush($faint)

$dot = [string][char]0x00B7
$subline = "ONE CLICK  $dot  ONE IDEA  $dot  SHIP IT"

$titleRect = New-Object System.Drawing.RectangleF(0, 320, $width, 120)
$subRect   = New-Object System.Drawing.RectangleF(0, 452, $width, 50)
$footRect  = New-Object System.Drawing.RectangleF(0, 540, $width, 40)

$g.DrawString('VIBE ROULETTE', $fontTitle, $titleBrush, $titleRect, $sf)
$g.DrawString($subline, $fontSub, $subBrush, $subRect, $sf)
$g.DrawString('FOR VIBE CODERS', $fontFoot, $footBrush, $footRect, $sf)

$outPath = Join-Path $PSScriptRoot '..\public\og.png'
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$penLine.Dispose()
$penRing.Dispose()
$hubBrush.Dispose()
$titleBrush.Dispose()
$subBrush.Dispose()
$footBrush.Dispose()

Write-Host "OG image written to $outPath"
