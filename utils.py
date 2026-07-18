import os
import cloudinary
import cloudinary.uploader
import resend
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ==========================================
# 1. KONFIGURASI CLOUDINARY
# ==========================================
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_ke_cloudinary(file_gambar):
    """
    Fungsi untuk menerima file gambar dari form HTML 
    dan mengunggahnya ke Cloudinary.
    Mengembalikan URL gambar yang sudah online.
    """
    try:
        # Proses upload ke Cloudinary
        hasil_upload = cloudinary.uploader.upload(file_gambar)
        # Ambil link URL amannya (https)
        url_gambar = hasil_upload.get("secure_url")
        return url_gambar
    except Exception as e:
        print(f"Error Upload Cloudinary: {e}")
        return None

# ==========================================
# 2. KONFIGURASI RESEND (EMAIL)
# ==========================================
resend.api_key = os.getenv("RESEND_API_KEY")

def kirim_email_kontak(nama_pengirim, email_pengirim, isi_pesan):
    """
    Fungsi untuk mengirim email dari form kontak pengunjung web.
    """
    try:
        # Menyusun format email HTML
        konten_html = f"""
        <h2>Pesan Baru dari Web Portofolio! 🚀</h2>
        <p><strong>Nama:</strong> {nama_pengirim}</p>
        <p><strong>Email Pengunjung:</strong> {email_pengirim}</p>
        <hr>
        <p><strong>Pesan:</strong></p>
        <p>{isi_pesan}</p>
        """
        
        # Parameter pengiriman Resend
        params = {
            "from": os.getenv("RESEND_FROM_EMAIL"),  # Dari .env (contoh: onboarding@resend.dev)
            "to": os.getenv("RESEND_TO_EMAIL"),      # Dari .env (email pribadimu)
            "subject": f"Pesan Portofolio dari {nama_pengirim}",
            "html": konten_html
        }
        
        # Eksekusi kirim email
        email = resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"Error Kirim Email Resend: {e}")
        return False