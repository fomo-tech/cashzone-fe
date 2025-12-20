# Hướng Dẫn Sử Dụng Đa Ngôn Ngữ (i18n)

## Cài Đặt

Dự án đã được cài đặt sẵn:
- `i18next`: Core library
- `react-i18next`: React bindings
- `i18next-browser-languagedetector`: Tự động phát hiện ngôn ngữ

## Cấu Trúc

```
src/
├── i18n.ts                    # Cấu hình i18n
├── locales/
│   ├── en.json               # Bản dịch tiếng Anh
│   └── vi.json               # Bản dịch tiếng Việt
└── components/
    └── common/
        └── LanguageSwitcher.tsx  # Component chuyển đổi ngôn ngữ
```

## Cách Sử Dụng

### 1. Import useTranslation hook

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <div>{t('common.welcome')}</div>;
};
```

### 2. Sử dụng translations

```tsx
// Text đơn giản
<h1>{t('nav.home')}</h1>

// Trong attributes
<button title={t('common.save')}>
  {t('common.save')}
</button>

// Với variables (interpolation)
<p>{t('wallet.amount', { value: 1000 })}</p>
```

### 3. Thêm translations mới

**Trong `locales/vi.json`:**
```json
{
  "mySection": {
    "title": "Tiêu đề của tôi",
    "description": "Mô tả chi tiết"
  }
}
```

**Trong `locales/en.json`:**
```json
{
  "mySection": {
    "title": "My Title",
    "description": "Detailed description"
  }
}
```

**Sử dụng:**
```tsx
<h1>{t('mySection.title')}</h1>
<p>{t('mySection.description')}</p>
```

## Component LanguageSwitcher

Đã được thêm vào Header. Component này:
- Hiển thị ngôn ngữ hiện tại
- Cho phép chuyển đổi giữa tiếng Việt và tiếng Anh
- Lưu lựa chọn vào localStorage
- Có dropdown với icon cờ quốc gia

### Sử dụng trong component khác:

```tsx
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const MyLayout = () => (
  <header>
    <LanguageSwitcher />
  </header>
);
```

## Translation Keys Đã Có

### Common
- `common.welcome` - Chào mừng / Welcome
- `common.login` - Đăng nhập / Login
- `common.logout` - Đăng xuất / Logout
- `common.save` - Lưu / Save
- `common.cancel` - Hủy / Cancel
- `common.delete` - Xóa / Delete
- `common.edit` - Sửa / Edit

### Navigation
- `nav.home` - Trang chủ / Home
- `nav.wallet` - Ví / Wallet
- `nav.referral` - Giới thiệu / Referral
- `nav.profile` - Hồ sơ / Profile

### Auth
- `auth.login` - Đăng nhập / Login
- `auth.signup` - Đăng ký / Sign Up
- `auth.email` - Email
- `auth.password` - Mật khẩu / Password

### Status
- `status.pending` - Chờ duyệt / Pending
- `status.approved` - Đã duyệt / Approved
- `status.completed` - Hoàn thành / Completed

### Messages
- `messages.saveSuccess` - Lưu thành công / Saved successfully
- `messages.confirmDelete` - Bạn có chắc muốn xóa? / Are you sure?

## Lưu Ý Quan Trọng

1. **Fallback Language**: Mặc định là tiếng Việt (`vi`)
2. **Persistence**: Ngôn ngữ được lưu trong localStorage
3. **Key Naming**: Sử dụng format `section.key` (snake_case)
4. **Consistency**: Đảm bảo tất cả keys có trong cả 2 file en.json và vi.json

## Cập Nhật Components Hiện Tại

### Trước:
```tsx
<button>Đăng nhập</button>
```

### Sau:
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <button>{t('auth.login')}</button>;
};
```

## Thêm Ngôn Ngữ Mới

1. Tạo file `locales/[lang-code].json`
2. Copy structure từ `vi.json` hoặc `en.json`
3. Thêm vào `i18n.ts`:

```typescript
import newLang from "./locales/new-lang.json";

i18n.init({
  resources: { 
    en: { translation: en }, 
    vi: { translation: vi },
    'new-lang': { translation: newLang }
  },
  // ...
});
```

4. Thêm vào `LanguageSwitcher.tsx`:

```typescript
const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "new-lang", name: "New Language", flag: "🏳️" },
];
```

## Best Practices

1. ✅ Luôn sử dụng translation keys thay vì hardcode text
2. ✅ Đặt tên keys có ý nghĩa và nhất quán
3. ✅ Nhóm các translations theo chức năng/trang
4. ✅ Test cả 2 ngôn ngữ sau khi thêm translations mới
5. ❌ Không để text cứng trong JSX
6. ❌ Không trộn lẫn tiếng Việt và tiếng Anh trong cùng 1 component

## Debug

Xem ngôn ngữ hiện tại:
```tsx
const { i18n } = useTranslation();
console.log('Current language:', i18n.language);
```

Thay đổi ngôn ngữ programmatically:
```tsx
i18n.changeLanguage('en');
```

## Hỗ Trợ

Nếu có vấn đề với translations:
1. Kiểm tra key có tồn tại trong file JSON không
2. Xem console có lỗi i18next không
3. Clear localStorage và reload trang
4. Kiểm tra import `i18n.ts` trong `main.tsx`
