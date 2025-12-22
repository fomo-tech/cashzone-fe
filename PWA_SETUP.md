# PWA Setup Instructions

## Đã cài đặt PWA thành công! 🎉

### Các file đã tạo:

1. **public/manifest.json** - PWA manifest file với metadata
2. **public/service-worker.js** - Service worker cho offline support và caching
3. **src/utils/pwa.ts** - PWA utilities và helpers
4. **src/components/common/InstallPrompt.tsx** - Component hiển thị prompt cài đặt app
5. **src/components/common/OfflineIndicator.tsx** - Component hiển thị trạng thái offline

### Cần làm thêm:

#### 1. Cài đặt dependencies:
```bash
npm install vite-plugin-pwa workbox-window --save-dev
```

#### 2. Tạo icons:
Bạn cần tạo các icons với kích thước sau và đặt trong `public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Có thể sử dụng công cụ online như:
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/
- https://realfavicongenerator.net/

#### 3. Tạo screenshots (optional):
Đặt trong `public/screenshots/`:
- screenshot1.png (540x720)
- screenshot2.png (540x720)

#### 4. Cấu hình VAPID keys cho push notifications (nếu cần):
```bash
# Generate VAPID keys
npx web-push generate-vapid-keys
```

Sau đó cập nhật trong backend và sử dụng trong `subscribeToPush()`.

### Tính năng PWA đã có:

✅ **Offline Support** - App hoạt động offline với cache
✅ **Install Prompt** - Người dùng có thể cài đặt app lên màn hình chính
✅ **Push Notifications** - Ready for push notifications
✅ **Service Worker** - Auto-update và caching thông minh
✅ **Manifest** - Metadata đầy đủ cho PWA
✅ **Offline Indicator** - Hiển thị khi mất kết nối
✅ **App Shortcuts** - Quick actions từ home screen
✅ **Background Sync** - Ready for background sync

### Testing PWA:

1. **Development:**
```bash
npm run dev
```

2. **Production build:**
```bash
npm run build
npm run preview
```

3. **Chrome DevTools:**
- Mở DevTools > Application tab
- Kiểm tra Manifest, Service Workers, Cache Storage
- Test offline mode trong Network tab

4. **Lighthouse:**
- Chạy Lighthouse audit để kiểm tra PWA score
- Aim for 100/100 PWA score

### Deploy checklist:

- [ ] HTTPS enabled (bắt buộc cho PWA)
- [ ] All icons generated và đặt đúng folder
- [ ] Manifest.json có thông tin đúng
- [ ] Service worker được register thành công
- [ ] Test install prompt trên mobile
- [ ] Test offline functionality
- [ ] Test push notifications (nếu có)

### Browser Support:

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 16.4+)
- ✅ Firefox
- ✅ Samsung Internet
- ⚠️ Safari Desktop (limited PWA features)

Enjoy your PWA! 🚀
