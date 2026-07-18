import os
from flask import Flask
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load environment variables
load_dotenv()

# Inisialisasi Aplikasi Flask
app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.getenv("SECRET_KEY")

# Konfigurasi Koneksi Database
DB_URL = os.getenv("DATABASE_URL")
engine = create_engine(DB_URL)

# ==========================================
# REGISTER BLUEPRINTS (MENYAMBUNGKAN CONTROLLER)
# ==========================================
from controllers.admin_routes import admin_bp
from controllers.utama_routes import utama_bp

app.register_blueprint(admin_bp)
app.register_blueprint(utama_bp) # Mendaftarkan rute publik

if __name__ == '__main__':
    app.run(debug=True)