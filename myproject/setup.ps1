# Script de Setup para Batalha Pokémon
# PowerShell script para configurar o ambiente virtual

Write-Host "🎮 Configurando ambiente para Batalha Pokémon..." -ForegroundColor Cyan

# Verificar se Python está instalado
Write-Host "`n📦 Verificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python não encontrado! Por favor, instale o Python 3.8 ou superior." -ForegroundColor Red
    exit 1
}
Write-Host "✅ $pythonVersion encontrado" -ForegroundColor Green

# Remover venv antigo se existir
if (Test-Path "venv") {
    Write-Host "`n🗑️  Removendo ambiente virtual antigo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "venv"
}

# Criar novo ambiente virtual
Write-Host "`n🔧 Criando ambiente virtual..." -ForegroundColor Yellow
python -m venv venv
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao criar ambiente virtual!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Ambiente virtual criado com sucesso!" -ForegroundColor Green

# Ativar ambiente virtual
Write-Host "`n⚡ Ativando ambiente virtual..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao ativar ambiente virtual!" -ForegroundColor Red
    Write-Host "💡 Tente executar manualmente: .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
    exit 1
}

# Atualizar pip
Write-Host "`n📥 Atualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Aviso: Não foi possível atualizar pip, mas continuando..." -ForegroundColor Yellow
}

# Instalar dependências
Write-Host "`n📚 Instalando dependências..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Setup concluído com sucesso!" -ForegroundColor Green
Write-Host "`n🚀 Para executar o jogo:" -ForegroundColor Cyan
Write-Host "   1. Ative o ambiente virtual: .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "   2. Execute: python app.py" -ForegroundColor White
Write-Host "   3. Acesse: http://localhost:5000" -ForegroundColor White
Write-Host "`n" -ForegroundColor White
