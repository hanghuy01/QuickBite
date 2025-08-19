# 🍔 QuickBite – Food Delivery App

Mini GrabFood/UberEats: người dùng có thể duyệt nhà hàng, chọn món, đặt hàng và theo dõi đơn theo thời gian thực.

## 📦 Tech Stack

### Frontend (Expo React Native)

- Expo + Expo Router (navigation)
- React Native Paper (UI kit)
- Context API (Auth, Cart)
- Axios + @tanstack/react-query (API fetch + cache)
- react-hook-form + zod (form validation)
- expo-location (location user)

### Backend (NestJS)

- NestJS + TypeORM + PostgreSQL
- JWT Authentication (Access + Refresh)
- Passport-JWT
- class-validator + class-transformer (DTO validation)
- @nestjs/config (.env management)
- @nestjs/swagger (API docs)

---

## ⚡ Features

- **Auth**: Đăng ký, đăng nhập bằng JWT
- **Restaurants**: CRUD + menu items, hiển thị theo khoảng cách đến user
- **Cart**: Thêm món, tính tổng
- **Orders**: Tạo đơn, xem lịch sử
- **Tracking**: Nhận status update qua WebSocket
- **Profile**: Thông tin + lịch sử đơn
- **Role**: Admin, User

---

## 🚀 Getting Started

### 1. Clone repo

```bash
git clone https://github.com/hangduchuy/quickbite.git
cd quickbite
```
