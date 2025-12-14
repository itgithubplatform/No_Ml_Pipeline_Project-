"""
Application configuration using Pydantic Settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    PROJECT_NAME: str = "No-Code ML Pipeline Builder"
    VERSION: str = "1.0.0"
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # File Upload Settings
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB in bytes
    UPLOAD_DIR: str = "uploads"
    TEMP_DIR: str = "temp"
    ALLOWED_EXTENSIONS: List[str] = [".csv", ".xlsx", ".xls"]
    
    # ML Settings
    RANDOM_STATE: int = 42
    DEFAULT_TEST_SIZE: float = 0.3
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
