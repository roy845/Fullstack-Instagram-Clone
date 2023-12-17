from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URI: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    EMAIL_ADDRESS: str
    EMAIL_PASSWORD: str

    class Config:
        env_file = ".env"


settings = Settings()
