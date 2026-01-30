import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'postgres'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'postgres'),
    'port': int(os.environ.get('DB_PORT', 5432)),
}

def get_db_connection():
    try:
        connection = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
        return connection
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None
