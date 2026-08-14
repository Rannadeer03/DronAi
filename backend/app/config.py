from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str
    supabase_service_role_key: str
    provision_api_key: str
    cors_origin: str = "http://localhost:3000"
    offline_timeout_seconds: int = 15
    arm_timeout_seconds: int = 5
    nonce_ttl_seconds: int = 30


settings = Settings()
