from flask import Blueprint, render_template, request
from sqlalchemy import text
from utils import kirim_email_kontak

# Membuat Blueprint khusus untuk halaman publik
utama_bp = Blueprint('utama_bp', __name__)

@utama_bp.route('/', methods=['GET', 'POST'])
def home():
    from app import engine # Import engine di dalam fungsi agar tidak terjadi circular import
    pesan_kontak = None
    
    # 1. Menangkap Form Kontak jika ada pengunjung yang kirim pesan
    if request.method == 'POST':
        nama = request.form['nama']
        email = request.form['email']
        pesan = request.form['pesan']
        
        # Eksekusi fungsi kirim email dari utils.py
        sukses = kirim_email_kontak(nama, email, pesan)
        if sukses:
            pesan_kontak = "Pesan berhasil dikirim! Saya akan segera membalasnya."
        else:
            pesan_kontak = "Waduh, pesan gagal dikirim. Sistem sedang sibuk."

    # 2. Mengambil semua data dari database untuk ditampilkan
    with engine.connect() as conn:
        profil = conn.execute(text("SELECT * FROM profiles LIMIT 1")).fetchone()
        skills = conn.execute(text("SELECT * FROM skills ORDER BY id DESC")).fetchall()
        experiences = conn.execute(text("SELECT * FROM experiences ORDER BY id DESC")).fetchall()
        projects = conn.execute(text("SELECT * FROM projects ORDER BY id DESC")).fetchall()
        
    return render_template('utama/index.html', profil=profil, skills=skills, experiences=experiences, projects=projects, pesan_kontak=pesan_kontak)