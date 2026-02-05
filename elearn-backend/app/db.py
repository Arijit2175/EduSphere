import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import pool
import os
from dotenv import load_dotenv
from functools import lru_cache
from datetime import datetime, timedelta

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'postgres'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'postgres'),
    'port': int(os.environ.get('DB_PORT', 5432)),
    'sslmode': 'require',
}

try:
    db_pool = psycopg2.pool.SimpleConnectionPool(
        10,  
        50,  
        **DB_CONFIG,
        cursor_factory=RealDictCursor
    )
except Exception as e:
    print(f"Error creating connection pool: {e}")
    db_pool = None

def get_db_connection():
    """Get a connection from the pool"""
    try:
        if db_pool:
            connection = db_pool.getconn()
            return connection
        else:
            connection = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
            return connection
    except Exception as e:
        print(f"Error getting DB connection: {e}")
        return None

def return_db_connection(connection):
    """Return connection to the pool"""
    try:
        if db_pool and connection:
            db_pool.putconn(connection)
    except Exception as e:
        print(f"Error returning connection: {e}")

def close_pool():
    """Close all pool connections (call on app shutdown)"""
    try:
        if db_pool:
            db_pool.closeall()
    except Exception as e:
        print(f"Error closing pool: {e}")

class CacheItem:
    def __init__(self, data, ttl_seconds=300):
        self.data = data
        self.expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
    
    def is_expired(self):
        return datetime.now() > self.expires_at

query_cache = {}

def cache_get(key):
    """Get from cache if not expired"""
    if key in query_cache:
        item = query_cache[key]
        if not item.is_expired():
            return item.data
        else:
            del query_cache[key]
    return None

def cache_set(key, data, ttl_seconds=300):
    """Set cache with TTL"""
    query_cache[key] = CacheItem(data, ttl_seconds)

def cache_clear(pattern=None):
    """Clear cache by pattern or all"""
    if pattern is None:
        query_cache.clear()
    else:
        keys_to_delete = [k for k in query_cache.keys() if pattern in k]
        for k in keys_to_delete:
            del query_cache[k]
