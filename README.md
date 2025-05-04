# AI Chatbot

Một chatbot AI đơn giản với backend FastAPI và frontend React.js, sử dụng Ollama để chạy các mô hình AI cục bộ.

******* Lưu ý: Sử dụng python 3.11

## Cài đặt

### Cách 1: Sử dụng Docker (Khuyến nghị)
1. Đảm bảo đã cài đặt Docker và Docker Compose
2. Cài đặt Ollama:
   - Windows: Tải và cài đặt từ [trang chủ Ollama](https://ollama.ai/download)
   - Linux/Mac: Chạy lệnh sau:
     ```bash
     curl -fsSL https://ollama.ai/install.sh | sh
     ```
3. Tải mô hình AI (ví dụ: gemma:2b):
   ```bash
   ollama pull gemma:2b # Bạn có thể dụng các model khác
   ```
4. Chạy lệnh sau từ thư mục gốc của dự án:
   ```bash
   docker-compose up --build
   ```

5. Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Cách 2: Cài đặt thủ công

#### Backend
1. Tạo môi trường ảo Python:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate
```

2. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

3. Chạy backend server:
```bash
uvicorn main:app --reload
```

#### Frontend
1. Cài đặt dependencies:
```bash
cd frontend
npm install
```

2. Chạy development server:
```bash
npm start
```

## Cấu trúc dự án
- `backend/`: Chứa code FastAPI
- `frontend/`: Chứa code React.js

## Docker Configuration
- `docker-compose.yml`: Cấu hình Docker Compose cho cả frontend và backend
- `frontend/Dockerfile`: Cấu hình Docker cho frontend React
- `backend/Dockerfile`: Cấu hình Docker cho backend FastAPI

### Các lệnh Docker hữu ích
- Build và chạy: `docker-compose up --build`
- Chạy ở chế độ nền: `docker-compose up -d --build`
- Dừng các container: `docker-compose down`
- Xem logs: `docker-compose logs -f`

## Sử dụng Ollama

### Các mô hình được hỗ trợ
- llama2
- mistral
- codellama
- phi
- gemma
- và nhiều mô hình khác...

### Các lệnh Ollama hữu ích
- Tải mô hình: `ollama pull <tên-mô-hình>`
- Xem danh sách mô hình đã tải: `ollama list`
- Xóa mô hình: `ollama rm <tên-mô-hình>`
- Chạy mô hình: `ollama run <tên-mô-hình>`

### Lưu ý
- Đảm bảo Ollama đang chạy trước khi khởi động ứng dụng
- Mô hình sẽ được tải xuống lần đầu tiên khi sử dụng
- Kiểm tra tài nguyên hệ thống trước khi tải các mô hình lớn

## Kiểm tra và Xử lý Lỗi

### Kiểm tra trạng thái hệ thống
1. Kiểm tra trạng thái Ollama:
   ```bash
   # Kiểm tra phiên bản Ollama
   ollama --version
   
   # Kiểm tra trạng thái dịch vụ Ollama
   systemctl status ollama  # Linux
   # hoặc kiểm tra trong Task Manager trên Windows
   ```

2. Kiểm tra trạng thái Docker:
   ```bash
   # Kiểm tra trạng thái các container
   docker ps
   
   # Kiểm tra logs của container cụ thể
   docker logs <container_id>
   
   # Kiểm tra tài nguyên Docker
   docker stats
   ```

3. Kiểm tra kết nối API:
   ```bash
   # Kiểm tra API backend
   curl http://localhost:8000/health
   
   # Kiểm tra API Ollama
   curl http://localhost:11434/api/version
   ```

### Xử lý lỗi thường gặp

1. Lỗi Ollama không khởi động:
   ```bash
   # Khởi động lại dịch vụ Ollama
   systemctl restart ollama  # Linux
   # hoặc khởi động lại ứng dụng Ollama trên Windows
   ```

2. Lỗi Docker container:
   ```bash
   # Xóa và tạo lại container
   docker-compose down
   docker-compose up --build
   
   # Xóa cache Docker
   docker system prune -a
   ```

3. Lỗi kết nối giữa frontend và backend:
   ```bash
   # Kiểm tra network Docker
   docker network ls
   
   # Kiểm tra kết nối giữa các container
   docker network inspect <network_name>
   ```

4. Lỗi mô hình Ollama:
   ```bash
   # Xóa và tải lại mô hình
   ollama rm <model_name>
   ollama pull <model_name>
   
   # Kiểm tra dung lượng mô hình
   ollama list
   ```

### Kiểm tra tài nguyên hệ thống
```bash
# Kiểm tra CPU và RAM
top  # Linux/Mac
# hoặc Task Manager trên Windows

# Kiểm tra dung lượng ổ đĩa
df -h  # Linux/Mac
# hoặc This PC trên Windows
```

### Lưu ý khi gặp lỗi
- Kiểm tra logs của từng service
- Đảm bảo đủ tài nguyên hệ thống
- Kiểm tra phiên bản của các thành phần
- Đảm bảo các port không bị chiếm dụng
- Kiểm tra kết nối mạng