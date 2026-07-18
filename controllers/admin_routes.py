from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash
from sqlalchemy import text
from utils import upload_ke_cloudinary

# 1. Membuat "Blueprint" (Pecahan rute khusus Admin)
admin_bp = Blueprint('admin_bp', __name__)

# ==========================================
# ROUTING LOGIN & LOGOUT
# ==========================================
@admin_bp.route('/admin', methods=['GET', 'POST'])
def login():
    # Jika user sudah dalam keadaan login, langsung tendang ke dashboard
    if 'user_id' in session:
        return redirect(url_for('admin_bp.dashboard'))

    from app import engine
    error = None
    if request.method == 'POST':
        form_username = request.form['username']
        form_password = request.form['password']
        
        with engine.connect() as conn:
            query = text("SELECT id, password_hash FROM users WHERE username = :u")
            result = conn.execute(query, {"u": form_username}).fetchone()
            
            if result and check_password_hash(result[1], form_password):
                session['user_id'] = result[0]
                return redirect(url_for('admin_bp.dashboard'))
            else:
                error = "Username atau Password salah!"
                
    return render_template('admin/login.html', error=error)

@admin_bp.route('/admin/logout')
def logout():
    session.pop('user_id', None)
    # Ini akan melempar user kembali ke halaman utama pengunjung (/)
    return redirect(url_for('utama_bp.home'))


# ==========================================
# ROUTING DASHBOARD
# ==========================================
@admin_bp.route('/admin/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    return render_template('admin/dashboard.html')


# ==========================================
# CRUD PROFIL
# ==========================================
@admin_bp.route('/admin/profiles', methods=['GET', 'POST'])
def manage_profile():
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    
    from app import engine
    user_id = session['user_id']
    pesan = None

    with engine.connect() as conn:
        if request.method == 'POST':
            nama_lengkap = request.form['nama_lengkap']
            nama_panggilan = request.form['nama_panggilan']
            tempat_lahir = request.form['tempat_lahir']
            tanggal_lahir = request.form['tanggal_lahir']
            email = request.form['email']
            telepon = request.form['telepon']
            universitas = request.form['universitas']
            fakultas = request.form['fakultas']
            prodi = request.form['prodi']
            semester = request.form['semester']
            alamat = request.form['alamat']
            judul_hero = request.form.get('judul_hero', '') # Menangkap Teks Hero
            
            cek_query = text("SELECT * FROM profiles WHERE user_id = :uid")
            profil_lama = conn.execute(cek_query, {"uid": user_id}).fetchone()
            
            foto_url = profil_lama[13] if profil_lama and profil_lama[13] else ""
            foto_url_2 = profil_lama[14] if profil_lama and len(profil_lama) > 14 and profil_lama[14] else ""
            
            if 'foto' in request.files and request.files['foto'].filename != '':
                url_baru = upload_ke_cloudinary(request.files['foto'])
                if url_baru: foto_url = url_baru 

            if 'foto_2' in request.files and request.files['foto_2'].filename != '':
                url_baru_2 = upload_ke_cloudinary(request.files['foto_2'])
                if url_baru_2: foto_url_2 = url_baru_2 

            if profil_lama:
                query = text("""
                    UPDATE profiles SET 
                    nama_lengkap=:nl, nama_panggilan=:np, tempat_lahir=:tl, tanggal_lahir=:tgl,
                    email=:e, telepon=:tlp, universitas=:u, fakultas=:f, prodi=:p, semester=:s, 
                    alamat=:a, foto_url=:fu, foto_url_2=:fu2, judul_hero=:jh WHERE user_id = :uid
                """)
            else:
                query = text("""
                    INSERT INTO profiles 
                    (user_id, nama_lengkap, nama_panggilan, tempat_lahir, tanggal_lahir, email, telepon, universitas, fakultas, prodi, semester, alamat, foto_url, foto_url_2, judul_hero) 
                    VALUES (:uid, :nl, :np, :tl, :tgl, :e, :tlp, :u, :f, :p, :s, :a, :fu, :fu2, :jh)
                """)
                
            conn.execute(query, {
                "uid": user_id, "nl": nama_lengkap, "np": nama_panggilan, "tl": tempat_lahir, 
                "tgl": tanggal_lahir, "e": email, "tlp": telepon, "u": universitas, 
                "f": fakultas, "p": prodi, "s": semester, "a": alamat, "fu": foto_url, "fu2": foto_url_2, "jh": judul_hero
            })
            conn.commit()
            pesan = "Data Profil berhasil diperbarui!"

        ambil_query = text("SELECT * FROM profiles WHERE user_id = :uid")
        data_profil = conn.execute(ambil_query, {"uid": user_id}).fetchone()

    return render_template('admin/profiles.html', profile=data_profil, pesan=pesan)

# ==========================================
# CRUD SKILLS
# ==========================================
@admin_bp.route('/admin/skills', methods=['GET', 'POST'])
def manage_skills():
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    
    from app import engine
    user_id = session['user_id']
    pesan = None

    with engine.connect() as conn:
        # Proses Tambah Skill Baru (Jika tombol submit ditekan)
        if request.method == 'POST':
            nama_skill = request.form['nama_skill']
            icon_class = request.form.get('icon_class', '')
            
            query = text("INSERT INTO skills (user_id, nama_skill, icon_class) VALUES (:uid, :ns, :ic)")
            conn.execute(query, {"uid": user_id, "ns": nama_skill, "ic": icon_class})
            conn.commit()
            pesan = "Skill baru berhasil ditambahkan!"

        # Proses Tampil Data: Ambil semua skill dari database
        ambil_query = text("SELECT * FROM skills WHERE user_id = :uid ORDER BY id DESC")
        data_skills = conn.execute(ambil_query, {"uid": user_id}).fetchall()

    return render_template('admin/skills.html', skills=data_skills, pesan=pesan)

# Fungsi untuk menghapus skill
@admin_bp.route('/admin/skills/delete/<int:id>')
def delete_skill(id):
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    
    from app import engine
    with engine.connect() as conn:
        # Hapus berdasarkan ID skill dan ID User (agar tidak bisa menghapus milik orang lain)
        query = text("DELETE FROM skills WHERE id = :id AND user_id = :uid")
        conn.execute(query, {"id": id, "uid": session['user_id']})
        conn.commit()
        
    return redirect(url_for('admin_bp.manage_skills'))

# ==========================================
# CRUD EXPERIENCES (PENGALAMAN)
# ==========================================
@admin_bp.route('/admin/experiences', methods=['GET', 'POST'])
def manage_experiences():
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    
    from app import engine
    user_id = session['user_id']
    pesan = None

    with engine.connect() as conn:
        if request.method == 'POST':
            posisi = request.form['posisi']
            perusahaan = request.form['perusahaan']
            durasi = request.form['durasi']
            deskripsi = request.form['deskripsi']
            
            query = text("INSERT INTO experiences (user_id, posisi, perusahaan, durasi, deskripsi) VALUES (:uid, :pos, :per, :dur, :des)")
            conn.execute(query, {"uid": user_id, "pos": posisi, "per": perusahaan, "dur": durasi, "des": deskripsi})
            conn.commit()
            pesan = "Pengalaman berhasil ditambahkan!"

        ambil_query = text("SELECT * FROM experiences WHERE user_id = :uid ORDER BY id DESC")
        data_exp = conn.execute(ambil_query, {"uid": user_id}).fetchall()

    return render_template('admin/experiences.html', experiences=data_exp, pesan=pesan)

@admin_bp.route('/admin/experiences/delete/<int:id>')
def delete_experience(id):
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    from app import engine
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM experiences WHERE id = :id AND user_id = :uid"), {"id": id, "uid": session['user_id']})
        conn.commit()
    return redirect(url_for('admin_bp.manage_experiences'))

# ==========================================
# ROUTE UNTUK EDIT PENGALAMAN
# ==========================================
@admin_bp.route('/admin/experiences/edit/<int:id>', methods=['GET', 'POST'])
def edit_experience(id):
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))

    from app import engine
    user_id = session['user_id']

    with engine.connect() as conn:
        # Jika tombol "Simpan Perubahan" ditekan (POST)
        if request.method == 'POST':
            posisi = request.form['posisi']
            perusahaan = request.form['perusahaan']
            durasi = request.form['durasi']
            deskripsi = request.form['deskripsi']

            query = text("""
                UPDATE experiences 
                SET posisi=:pos, perusahaan=:per, durasi=:dur, deskripsi=:des 
                WHERE id=:id AND user_id=:uid
            """)
            conn.execute(query, {"pos": posisi, "per": perusahaan, "dur": durasi, "des": deskripsi, "id": id, "uid": user_id})
            conn.commit()
            return redirect('/admin/experiences')

        # Jika tombol "Edit" baru diklik (GET), ambil data lama untuk ditaruh di form
        query_edit = text("SELECT * FROM experiences WHERE id=:id AND user_id=:uid")
        edit_exp = conn.execute(query_edit, {"id": id, "uid": user_id}).fetchone()

        # Ambil juga semua data list untuk tabel di bawah (DITAMBAHKAN ORDER BY id DESC)
        query_all = text("SELECT * FROM experiences WHERE user_id=:uid ORDER BY id DESC")
        semua_exp = conn.execute(query_all, {"uid": user_id}).fetchall()

    # Lempar variabel edit_exp ke HTML agar form berubah jadi mode Edit
    return render_template('admin/experiences.html', experiences=semua_exp, edit_exp=edit_exp)


# ==========================================
# CRUD PROJECTS (PROYEK)
# ==========================================
@admin_bp.route('/admin/projects', methods=['GET', 'POST'])
def manage_projects():
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    
    from app import engine
    user_id = session['user_id']
    pesan = None

    with engine.connect() as conn:
        if request.method == 'POST':
            judul = request.form['judul']
            link_project = request.form.get('link_project', '')
            deskripsi = request.form['deskripsi']
            gambar_url = ""
            
            # Upload gambar proyek ke Cloudinary
            if 'gambar' in request.files:
                file_foto = request.files['gambar']
                if file_foto.filename != '':
                    url_baru = upload_ke_cloudinary(file_foto)
                    if url_baru:
                        gambar_url = url_baru 
            
            query = text("INSERT INTO projects (user_id, judul, deskripsi, gambar_url, link_project) VALUES (:uid, :j, :d, :g, :l)")
            conn.execute(query, {"uid": user_id, "j": judul, "d": deskripsi, "g": gambar_url, "l": link_project})
            conn.commit()
            pesan = "Proyek berhasil diunggah!"

        ambil_query = text("SELECT * FROM projects WHERE user_id = :uid ORDER BY id DESC")
        data_proj = conn.execute(ambil_query, {"uid": user_id}).fetchall()

    return render_template('admin/projects.html', projects=data_proj, pesan=pesan)

@admin_bp.route('/admin/projects/delete/<int:id>')
def delete_project(id):
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))
    from app import engine
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM projects WHERE id = :id AND user_id = :uid"), {"id": id, "uid": session['user_id']})
        conn.commit()
    return redirect(url_for('admin_bp.manage_projects'))

# ==========================================
# ROUTE UNTUK EDIT PROYEK
# ==========================================
@admin_bp.route('/admin/projects/edit/<int:id>', methods=['GET', 'POST'])
def edit_project(id):
    if 'user_id' not in session:
        return redirect(url_for('admin_bp.login'))

    from app import engine
    user_id = session['user_id']

    with engine.connect() as conn:
        # Ambil data lama dulu untuk ditampilkan di form & jaga-jaga gambar lama
        query_edit = text("SELECT * FROM projects WHERE id=:id AND user_id=:uid")
        edit_proj = conn.execute(query_edit, {"id": id, "uid": user_id}).fetchone()

        if request.method == 'POST':
            judul = request.form['judul']
            link_proyek = request.form.get('link_proyek', '')
            deskripsi = request.form['deskripsi']
            
            # Secara default, simpan ulang gambar lama
            gambar_url = edit_proj[4] if edit_proj else ""

            # Cek apakah user mengupload gambar baru
            if 'gambar' in request.files:
                file_gambar = request.files['gambar']
                if file_gambar.filename != '':
                    url_baru = upload_ke_cloudinary(file_gambar)
                    if url_baru:
                        gambar_url = url_baru # Timpa dengan gambar baru

            query = text("""
                UPDATE projects 
                SET judul=:jud, deskripsi=:des, gambar_url=:gbr, link_proyek=:link 
                WHERE id=:id AND user_id=:uid
            """)
            conn.execute(query, {
                "jud": judul, "des": deskripsi, "gbr": gambar_url, 
                "link": link_proyek, "id": id, "uid": user_id
            })
            conn.commit()
            return redirect('/admin/projects')

        # Ambil semua data proyek untuk tabel di bawah (DITAMBAHKAN ORDER BY id DESC)
        query_all = text("SELECT * FROM projects WHERE user_id=:uid ORDER BY id DESC")
        semua_proj = conn.execute(query_all, {"uid": user_id}).fetchall()

    return render_template('admin/projects.html', projects=semua_proj, edit_proj=edit_proj)