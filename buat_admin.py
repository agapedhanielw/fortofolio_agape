from sqlalchemy import text
from werkzeug.security import generate_password_hash
from app import engine # Mengambil mesin database dari app.py

# --- GANTI BAGIAN INI SESUAI KEINGINANMU ---
USERNAME_BARU = "agape"
PASSWORD_BARU = "admin123" 
# -------------------------------------------

hash_pw = generate_password_hash(PASSWORD_BARU)

try:
    with engine.connect() as conn:
        query = text("INSERT INTO users (username, password_hash, role) VALUES (:u, :p, 'admin')")
        conn.execute(query, {"u": USERNAME_BARU, "p": hash_pw})
        conn.commit()
        print(f"Mantap wok! Akun admin '{USERNAME_BARU}' berhasil dibuat.")
except Exception as e:
    print(f"Waduh gagal: {e}")