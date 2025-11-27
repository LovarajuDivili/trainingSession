from fastapi import APIRouter, Depends, HTTPException, Query
from app.utils.logs import get_security_logs
from app.utils.auth import verify_token
from fastapi.security import HTTPBearer
from app.helpers import get_system_logs

router = APIRouter(prefix="/logs", tags=["logs"])
security = HTTPBearer()

def get_current_user(credentials: HTTPBearer = Depends(security)):
    """Verify token and return user email"""
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    return email

@router.get("/system")
async def get_system_audit_logs(
    page: int = Query(0, ge=0, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: str = Query("", description="Search term"),
    current_user: str = Depends(get_current_user)
):
    """Get system audit logs"""
    try:
        result = get_system_logs(page=page, page_size=page_size, search=search)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching system logs: {str(e)}"
        )

@router.get("/security")
async def get_security_audit_logs(
    page: int = Query(0, ge=0, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: str = Query("", description="Search term"),
    current_user: str = Depends(get_current_user)
):
    """Get security audit logs"""
    try:
        result = get_security_logs(page=page, page_size=page_size, search=search)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching logs: {str(e)}"
        )