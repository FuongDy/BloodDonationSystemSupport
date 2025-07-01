// src/hooks/API_HOOKS_USAGE.md

# 📚 API Hooks Usage Guide

## 🎯 Khi nào dùng hook nào?

### 1. `useApi` - **Recommended cho UI operations**
✅ **Dùng khi:**
- Cần hiển thị loading/success/error toast
- User actions (submit form, update data)  
- Cần feedback rõ ràng cho user

```javascript
// Ví dụ: Submit form với toast feedback
const { loading, request } = useApi(donationService.createRequest, {
  successMessage: 'Đã tạo yêu cầu hiến máu!',
  showToast: true
});

const handleSubmit = async (formData) => {
  try {
    await request(formData);
    navigate('/success');
  } catch (error) {
    // Error toast đã được hiển thị tự động
  }
};
```

```javascript
// Ví dụ: Silent API call (không toast)
const { loading, request } = useApi(userService.getProfile, {
  showToast: false,
  onSuccess: (data) => setUserData(data)
});
```

### 2. `useSimpleApi` - **Lightweight cho internal operations**
✅ **Dùng khi:**
- Background operations
- Data fetching im lặng
- Cần control hoàn toàn error handling
- Performance-critical operations

```javascript
// Ví dụ: Load data im lặng
const { loading, execute } = useSimpleApi();

useEffect(() => {
  execute(() => donationService.getHistory(), {
    onSuccess: (data) => setDonations(data),
    onError: (error) => console.log('Silent error:', error)
  });
}, []);
```

### 3. `useAsync` - **Cho complex async logic**
✅ **Dùng khi:**
- Cần track detailed states (idle, pending, success, error)
- Complex async workflows
- Conditional data loading

```javascript
// Ví dụ: Conditional loading with status tracking
const { data, status, execute, isLoading } = useAsync(
  () => bloodTypeService.getAll(),
  false // don't auto-execute
);

if (shouldLoadData) {
  execute();
}
```

## 🚀 Migration Examples

### Before (useApiWithStore - Complex):
```javascript
const { executeApi, isLoading } = useApiWithStore('donation');

const handleCreate = async () => {
  await executeApi(
    () => donationService.create(data),
    {
      successMessage: 'Created!',
      showSuccess: true,
      onSuccess: refreshData,
    }
  );
};
```

### After (useApi - Simple):
```javascript
const { loading, request } = useApi(donationService.create, {
  successMessage: 'Created!',
  onSuccess: refreshData
});

const handleCreate = () => request(data);
```

## 🎨 Advanced Patterns

### Pattern 1: Multi-step operations
```javascript
const { loading: saving, request: save } = useApi(donationService.update);
const { loading: deleting, request: remove } = useApi(donationService.delete);

const anyLoading = saving || deleting;
```

### Pattern 2: Conditional feedback
```javascript
const { request } = useApi(donationService.update, {
  showToast: !isDraft, // Only show toast for final save
  successMessage: isDraft ? undefined : 'Đã lưu thành công!'
});
```

### Pattern 3: Custom error handling
```javascript
const { request } = useApi(donationService.create, {
  showToast: false, // Handle errors manually
  onError: (error) => {
    if (error.status === 409) {
      showCustomModal('Conflict detected');
    } else {
      toast.error('Unexpected error');
    }
  }
});
```

## 📊 Performance Comparison

| Hook | Bundle Size | Overhead | Best For |
|------|-------------|----------|----------|
| `useSimpleApi` | ~1KB | Minimal | Background ops |
| `useApi` | ~2KB | Medium | UI interactions |  
| `useAsync` | ~3KB | Medium | Complex flows |
| `useApiWithStore` | ~5KB | High | ❌ Deprecated |

## 🎯 Best Practices

1. **Use `useApi` by default** cho user-facing operations
2. **Use `useSimpleApi`** cho background/silent operations  
3. **Always handle errors** - either via onError or try/catch
4. **Keep loading states local** - avoid global loading when possible
5. **Use meaningful messages** - customize success/error messages
6. **Avoid toast spam** - set showToast: false cho rapid operations
