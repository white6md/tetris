# Hướng Dẫn Deploy Game Tetris Multiplayer

Bạn đã có phiên bản Tetris Multiplayer xịn xò! Dưới đây là cách đưa nó lên mạng và chơi cùng bạn bè.

## Bước 1: Upload Code lên GitHub (Như cũ)
Nếu bạn đã làm Bước 1 ở lần trước, bạn chỉ cần cập nhật code mới:

### Cách 1: Upload trực tiếp trên web
1. Vào repository GitHub của bạn.
2. Chọn **Add file** -> **Upload files**.
3. Kéo thả đè các file mới (`index.html`, `style.css`, `main.js`) vào.
4. Nhấn **Commit changes**.

### Cách 2: Dùng Git
```bash
git add .
git commit -m "Update multiplayer features"
git push
```

## Bước 2: Chơi Multiplayer như thế nào?
Sau khi deploy xong (hoặc mở file `index.html` trên máy), hãy làm như sau để chơi 2 người:

1.  **Người A (Chủ phòng)**:
    *   Nhấn nút **Create Room**.
    *   Copy mã ID hiện ra (ví dụ: `abc-123-xyz`).
    *   Gửi mã này cho Người B.

2.  **Người B (Khách)**:
    *   Nhập mã ID vào ô trống.
    *   Nhấn nút **Join**.

3.  **Kết nối thành công!**
    *   Màn hình bên trái là của BẠN.
    *   Màn hình bên phải là của ĐỐI THỦ (xem trực tiếp họ chơi).
    *   Ai sống sót lâu hơn và điểm cao hơn là người chiến thắng!

## Lưu ý
*   Game sử dụng công nghệ P2P (Peer-to-Peer) nên không cần server trung gian.
*   Tuy nhiên, nếu mạng của 1 trong 2 người chặn kết nối P2P (tường lửa công ty/trường học), có thể sẽ không kết nối được. Mạng gia đình/4G thường hoạt động tốt.
