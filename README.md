## Sale Boost Server

Backend Node.js/Express dùng MongoDB cho ứng dụng Sale Boost.

- **Framework**: Express
- **CSDL**: MongoDB (qua Mongoose)
- **View engine**: EJS (trang `privacy-policy`)
- **API prefix**: tất cả API nằm dưới `/api`
  - `/api/site`
  - `/api/webhook`
  - `/api/packages`
  - `/api/question-history`

---

## 1. Chuẩn bị môi trường

- **Docker Desktop** đã cài và đang chạy trên máy (Windows / macOS).
- Một **MongoDB** đang chạy (local hoặc cloud, ví dụ MongoDB Atlas) và bạn có **connection string**.

---

## 2. Cấu hình biến môi trường

Trong thư mục `sale-boost-server`, tạo file `.env`:

```bash
MONGO_URI=mongodb+srv://username:password@cluster-url/db-name
PORT=3000
PUBLIC_KEY=your_webhook_public_key   # (tùy chọn, nếu dùng webhook)
```

- **MONGO_URI**: bắt buộc, URL kết nối MongoDB.
- **PORT**: tùy chọn, mặc định trong code là `3000` nếu không khai báo.
- **PUBLIC_KEY**: tùy chọn, dùng cho xác thực webhook nếu cần.

> Lưu ý: File `.env` **không** cần copy vào image; Docker sẽ nạp biến môi trường khi chạy container bằng flag `--env-file`.

---

## 3. Build image với Docker

Trong thư mục `sale-boost-server`, chạy:

```bash
docker build -t sale-boost-server .
```

Giải thích:

- `-t sale-boost-server`: đặt tên image là `sale-boost-server`.
- `.`: dùng `Dockerfile` trong thư mục hiện tại.

---

## 4. Chạy container bằng Docker Desktop (docker run)

Sau khi build xong image, chạy container:

```bash
docker run \
  --name sale-boost-server \
  -p 3000:3000 \
  --env-file .env \
  sale-boost-server
```

Giải thích các tham số chính:

- **`--name sale-boost-server`**: đặt tên container (dễ quản lý trong Docker Desktop).
- **`-p 3000:3000`**: map cổng `3000` của host vào cổng `3000` trong container (đúng với `EXPOSE 3000` và `PORT` server).
- **`--env-file .env`**: nạp tất cả biến môi trường từ file `.env` (trong thư mục hiện tại) vào container.
- **`sale-boost-server`**: tên image đã build ở bước trước.

Sau khi container chạy thành công:

- Mở trình duyệt vào: `http://localhost:3000/privacy` để xem trang Privacy Policy.
- Các API có tiền tố `/api`, ví dụ: `http://localhost:3000/api/site`.

---

## 5. Chạy seed dữ liệu (tùy chọn)

Trong project có script seed package (`scripts/seedPackages.js`) định nghĩa trong `package.json`:

```json
"scripts": {
  "seed:packages": "node scripts/seedPackages.js"
}
```

Nếu muốn chạy seed **bên trong container**, có thể:

1. Mở một shell trong container:

   ```bash
   docker exec -it sale-boost-server sh
   ```

2. Trong shell của container, chạy:

   ```bash
   npm run seed:packages
   ```

---

## 6. Tóm tắt nhanh lệnh cần nhớ

- **Build image**:

  ```bash
  docker build -t sale-boost-server .
  ```

- **Chạy container**:

  ```bash
  docker run --name sale-boost-server -p 3000:3000 --env-file .env sale-boost-server
  ```

- **Xem log container**:

  ```bash
  docker logs -f sale-boost-server
  ```

- **Dừng container**:

  ```bash
  docker stop sale-boost-server
  ```

- **Xóa container**:

  ```bash
  docker rm sale-boost-server
  ```
