@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo 서버 시작 중...
uv run python server.py
pause
