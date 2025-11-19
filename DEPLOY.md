# Hướng Dẫn Deploy Game Tetris Lên GitHub Pages

Bạn đã có code game Tetris hoàn chỉnh. Bây giờ hãy làm theo các bước sau để đưa nó lên mạng internet miễn phí bằng GitHub Pages.

## Bước 1: Tạo Repository trên GitHub
1. Đăng nhập vào [GitHub](https://github.com).
2. Nhấn vào dấu **+** ở góc trên bên phải -> chọn **New repository**.
3. Đặt tên cho repository (ví dụ: `tetris-game`).
4. Chọn **Public**.
5. Nhấn **Create repository**.

## Bước 2: Upload Code lên GitHub
Bạn có thể dùng Git hoặc upload trực tiếp trên web.

### Cách 1: Upload trực tiếp trên web (Dễ nhất)
1. Trong trang repository vừa tạo, nhấn vào link **uploading an existing file**.
2. Kéo thả toàn bộ các file trong thư mục `tetris` của bạn (`index.html`, `style.css`, `main.js`) vào khung upload.
3. Đợi upload xong, kéo xuống dưới và nhấn nút **Commit changes**.

### Cách 2: Dùng Git (Nếu bạn đã cài Git)
Mở terminal tại thư mục `tetris` và chạy các lệnh sau:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/tetris-game.git
git push -u origin main
```
*(Thay `USERNAME` bằng tên tài khoản GitHub của bạn)*

## Bước 3: Bật GitHub Pages
1. Vào tab **Settings** của repository.
2. Ở menu bên trái, chọn mục **Pages**.
3. Tại phần **Build and deployment** > **Branch**, chọn `main` (hoặc `master`) và folder là `/(root)`.
4. Nhấn **Save**.

## Bước 4: Tận hưởng thành quả
Đợi khoảng 1-2 phút, refresh lại trang Settings > Pages. Bạn sẽ thấy một đường link hiện ra (ví dụ: `https://username.github.io/tetris-game/`).
Nhấn vào link đó để chơi game và chia sẻ cho bạn bè!
