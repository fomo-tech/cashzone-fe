// Utility để quản lý referral code trong session

const REFERRAL_CODE_KEY = "pending_referral_code";

export const referralCodeUtils = {
  // Lưu referral code vào sessionStorage
  save: (code: string) => {
    if (code) {
      sessionStorage.setItem(REFERRAL_CODE_KEY, code);
    }
  },

  // Lấy referral code từ sessionStorage
  get: (): string | null => {
    return sessionStorage.getItem(REFERRAL_CODE_KEY);
  },

  // Xóa referral code (sau khi đăng ký thành công)
  clear: () => {
    sessionStorage.removeItem(REFERRAL_CODE_KEY);
  },

  // Lấy referral code từ URL hoặc sessionStorage
  getFromUrlOrStorage: (): string | null => {
    const params = new URLSearchParams(window.location.search);
    const urlRef = params.get("ref") || params.get("referralCode");

    if (urlRef) {
      // Nếu có trong URL, lưu vào storage
      referralCodeUtils.save(urlRef);
      return urlRef;
    }

    // Nếu không có trong URL, lấy từ storage
    return referralCodeUtils.get();
  },
};
