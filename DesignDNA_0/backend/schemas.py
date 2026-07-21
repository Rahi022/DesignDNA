from typing import Optional, Literal
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# =====================================================
# USER REGISTER REQUEST
# =====================================================

class UserCreate(BaseModel):

    name: str = Field(min_length=2, max_length=100)

    email: EmailStr

    password: str = Field(min_length=8, max_length=128)


# =====================================================
# USER LOGIN REQUEST
# =====================================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# =====================================================
# USER RESPONSE
# =====================================================

class UserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: Literal["user", "admin"]

    is_active: bool

    is_verified: bool = False

    avatar_url: Optional[str] = None

    created_at: datetime

    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# =====================================================
# ADMIN USER DETAILS
# =====================================================

class AdminUserResponse(BaseModel):

    id: int

    name: str

    email: EmailStr

    role: str

    is_active: bool

    created_at: datetime

    class Config:
        from_attributes = True


# =====================================================
# ROLE UPDATE
# =====================================================

class ChangeRoleRequest(BaseModel):

    role: str


# =====================================================
# USER STATUS
# =====================================================

class UserStatusResponse(BaseModel):

    message: str

    is_active: bool


# =====================================================
# ROLE RESPONSE
# =====================================================

class RoleResponse(BaseModel):

    message: str

    role: str


# =====================================================
# ANALYSIS RESPONSE
# =====================================================

class AnalysisResponse(BaseModel):

    id: int

    user_id: int

    image_name: str

    image_path: str

    score: int

    brightness: float

    contrast: float

    sharpness: float

    edge_density: float

    whitespace: float

    created_at: datetime

    class Config:
        from_attributes = True


# =====================================================
# JWT TOKEN RESPONSE
# =====================================================

class Token(BaseModel):

    access_token: str

    refresh_token: Optional[str] = None

    token_type: str = "bearer"

    expires_in: Optional[int] = None


# =====================================================
# JWT TOKEN DATA
# =====================================================

class TokenData(BaseModel):

    email: Optional[str] = None

    role: Optional[str] = None

# =====================================================
# LOGO REQUEST
# =====================================================

class LogoGenerateRequest(BaseModel):

    prompt: str

    style: str = "Modern"

    negative_prompt: Optional[str] = None

    colors: Optional[list[str]] = None


# =====================================================
# LOGO RESPONSE
# =====================================================

class LogoResponse(BaseModel):

    id: int

    prompt: str

    style: str

    image_path: str

    created_at: datetime

    download_count: int = 0

    is_favorite: bool = False

    class Config:
        from_attributes = True


class UserStatsResponse(BaseModel):

    logos_generated: int

    logos_analyzed: int

    downloads: int

    favorites: int


class DashboardStatsResponse(BaseModel):

    total_users: int

    active_users: int

    total_logos: int

    total_analyses: int


class ChangePasswordRequest(BaseModel):

    current_password: str

    new_password: str = Field(min_length=8)


class UpdateProfileRequest(BaseModel):

    name: Optional[str] = None

    avatar_url: Optional[str] = None


class GoogleLoginRequest(BaseModel):

    credential: str


class MessageResponse(BaseModel):

    message: str