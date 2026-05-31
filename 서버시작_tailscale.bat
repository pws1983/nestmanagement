@echo off
chcp 65001 > nul
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

REM ============================================================
REM Tailscale 서버 시작 배치파일
REM - 기본 포트: 8000
REM - 다른 포트를 쓰려면 이 파일을 메모장으로 열어 APP_PORT만 수정
REM - 또는 명령줄에서: 서버시작_tailscale.bat 포트번호
REM ============================================================

set "APP_PORT=8000"
if not "%~1"=="" set "APP_PORT=%~1"

set "APP_CMD=uv run python server.py"

echo.
echo ================================
echo  서버 시작 준비
echo ================================
echo 작업 폴더: %CD%
echo 로컬 서버 명령: %APP_CMD%
echo 로컬 서버 포트: %APP_PORT%
echo.

REM Tailscale 실행 파일 확인
set "TAILSCALE_EXE="
where tailscale >nul 2>nul
if not errorlevel 1 set "TAILSCALE_EXE=tailscale"

if not defined TAILSCALE_EXE (
    if exist "%ProgramFiles%\Tailscale\tailscale.exe" set "TAILSCALE_EXE=%ProgramFiles%\Tailscale\tailscale.exe"
)

if not defined TAILSCALE_EXE (
    if exist "%LocalAppData%\Microsoft\WinGet\Packages\Tailscale.Tailscale_Microsoft.Winget.Source_8wekyb3d8bbwe\tailscale.exe" set "TAILSCALE_EXE=%LocalAppData%\Microsoft\WinGet\Packages\Tailscale.Tailscale_Microsoft.Winget.Source_8wekyb3d8bbwe\tailscale.exe"
)

if not defined TAILSCALE_EXE (
    echo [오류] tailscale.exe를 찾지 못했습니다.
    echo winget 설치 후 새 터미널을 열거나, Tailscale이 PATH에 잡혀 있는지 확인하세요.
    echo 예상 위치: C:\Program Files\Tailscale\tailscale.exe
    pause
    exit /b 1
)

echo [1/4] Tailscale 상태 확인 중...
"%TAILSCALE_EXE%" status >nul 2>nul
if errorlevel 1 (
    echo Tailscale 로그인이 필요합니다. 브라우저가 열리면 로그인하세요.
    "%TAILSCALE_EXE%" up
    if errorlevel 1 (
        echo [오류] Tailscale 연결에 실패했습니다.
        pause
        exit /b 1
    )
)

for /f "delims=" %%I in ('"%TAILSCALE_EXE%" ip -4 2^>nul') do (
    set "TS_IP=%%I"
    goto :got_ip
)
:got_ip

echo [2/4] 로컬 서버를 새 창에서 시작합니다...
echo 서버 창을 닫으면 로컬 서버도 종료됩니다.
start "Local Python Server - port %APP_PORT%" cmd /k "cd /d ""%CD%"" && set ""HOST=127.0.0.1"" && set ""PORT=%APP_PORT%"" && %APP_CMD%"

echo 로컬 서버 기동 대기 중...
timeout /t 4 /nobreak >nul

echo [3/4] Tailscale Serve로 tailnet 내부에 공유합니다...
"%TAILSCALE_EXE%" serve --bg %APP_PORT%
if errorlevel 1 (
    echo.
    echo [오류] tailscale serve 실행에 실패했습니다.
    echo 처음 사용하는 경우, Tailscale 관리 페이지에서 HTTPS/MagicDNS 허용이 필요할 수 있습니다.
    echo 아래 명령을 직접 실행해 표시되는 안내를 승인하세요.
    echo.
    echo     tailscale serve %APP_PORT%
    echo.
    pause
    exit /b 1
)

echo [4/4] 공유 상태 확인 중...
echo.
echo ================================
echo  Tailscale 서버 실행 완료
echo ================================
echo 같은 Tailscale 계정/tailnet에 연결된 기기에서 아래 Serve 주소로 접속하세요.
echo.
"%TAILSCALE_EXE%" serve status
echo.
if defined TS_IP (
    echo Tailscale IP: !TS_IP!
    echo 참고: server.py가 0.0.0.0으로 열리는 구조라면 http://!TS_IP!:%APP_PORT% 도 가능할 수 있습니다.
)
echo.
echo 권장 접속 방식은 위에 표시된 https://...ts.net 주소입니다.
echo 종료하려면:
echo   1. 로컬 서버 창에서 Ctrl+C
echo   2. Tailscale 공유 중지는 tailscale serve reset
echo.
pause
