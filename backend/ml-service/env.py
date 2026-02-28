from dotenv import load_dotenv
import os

# Path to your backend folder
load_dotenv(dotenv_path=r"C:\Users\Shraddha\Desktop\CapP\aniresqget\AniResQ\backend\.env")

print(os.getenv("CLOUDINARY_CLOUD_NAME"))  # should now print correctly
print(os.getenv("CLOUDINARY_API_KEY"))
print(os.getenv("CLOUDINARY_API_SECRET"))