$ErrorActionPreference = 'Stop'
$r = Invoke-WebRequest -Uri "https://cu-dau-tu.pages.dev/_next/static/chunks/app/(app)/profile/page-828381d378ee2937.js" -UseBasicParsing -TimeoutSec 30
$content = $r.Content
$matches = [regex]::Matches($content, '"[^"]{3,80}"')
$vnPattern = '[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵÀÁẢÃẠẰẮẲẴẶẦẤẨẪẬÈÉẺẼẸỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌỒỐỔỖỘỜỚỞỠỢÙÚỦŨỤỪỨỬỮỰỲÝỶỸỴ]'
$vnStrings = @()
foreach ($m in $matches) {
    if ($m.Value -match $vnPattern) { $vnStrings += $m.Value }
}
Write-Host "Total VN strings in profile chunk: $($vnStrings.Count)"
$vnStrings | Select-Object -First 30
