📁 Quickbite Client (Frontend - React Native)

📌 Project Overview

Quickbite là giao diện ứng dụng đặt đồ ăn nhanh: tìm kiếm nhà hàng(search, category, theo khoảng cách gần nhất), chọn món, thêm vào giỏ, đặt hàng và theo dõi trạng thái giao. Viết bằng React Native (Expo) với quản lý state, xác thực JWT(accessToken, refreshToken), và kết nối backend NestJS.

🚀 Setup & Run Instructions
Quickbite

1. Clone repo

git clone https://github.com/hangduchuy/Quickbite.git
cd Quickbite
cd Frontend

2. Cài đặt dependencies

node 22.18.0
yarn install

3. Cấu hình .env

EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

4. Khởi chạy dev

yarn start

⚖️ Decisions & Trade-offs

Dùng expo-router thay vì React Navigation để đơn giản hoá routing

Dùng Contex cho Cart/User state (nhẹ và dễ dùng)

Dùng @tanstack/react-query để quản lý API request & caching

Dùng zod kết hợp react-hook-form để validation chặt chẽ

Dùng AsyncStorage để lưu user, để hỗ trợ offline giỏ hàng

Dùng SecureStore để lưu refresh_token

Dùng expo-location để lấy vị trí người dùng (để biết được khoảng cách đến nhà hàng mà filter)

📘 Swagger / API Docs

Truy cập: http://localhost:3000/docs
