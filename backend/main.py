from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

# Khởi tạo FastAPI
app = FastAPI(
    title="Chatbot API với Ollama",
    description="Backend cho ứng dụng chatbot sử dụng Ollama model",
    version="1.0.0"
)

# Cấu hình CORS - ĐẢM BẢO DÒNG NÀY ĐỨNG SAU KHI app ĐƯỢC ĐỊNH NGHĨA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cho phép frontend trên cổng 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model cho request/response
class Message(BaseModel):
    role: str  # 'user' hoặc 'assistant'
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "gemma:2b"  # Model mặc định
    stream: bool = False  # Có stream response hay không
    options: Optional[dict] = None  # Các tùy chọn bổ sung

class ChatResponse(BaseModel):
    message: Message
    model: str
    created_at: str
    done: bool
    total_duration: Optional[int] = None

# Kiểm tra kết nối Ollama
@app.get("/ping")
async def ping():
    try:
        response = ollama.list()
        return {"status": "success", "models": response.get('models', [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Lấy danh sách model có sẵn
@app.get("/models")
async def get_models():
    try:
        response = ollama.list()
        return {"models": response.get('models', [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint chat chính
@app.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest):
    try:
         # Thêm system message để chỉ định ngôn ngữ
        vietnamese_system_message = {
            "role": "system",
            "content": "Bạn là trợ lý AI. Luôn trả lời bằng tiếng Việt nếu người dùng hỏi bằng tiếng Việt."
        }

        # Chuyển đổi messages sang định dạng Ollama
        messages = [vietnamese_system_message] + [{"role": msg.role, "content": msg.content} for msg in chat_request.messages]
        
        # Gọi model
        response = ollama.chat(
            model=chat_request.model,
            messages=messages,
            stream=chat_request.stream,
            options={
                "temperature": 0.7,
                "num_ctx": 2048
            }
        )
        
        if chat_request.stream:
            raise HTTPException(status_code=400, detail="Streaming chưa được hỗ trợ trong ví dụ này")
        
        return {
            "message": Message(role=response['message']['role'], content=response['message']['content']),
            "model": response['model'],
            "created_at": response['created_at'],
            "done": response['done'],
            "total_duration": response.get('total_duration')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pull model từ Ollama
@app.post("/models/pull")
async def pull_model(model: str):
    try:
        response = ollama.pull(model)
        return {"status": "success", "details": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)