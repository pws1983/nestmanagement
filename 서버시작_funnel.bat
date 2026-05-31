@echo off
chcp 65001 > nul
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

REM ============================================================
REM Tailscale Funnel 공개 서버 시작 배치파일
REM - 목적: 외부 인터넷에서 https://...ts.net 주소로 접속 가능하게 공개
REM - 기본 로컬 포트: 8000
REM - 다른 포트를 쓰려면: 서버시작_funnel.bat 포트번호
REM - server.py가 있으면 uv run python server.py 실행
REM - server.py가 없으면 현재 폴더를 정적 HTML 서버로 실행
REM ============================================================

set "APP_PORT=8000"
if not "%~1"=="" set "APP_PORT=%~1"

if exist "%CD%\server.py" (
    set "APP_CMD=uv run python server.py"
    set "APP_DESC=server.py"
) else (
    set "APP_CMD=python -m http.server %APP_PORT% --bind 127.0.0.1"
    set "APP_DESC=현재 폴더 정적 HTML 서버"
)

echo.
echo ================================
echo  Tailscale Funnel 공개 서버 시작
echo ================================
echo 작업 폴더: %CD%
echo 서버 종류: %APP_DESC%
echo 로컬 포트: %APP_PORT%
echo.
echo [주의] Funnel은 외부 인터넷에 공개됩니다.
echo 비밀번호, 학생정보, 결제정보, 개인정보 파일이 들어 있는 폴더에서는 실행하지 마세요.
echo.

REM Tailscale 실행 파일 확인
set "TAILSCALE_EXE="
where tailscale >nul 2>nul
if not errorlevel 1 set "TAILSCALE_EXE=tailscale"

if not defined TAILSCALE_EXE (
    if exist "%ProgramFiles%\Tailscale\tailscale.exe" set "TAILSCALE_EXE=%ProgramFiles%\Tailscale\tailscale.exe"
)

if not defined TAILSCALE_EXE (
    for /f "delims=" %%F in ('dir /b /s "%LocalAppData%\Microsoft\WinGet\Packages\Tailscale.Tailscale*\tailscale.exe" 2^>nul') do (
        set "TAILSCALE_EXE=%%F"
        goto :found_tailscale
    )
)
:found_tailscale

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

echo [2/4] 로컬 서버를 새 창에서 시작합니다...
echo 서버 창을 닫으면 로컬 서버도 종료됩니다.
if exist "%CD%\server.py" (
    start "Local Server - port %APP_PORT%" cmd /k "cd /d ""%CD%"" && set ""HOST=127.0.0.1"" && set ""PORT=%APP_PORT%"" && %APP_CMD%"
) else (
    start "Static HTML Server - port %APP_PORT%" cmd /k "cd /d ""%CD%"" && %APP_CMD%"
)

echo 로컬 서버 기동 대기 중...
timeout /t 4 /nobreak >nul

echo [3/4] Tailscale Funnel로 외부 인터넷에 공개합니다...
echo 처음 사용하는 경우 승인 페이지가 열리거나 안내 URL이 표시될 수 있습니다.
echo.
"%TAILSCALE_EXE%" funnel --bg --yes %APP_PORT%
if errorlevel 1 (
    echo.
    echo [오류] tailscale funnel 자동 실행에 실패했습니다.
    echo 첫 사용 시 Tailscale 관리 페이지에서 Funnel, MagicDNS, HTTPS 승인이 필요할 수 있습니다.
    echo 아래 명령을 새 명령 프롬프트에서 직접 실행해 표시되는 승인 안내를 완료하세요.
    echo.
    echo     tailscale funnel %APP_PORT%
    echo.
    echo 승인 후 다시 이 파일을 실행하면 됩니다.
    pause
    exit /b 1
)

echo [4/4] 공개 주소 확인 중...
echo.
echo ================================
echo  Funnel 공개 서버 실행 완료
echo ================================
echo 아래에 표시되는 https://...ts.net 주소를 외부 접속자에게 공유하면 됩니다.
echo.
"%TAILSCALE_EXE%" funnel status
echo.
echo 접속 주소가 바로 안 열리면 1~10분 정도 DNS 반영 시간이 걸릴 수 있습니다.
echo.
echo 종료/중지 방법:
echo   1. 로컬 서버 창에서 Ctrl+C 또는 창 닫기
echo   2. 공개 Funnel 중지: tailscale funnel reset
echo.
pause
