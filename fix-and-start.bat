@echo off
echo.
echo ========================================
echo   FIXING AND STARTING BACKEND SERVER
echo ========================================
echo.

echo [1/3] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    echo Please check for TypeScript errors above.
    pause
    exit /b 1
)

echo.
echo [2/3] Build successful!
echo.

echo [3/3] Starting server...
echo.
echo ========================================
echo   SERVER STARTING...
echo   Press Ctrl+C to stop
echo ========================================
echo.

call npm run dev
