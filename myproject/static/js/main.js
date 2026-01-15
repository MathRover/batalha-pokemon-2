// Estado do jogo
let playerPokemon = null;
let enemyPokemon = null;
let typeChart = {};
let battleState = 'idle'; // idle, playerTurn, enemyTurn, ended
let battleHistory = JSON.parse(localStorage.getItem('battleHistory') || '[]');

// Cores dos tipos
const typeColors = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

// Funções de navegação
function showMenu() {
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('selectionScreen').style.display = 'none';
  document.getElementById('battleArena').style.display = 'none';
  document.getElementById('winnerScreen').style.display = 'none';
  document.getElementById('statsScreen').style.display = 'none';
  resetGame();
}

function showSelection() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('selectionScreen').style.display = 'block';
  document.getElementById('battleArena').style.display = 'none';
  document.getElementById('winnerScreen').style.display = 'none';
  document.getElementById('statsScreen').style.display = 'none';
}

function showStats() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('selectionScreen').style.display = 'none';
  document.getElementById('battleArena').style.display = 'none';
  document.getElementById('winnerScreen').style.display = 'none';
  document.getElementById('statsScreen').style.display = 'block';
  displayStats();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// Carregar preferências salvas
function loadPreferences() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark');
  }
}

// Buscar Pokémon na API
async function searchPokemon(type) {
  const inputId = type === 'player' ? 'playerPokemon' : 'enemyPokemon';
  const pokemonName = document.getElementById(inputId).value.trim().toLowerCase();
  
  if (!pokemonName) {
    alert('Digite o nome de um Pokémon!');
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) throw new Error('Pokémon não encontrado!');
    
    const data = await response.json();
    const pokemonData = {
      name: data.name,
      id: data.id,
      sprite: data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speed: data.stats[5].base_stat
      },
      moves: data.moves.slice(0, 4).map(m => ({
        name: m.move.name,
        url: m.move.url
      }))
    };

    if (type === 'player') {
      playerPokemon = pokemonData;
    } else {
      enemyPokemon = pokemonData;
    }

    displayPokemonPreview(type, pokemonData);
    checkReadyToBattle();
  } catch (error) {
    alert('Pokémon não encontrado! Verifique o nome e tente novamente.');
    console.error(error);
  }
}

// Mostrar preview do Pokémon
function displayPokemonPreview(type, pokemon) {
  const previewId = type === 'player' ? 'playerPreview' : 'enemyPreview';
  let previewContainer = document.getElementById(previewId);
  
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.id = previewId;
    previewContainer.className = 'preview-card';
    document.getElementById('pokemonPreview').appendChild(previewContainer);
  }

  previewContainer.innerHTML = `
    <img src="${pokemon.sprite}" alt="${pokemon.name}" />
    <div class="pokemon-name">${capitalize(pokemon.name)}</div>
    <div class="types">
      ${pokemon.types.map(type => `
        <span class="type-badge" style="background-color: ${typeColors[type] || '#666'}">
          ${type}
        </span>
      `).join('')}
    </div>
    <div style="margin-top: 10px; font-size: 14px;">
      <div>HP: ${pokemon.stats.hp}</div>
      <div>Ataque: ${pokemon.stats.attack}</div>
      <div>Defesa: ${pokemon.stats.defense}</div>
    </div>
  `;

  previewContainer.classList.add('selected');
}

function checkReadyToBattle() {
  const btn = document.getElementById('startBattleBtn');
  if (playerPokemon && enemyPokemon) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
}

// Iniciar batalha
async function startBattle() {
  if (!playerPokemon || !enemyPokemon) return;

  // Carregar movimentos dos pokémons
  await loadPokemonMoves(playerPokemon);
  await loadPokemonMoves(enemyPokemon);

  // Carregar tipos dos ataques
  const attackTypes = new Set();
  playerPokemon.attacks.forEach(a => attackTypes.add(a.type));
  enemyPokemon.attacks.forEach(a => attackTypes.add(a.type));
  playerPokemon.types.forEach(t => attackTypes.add(t));
  enemyPokemon.types.forEach(t => attackTypes.add(t));
  
  for (const type of attackTypes) {
    await loadTypeChart(type);
  }

  // Resetar estado
  playerPokemon.currentHp = playerPokemon.stats.hp;
  enemyPokemon.currentHp = enemyPokemon.stats.hp;

  // Mostrar arena
  document.getElementById('selectionScreen').style.display = 'none';
  document.getElementById('battleArena').style.display = 'block';

  // Atualizar UI
  updateBattleUI();
  addBattleLog(`Batalha entre ${capitalize(playerPokemon.name)} e ${capitalize(enemyPokemon.name)}!`);
  addBattleLog('Que comece a batalha!');

  battleState = 'playerTurn';
}

// Carregar movimentos
async function loadPokemonMoves(pokemon) {
  pokemon.attacks = [];
  for (const move of pokemon.moves) {
    try {
      const response = await fetch(move.url);
      const moveData = await response.json();
      pokemon.attacks.push({
        name: moveData.name,
        power: moveData.power || 50,
        accuracy: moveData.accuracy || 100,
        type: moveData.type.name,
        pp: moveData.pp || 20
      });
    } catch (error) {
      console.error(`Erro ao carregar movimento ${move.name}:`, error);
    }
  }
}

// Atualizar UI da batalha
function updateBattleUI() {
  // Player
  document.getElementById('playerName').textContent = capitalize(playerPokemon.name);
  document.getElementById('playerSprite').src = playerPokemon.sprite;
  updateHpBar('player', playerPokemon.currentHp, playerPokemon.stats.hp);

  // Enemy
  document.getElementById('enemyName').textContent = capitalize(enemyPokemon.name);
  document.getElementById('enemySprite').src = enemyPokemon.sprite;
  updateHpBar('enemy', enemyPokemon.currentHp, enemyPokemon.stats.hp);

  // Ataques
  const attacksGrid = document.getElementById('attacksGrid');
  attacksGrid.innerHTML = '';
  playerPokemon.attacks.forEach((attack, index) => {
    const btn = document.createElement('button');
    btn.className = 'attack-btn';
    btn.onclick = () => useAttack(index);
    btn.innerHTML = `
      <div class="attack-name">${capitalize(attack.name)}</div>
      <div class="attack-info">
        <span>Poder: ${attack.power}</span>
        <span>Tipo: ${attack.type}</span>
      </div>
    `;
    btn.style.background = `linear-gradient(135deg, ${typeColors[attack.type] || '#667eea'}, ${adjustColor(typeColors[attack.type] || '#667eea', -30)})`;
    attacksGrid.appendChild(btn);
  });
}

function updateHpBar(type, current, max) {
  const barId = type === 'player' ? 'playerHpBar' : 'enemyHpBar';
  const bar = document.getElementById(barId);
  const percentage = (current / max) * 100;
  bar.style.width = percentage + '%';
  bar.textContent = `HP: ${Math.max(0, Math.round(current))}/${max}`;
  
  bar.className = 'hp-bar';
  if (percentage < 25) bar.classList.add('low');
  else if (percentage < 50) bar.classList.add('medium');
}

// Usar ataque
async function useAttack(attackIndex) {
  if (battleState !== 'playerTurn') return;

  const attack = playerPokemon.attacks[attackIndex];
  battleState = 'processing';

  // Animação
  document.getElementById('playerPokemonCard').classList.add('attacking');
  document.getElementById('enemyPokemonCard').classList.add('defending');

  // Calcular dano
  const damage = calculateDamage(playerPokemon, enemyPokemon, attack);
  enemyPokemon.currentHp = Math.max(0, enemyPokemon.currentHp - damage);

  // Log
  const effectiveness = getEffectiveness(attack.type, enemyPokemon.types);
  let logClass = '';
  let effectivenessText = '';
  
  if (effectiveness > 1) {
    logClass = 'super-effective';
    effectivenessText = 'É super efetivo!';
  } else if (effectiveness < 1 && effectiveness > 0) {
    logClass = 'not-very-effective';
    effectivenessText = 'Não é muito efetivo...';
  } else if (effectiveness === 0) {
    logClass = 'no-effect';
    effectivenessText = 'Não teve efeito!';
  }

  addBattleLog(`${capitalize(playerPokemon.name)} usou ${capitalize(attack.name)}! ${effectivenessText}`, logClass);
  addBattleLog(`${capitalize(enemyPokemon.name)} perdeu ${Math.round(damage)} de HP!`);

  updateHpBar('enemy', enemyPokemon.currentHp, enemyPokemon.stats.hp);

  // Verificar vitória
  if (enemyPokemon.currentHp <= 0) {
    setTimeout(() => endBattle('player'), 1000);
    return;
  }

  // Remover animações
  setTimeout(() => {
    document.getElementById('playerPokemonCard').classList.remove('attacking');
    document.getElementById('enemyPokemonCard').classList.remove('defending');
  }, 500);

  // Turno do inimigo
  setTimeout(() => enemyTurn(), 1500);
}

// Turno do inimigo
function enemyTurn() {
  battleState = 'enemyTurn';

  // Escolher ataque aleatório
  const attack = enemyPokemon.attacks[Math.floor(Math.random() * enemyPokemon.attacks.length)];

  // Animação
  document.getElementById('enemyPokemonCard').classList.add('attacking');
  document.getElementById('playerPokemonCard').classList.add('defending');

  // Calcular dano
  const damage = calculateDamage(enemyPokemon, playerPokemon, attack);
  playerPokemon.currentHp = Math.max(0, playerPokemon.currentHp - damage);

  // Log
  const effectiveness = getEffectiveness(attack.type, playerPokemon.types);
  let logClass = '';
  let effectivenessText = '';
  
  if (effectiveness > 1) {
    logClass = 'super-effective';
    effectivenessText = 'É super efetivo!';
  } else if (effectiveness < 1 && effectiveness > 0) {
    logClass = 'not-very-effective';
    effectivenessText = 'Não é muito efetivo...';
  } else if (effectiveness === 0) {
    logClass = 'no-effect';
    effectivenessText = 'Não teve efeito!';
  }

  addBattleLog(`${capitalize(enemyPokemon.name)} usou ${capitalize(attack.name)}! ${effectivenessText}`, logClass);
  addBattleLog(`${capitalize(playerPokemon.name)} perdeu ${Math.round(damage)} de HP!`);

  updateHpBar('player', playerPokemon.currentHp, playerPokemon.stats.hp);

  // Verificar derrota
  if (playerPokemon.currentHp <= 0) {
    setTimeout(() => endBattle('enemy'), 1000);
    return;
  }

  // Remover animações
  setTimeout(() => {
    document.getElementById('enemyPokemonCard').classList.remove('attacking');
    document.getElementById('playerPokemonCard').classList.remove('defending');
    battleState = 'playerTurn';
  }, 500);
}

// Calcular dano
function calculateDamage(attacker, defender, attack) {
  const basePower = attack.power || 50;
  const attackStat = attacker.stats.attack;
  const defenseStat = defender.stats.defense;
  
  let damage = ((2 * 50 / 5 + 2) * basePower * attackStat / defenseStat) / 50 + 2;
  
  // Aplicar efetividade
  const effectiveness = getEffectiveness(attack.type, defender.types);
  damage *= effectiveness;

  // Variação aleatória (85-100%)
  damage *= (0.85 + Math.random() * 0.15);

  // STAB (Same Type Attack Bonus)
  if (attacker.types.includes(attack.type)) {
    damage *= 1.5;
  }

  return Math.max(1, Math.round(damage));
}

// Calcular efetividade (síncrona, requer tipo já carregado)
function getEffectiveness(attackType, defenderTypes) {
  if (!typeChart[attackType]) {
    return 1; // Tipo não carregado, retorna neutro
  }

  let effectiveness = 1;
  for (const defenderType of defenderTypes) {
    const relations = typeChart[attackType];
    
    if (relations.doubleDamageTo.includes(defenderType)) {
      effectiveness *= 2;
    } else if (relations.halfDamageTo.includes(defenderType)) {
      effectiveness *= 0.5;
    } else if (relations.noDamageTo.includes(defenderType)) {
      effectiveness *= 0;
    }
  }

  return effectiveness;
}

// Carregar tabela de tipos
async function loadTypeChart(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    
    typeChart[type] = {
      doubleDamageTo: data.damage_relations.double_damage_to.map(t => t.name),
      halfDamageTo: data.damage_relations.half_damage_to.map(t => t.name),
      noDamageTo: data.damage_relations.no_damage_to.map(t => t.name)
    };
  } catch (error) {
    console.error(`Erro ao carregar tipo ${type}:`, error);
    typeChart[type] = {
      doubleDamageTo: [],
      halfDamageTo: [],
      noDamageTo: []
    };
  }
}

// Adicionar log de batalha
function addBattleLog(message, className = '') {
  const log = document.getElementById('battleLog');
  const p = document.createElement('p');
  p.className = className;
  p.textContent = message;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

// Finalizar batalha
function endBattle(winner) {
  battleState = 'ended';
  const winnerPokemon = winner === 'player' ? playerPokemon : enemyPokemon;
  const loserPokemon = winner === 'player' ? enemyPokemon : playerPokemon;
  
  // Salvar histórico
  const battleRecord = {
    date: new Date().toISOString(),
    winner: winnerPokemon.name,
    loser: loserPokemon.name,
    playerPokemon: playerPokemon.name,
    enemyPokemon: enemyPokemon.name
  };
  battleHistory.unshift(battleRecord);
  if (battleHistory.length > 50) battleHistory.pop(); // Manter apenas 50 últimas
  localStorage.setItem('battleHistory', JSON.stringify(battleHistory));
  
  document.getElementById('battleArena').style.display = 'none';
  document.getElementById('winnerScreen').style.display = 'block';
  document.getElementById('winnerTitle').textContent = `${capitalize(winnerPokemon.name)} venceu!`;
  document.getElementById('winnerSprite').src = winnerPokemon.sprite;

  if (winner === 'player') {
    addBattleLog(`🎉 ${capitalize(playerPokemon.name)} venceu a batalha! 🎉`);
  } else {
    addBattleLog(`💀 ${capitalize(enemyPokemon.name)} venceu a batalha! 💀`);
  }
}

// Mostrar estatísticas
function displayStats() {
  const totalBattles = battleHistory.length;
  const wins = battleHistory.filter(b => b.winner === b.playerPokemon).length;
  const losses = totalBattles - wins;
  const winRate = totalBattles > 0 ? ((wins / totalBattles) * 100).toFixed(1) : 0;

  // Pokémon mais usado
  const pokemonCount = {};
  battleHistory.forEach(b => {
    pokemonCount[b.playerPokemon] = (pokemonCount[b.playerPokemon] || 0) + 1;
  });
  const mostUsed = Object.entries(pokemonCount).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('totalBattles').textContent = totalBattles;
  document.getElementById('wins').textContent = wins;
  document.getElementById('losses').textContent = losses;
  document.getElementById('winRate').textContent = winRate + '%';
  document.getElementById('mostUsed').textContent = mostUsed ? capitalize(mostUsed[0]) + ' (' + mostUsed[1] + 'x)' : 'N/A';

  // Histórico
  const historyDiv = document.getElementById('battleHistoryList');
  historyDiv.innerHTML = '';
  battleHistory.slice(0, 10).forEach(battle => {
    const item = document.createElement('div');
    item.className = 'history-item';
    const date = new Date(battle.date);
    item.innerHTML = `
      <strong>${capitalize(battle.playerPokemon)}</strong> vs <strong>${capitalize(battle.enemyPokemon)}</strong>
      <br>Vencedor: ${capitalize(battle.winner)} - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
    `;
    historyDiv.appendChild(item);
  });
}

// Resetar jogo
function resetGame() {
  playerPokemon = null;
  enemyPokemon = null;
  typeChart = {};
  battleState = 'idle';
  const playerInput = document.getElementById('playerPokemon');
  const enemyInput = document.getElementById('enemyPokemon');
  if (playerInput) playerInput.value = '';
  if (enemyInput) enemyInput.value = '';
  const preview = document.getElementById('pokemonPreview');
  if (preview) preview.innerHTML = '';
  const log = document.getElementById('battleLog');
  if (log) log.innerHTML = '';
}

// Utilitários
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function adjustColor(color, amount) {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  
  // Permitir Enter nos inputs
  const playerInput = document.getElementById('playerPokemon');
  const enemyInput = document.getElementById('enemyPokemon');
  
  if (playerInput) {
    playerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchPokemon('player');
    });
  }
  
  if (enemyInput) {
    enemyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchPokemon('enemy');
    });
  }
});

