from flask import Flask, render_template
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
def index():
    """Página principal do jogo"""
    return render_template('index.html')

@app.route('/health')
def health():
    """Endpoint de saúde da aplicação"""
    return {'status': 'ok', 'message': 'Batalha Pokémon está funcionando!'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

