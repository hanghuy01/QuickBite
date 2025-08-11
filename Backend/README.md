📁 Quickbite API (Backend - NestJS)

📌 Project Overview

Quickbite API là hệ thống quản lý công việc với xác thực người dùng dựa trên JWT. API hỗ trợ các chức năng CRUD cho có xác thực, phân quyền, validation bằng class-validator và tài liệu API bằng Swagger.

🚀 Setup & Run Instructions
Quickbite

1. Clone repo

git clone https://github.com/hangduchuy/Quickbite.git
cd Quickbite
cd Backend

2. Cài đặt dependencies

npm install

3. Cấu hình .env

# Database config

DATABASE_TYPE=postgres
DATABASE_URL=postgresql://postgres:123123@localhost:5434/quickbite

JWT_SECRET=hangduchuy
JWT_ACCESS_TOKEN_EXPIRED=1d
PORT=3000
FRONTEND_URL=http://localhost:5173

4. Khởi chạy dev

yarn start:dev

⚖️ Decisions & Trade-offs

Dùng PostgreSQL và đang dùng docker để chạy postpgre.

Dùng class-validator để đảm bảo dữ liệu đầu vào đúng chuẩn.

Dùng JWT để hỗ trợ xác thực đơn giản, dễ mở rộng.

📘 Swagger / API Docs

Truy cập: http://localhost:3000/docs
