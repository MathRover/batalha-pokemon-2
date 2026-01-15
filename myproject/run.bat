@echo off
REM Script para executar o jogo Batalha Pokémon
echo 🎮 Iniciando Batalha Pokémon...

if not exist venv (
    echo ❌ Ambiente virtual não encontrado!
    echo 💡 Execute setup.bat primeiro para configurar o ambiente.
    pause
    exit /b 1
)

echo ⚡ Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo 🚀 Iniciando servidor Flask...
python app.py
