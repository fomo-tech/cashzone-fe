# Skeleton Loader Guide

## Đã tạo Skeleton Component

File: `/src/components/ui/Skeleton.tsx`

## Các Component có sẵn

### 1. Skeleton (Base Component)
```tsx
import { Skeleton } from "@/components/ui/Skeleton";

<Skeleton variant="rectangular" width={200} height={100} />
<Skeleton variant="circular" width={50} height={50} />
<Skeleton variant="text" height={20} />
```

**Props:**
- `variant`: "text" | "circular" | "rectangular" (default: "rectangular")
- `width`: string | number
- `height`: string | number
- `animation`: "pulse" | "wave" | "none" (default: "pulse")
- `className`: string

### 2. SkeletonText
```tsx
import { SkeletonText } from "@/components/ui/Skeleton";

<SkeletonText lines={3} />
```

### 3. SkeletonCard
```tsx
import { SkeletonCard } from "@/components/ui/Skeleton";

<SkeletonCard />
```

### 4. SkeletonTable
```tsx
import { SkeletonTable } from "@/components/ui/Skeleton";

<SkeletonTable rows={5} columns={4} />
```

### 5. SkeletonList
```tsx
import { SkeletonList } from "@/components/ui/Skeleton";

<SkeletonList items={3} />
```

### 6. SkeletonPage (Full Page Skeleton)
```tsx
import { SkeletonPage } from "@/components/ui/Skeleton";

<SkeletonPage />
```

## Đã áp dụng vào

### ✅ TaskHistory Page
```tsx
import { SkeletonCard } from "@/components/ui/Skeleton";

{loading ? (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
) : (
  // Content
)}
```

## Cần áp dụng vào các page sau

### Pages chưa có skeleton:

1. **Cashback.tsx** - Hero section + form
2. **OfferTask.tsx** - Task list
3. **OfferDetail.tsx** - Task detail
4. **LeaderBoard.tsx** - Leaderboard table
5. **Referral.tsx** - Referral stats
6. **Profile.tsx** - User profile
7. **Setting.tsx** - Settings form
8. **Wallet.tsx** - Wallet cards
9. **CashbackHistory.tsx** - History list
10. **Notification.tsx** - Notification list
11. **Activities.tsx** - Activity cards
12. **Admin pages** - Tất cả admin pages

## Template áp dụng nhanh

### Cho List/Table Page:
```tsx
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";

{loading ? (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
) : (
  // Your content
)}
```

### Cho Detail Page:
```tsx
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

{loading ? (
  <div className="space-y-6">
    <Skeleton variant="rectangular" height={200} />
    <SkeletonText lines={5} />
    <div className="flex gap-4">
      <Skeleton variant="rectangular" height={40} width={120} />
      <Skeleton variant="rectangular" height={40} width={120} />
    </div>
  </div>
) : (
  // Your content
)}
```

### Cho Stats/Dashboard:
```tsx
import { Skeleton } from "@/components/ui/Skeleton";

{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6">
        <Skeleton variant="text" height={20} width="60%" className="mb-4" />
        <Skeleton variant="text" height={32} width="80%" />
      </div>
    ))}
  </div>
) : (
  // Your stats
)}
```

## Animation đã thêm vào Tailwind

File: `tailwind.config.ts`

```typescript
keyframes: {
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
},
animation: {
  shimmer: "shimmer 2s infinite",
},
```

## Best Practices

1. **Giữ skeleton giống với nội dung thật**
   - Sử dụng cùng layout và kích thước
   - Giữ nguyên spacing và padding

2. **Số lượng skeleton items**
   - List: 3-5 items
   - Table: 5-10 rows
   - Cards: 3-6 cards

3. **Animation**
   - `pulse`: Default, nhẹ nhàng
   - `wave`: Khi cần nổi bật hơn
   - `none`: Khi performance quan trọng

4. **Accessibility**
   - Đã có `role="status"` và `aria-label="Loading..."`

## Next Steps

1. Áp dụng skeleton vào tất cả pages có `loading` state
2. Customize skeleton cho từng page nếu cần
3. Test trên mobile và desktop
4. Optimize performance nếu có quá nhiều skeleton items
