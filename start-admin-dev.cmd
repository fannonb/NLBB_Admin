@echo off
cd /d "%~dp0"
call node_modules\.bin\vite.cmd --configLoader runner --host 127.0.0.1 --clearScreen false --port 5181 >> "%~dp0web.admin.dev.log" 2>> "%~dp0web.admin.dev.err.log"
