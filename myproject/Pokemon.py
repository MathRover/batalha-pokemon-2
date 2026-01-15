"""
Módulo Pokemon - Funções para buscar dados de Pokémons na PokéAPI
"""

import requests

def pegar_pokemon(nome):
    """
    Busca dados de um Pokémon na PokéAPI
    
    Args:
        nome (str): Nome ou ID do Pokémon
        
    Returns:
        dict: Dados do Pokémon ou None em caso de erro
    """
    url = f"https://pokeapi.co/api/v2/pokemon/{nome.lower()}"
    try:
        resposta = requests.get(url, timeout=5)
        if resposta.status_code == 200:
            return resposta.json()
        else:
            print(f"Erro {resposta.status_code}: não consegui pegar {nome}")
            return None
    except requests.exceptions.RequestException as e:
        print("Erro de conexão:", e)
        return None

def pegar_tipo(url_tipo):
    """
    Busca dados de um tipo de Pokémon
    
    Args:
        url_tipo (str): URL do tipo
        
    Returns:
        dict: Dados do tipo ou None em caso de erro
    """
    try:
        resposta = requests.get(url_tipo, timeout=5)
        if resposta.status_code == 200:
            return resposta.json()
        return None
    except requests.exceptions.RequestException as e:
        print("Erro de conexão:", e)
        return None

def pegar_movimento(url_move):
    """
    Busca dados de um movimento/ataque
    
    Args:
        url_move (str): URL do movimento
        
    Returns:
        dict: Dados do movimento ou None em caso de erro
    """
    try:
        r = requests.get(url_move, timeout=5)
        if r.status_code == 200:
            return r.json()
        return None
    except requests.exceptions.RequestException:
        return None

def processar_pokemon(dados_pokemon):
    """
    Processa dados brutos do Pokémon em um formato mais útil
    
    Args:
        dados_pokemon (dict): Dados brutos da API
        
    Returns:
        dict: Dados processados do Pokémon
    """
    if not dados_pokemon:
        return None
        
    return {
        'nome': dados_pokemon['name'],
        'id': dados_pokemon['id'],
        'sprite': dados_pokemon['sprites']['front_default'],
        'tipos': [t['type']['name'] for t in dados_pokemon['types']],
        'estatisticas': {
            'hp': dados_pokemon['stats'][0]['base_stat'],
            'ataque': dados_pokemon['stats'][1]['base_stat'],
            'defesa': dados_pokemon['stats'][2]['base_stat'],
            'sp_ataque': dados_pokemon['stats'][3]['base_stat'],
            'sp_defesa': dados_pokemon['stats'][4]['base_stat'],
            'velocidade': dados_pokemon['stats'][5]['base_stat']
        },
        'movimentos': [m['move']['name'] for m in dados_pokemon['moves'][:10]]
    }

if __name__ == '__main__':
    # Exemplo de uso (para testes)
    print("Exemplo de uso do módulo Pokemon")
    print("-" * 40)
    
    pikachu = pegar_pokemon('pikachu')
    if pikachu:
        dados = processar_pokemon(pikachu)
        print(f"Nome: {dados['nome']}")
        print(f"ID: {dados['id']}")
        print(f"Tipos: {', '.join(dados['tipos'])}")
        print(f"HP: {dados['estatisticas']['hp']}")
        print(f"Ataque: {dados['estatisticas']['ataque']}")
