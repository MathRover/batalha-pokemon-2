# 🎮 Batalha Pokémon

Um jogo de batalha Pokémon completo e profissional desenvolvido com Flask (Python), HTML, CSS e JavaScript. O jogo permite escolher Pokémons, batalhar com sistema de turnos, HP, ataques, mecânica de tipos e muito mais!

## ✨ Funcionalidades

### 🎯 Principais
- **Escolha de Pokémons**: Busque qualquer Pokémon pela PokéAPI
- **Sistema de Batalha Completo**: Batalhas por turnos entre dois Pokémons
- **Sistema de HP Dinâmico**: Barra de vida que muda de cor conforme o HP diminui
- **Ataques Únicos**: Cada Pokémon tem 4 ataques únicos com poder e tipo
- **Mecânica de Tipos Completa**: Sistema de efetividade (super efetivo, não muito efetivo, sem efeito)
- **Animações Suaves**: Animações durante as batalhas e transições
- **Interface Moderna**: Design bonito, responsivo e intuitivo
- **Modo Escuro**: Toggle entre tema claro e escuro (salvo no navegador)
- **Log de Batalha**: Registro detalhado de todas as ações na batalha

### 📊 Extras
- **Sistema de Estatísticas**: Acompanhe suas vitórias, derrotas e taxa de vitória
- **Histórico de Batalhas**: Veja as últimas 50 batalhas jogadas
- **Pokémon Mais Usado**: Estatística do Pokémon que você mais usou
- **Persistência de Dados**: Estatísticas salvas no navegador (localStorage)

## 🛠️ Tecnologias Utilizadas

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: PokéAPI (https://pokeapi.co)
- **Dependências**: Flask, Requests

## 📋 Estrutura do Projeto

```
myproject/
├── app.py                 # Aplicação Flask principal
├── Pokemon.py             # Módulo Python com funções da PokéAPI
├── requirements.txt       # Dependências Python
├── .gitignore            # Arquivos ignorados pelo Git
├── README.md             # Este arquivo
│
├── templates/            # Templates HTML (Flask)
│   └── index.html        # Página principal
│
└── static/               # Arquivos estáticos
    ├── css/
    │   └── style.css     # Estilos CSS
    ├── js/
    │   └── main.js       # Lógica JavaScript
    └── images/           # Imagens (futuro)
```

## 🚀 Como Executar

### Windows (Recomendado)

**Opção 1: Usando o script automático**
1. Execute `setup.bat` para configurar o ambiente virtual
2. Execute `run.bat` para iniciar o jogo

**Opção 2: Manual**
1. Crie o ambiente virtual:
   ```cmd
   python -m venv venv
   ```

2. Ative o ambiente virtual:
   ```cmd
   venv\Scripts\activate.bat
   ```

3. Instale as dependências:
   ```cmd
   pip install -r requirements.txt
   ```

4. Execute a aplicação:
   ```cmd
   python app.py
   ```

### Linux/Mac

1. Crie o ambiente virtual:
   ```bash
   python3 -m venv venv
   ```

2. Ative o ambiente virtual:
   ```bash
   source venv/bin/activate
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Execute a aplicação:
   ```bash
   python app.py
   ```

### Acesse no navegador:
```
http://localhost:5000
```

## 🎮 Como Jogar

1. Clique em "▶ Jogar" no menu principal
2. Digite o nome do seu Pokémon (ex: "pikachu") e clique em "Buscar"
3. Digite o nome do Pokémon adversário (ex: "charizard") e clique em "Buscar"
4. Clique em "Iniciar Batalha"
5. Escolha um ataque nos botões disponíveis
6. A batalha continua em turnos até um Pokémon vencer
7. Veja suas estatísticas clicando em "📊 Estatísticas"

## 🎲 Mecânicas de Batalha

### Cálculo de Dano
O dano é calculado usando uma fórmula baseada nos jogos Pokémon:
- Estatísticas de ataque e defesa do Pokémon
- Poder base do ataque
- Efetividade do tipo (super efetivo, não muito efetivo, sem efeito)
- STAB (Same Type Attack Bonus) - 1.5x se o tipo do ataque corresponde ao tipo do Pokémon
- Variação aleatória (85-100%)

### Efetividade de Tipos
- **Super Efetivo (2x)**: Causa dano dobrado
- **Não Muito Efetivo (0.5x)**: Causa metade do dano
- **Sem Efeito (0x)**: Não causa dano

## 📦 Dependências

### Python
- Flask 3.0.0
- Requests 2.31.0
- Werkzeug 3.0.1

### Navegador
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Conexão com internet (para acessar a PokéAPI)

## 🔧 Desenvolvimento

### Estrutura do Código

- **`app.py`**: Configuração do Flask e rotas
- **`Pokemon.py`**: Funções para buscar dados da PokéAPI
- **`templates/index.html`**: Estrutura HTML
- **`static/css/style.css`**: Estilos e animações
- **`static/js/main.js`**: Lógica do jogo

### Adicionar Funcionalidades

1. **Novos Pokémon**: A PokéAPI já suporta todos os Pokémons
2. **Novos Ataques**: Cada Pokémon já tem seus movimentos da PokéAPI
3. **Novos Tipos**: Todos os 18 tipos são suportados
4. **Modificações CSS**: Edite `static/css/style.css`
5. **Modificações JS**: Edite `static/js/main.js`

## 🎨 Características Visuais

- Design moderno com gradientes e sombras
- Animações suaves de entrada e saída
- Barra de HP colorida (verde → laranja → vermelho)
- Cards de Pokémon com efeitos hover
- Interface totalmente responsiva
- Modo escuro integrado

## 📝 Notas

- O jogo requer conexão com a internet para funcionar (usa a PokéAPI)
- Use nomes dos Pokémons em inglês ou português (ex: "pikachu", "charizard", "bulbasaur")
- Os Pokémons têm nível 50 fixo para balanceamento
- Cada Pokémon pode usar seus 4 primeiros movimentos da PokéAPI
- Estatísticas são salvas no navegador (localStorage)

## 🎮 Exemplos de Pokémons para Testar

- **Elétricos**: Pikachu, Raichu, Zapdos, Jolteon
- **Fogo**: Charizard, Arcanine, Flareon, Blaziken
- **Água**: Blastoise, Gyarados, Vaporeon, Swampert
- **Planta**: Venusaur, Torterra, Leafeon, Sceptile
- **Dragão**: Dragonite, Garchomp, Salamence, Rayquaza
- **Psíquico**: Alakazam, Mewtwo, Espeon, Gardevoir

## 🤝 Contribuindo

Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar funcionalidades
- Melhorar a documentação

## 📄 Licença

Este projeto é de código aberto e está disponível para uso educacional e pessoal.

## 🙏 Agradecimentos

- **PokéAPI**: Por fornecer uma API gratuita e completa com dados dos Pokémons
- **Pokémon Company**: Por criar a franquia Pokémon

---

**Desenvolvido com ❤️ para fãs de Pokémon!**

**Versão**: 2.0.0  
**Última atualização**: 2025
