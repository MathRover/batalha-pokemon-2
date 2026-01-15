@echo off
REM Script de Setup para Batalha Pokémon (Windows CMD)
echo 🎮 Configurando ambiente para Batalha Pokémon...

echo.
echo 📦 Verificando Python...
python --version
if errorlevel 1 (
    echo ❌ Python não encontrado! Por favor, instale o Python 3.8 ou superior.
    pause
    exit /b 1
)

echo.
echo 🗑️  Removendo ambiente virtual antigo (se existir)...
if exist venv rmdir /s /q venv

echo.
echo 🔧 Criando ambiente virtual...
python -m venv venv
if errorlevel 1 (
    echo ❌ Erro ao criar ambiente virtual!
    pause
    exit /b 1
)
echo ✅ Ambiente virtual criado com sucesso!

echo.
echo 📥 Atualizando pip...
venv\Scripts\python.exe -m pip install --upgrade pip

echo.
echo 📚 Instalando dependências...
venv\Scripts\pip.exe install -r requirements.txt
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)

echo.
echo ✅ Setup concluído com sucesso!
echo.
echo 🚀 Para executar o jogo:
echo    1. Execute: venv\Scripts\activate.bat
echo    2. Execute: python app.py
echo    3. Acesse: http://localhost:5000
echo.
pause
