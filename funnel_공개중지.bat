@echo off
chcp 65001 > nul
setlocal EnableExtensions

echo Tailscale Funnel 공개 설정을 중지합니다...
where tailscale >nul 2>nul
if errorlevel 1 (
    if exist "%ProgramFiles%\Tailscale\tailscale.exe" (
        "%ProgramFiles%\Tailscale\tailscale.exe" funnel reset
    ) else (
        echo [오류] tailscale.exe를 찾지 못했습니다.
        pause
        exit /b 1
    )
) else (
    tailscale funnel reset
)

echo 완료. 단, 별도 창에서 실행 중인 로컬 서버는 직접 닫아야 합니다.
pause
