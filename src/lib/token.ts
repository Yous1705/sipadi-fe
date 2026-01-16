export const token = {
  set(value: string) {
    document.cookie = `sipadi_token=${value}; path=/`;
  },

  get() {
    const match = document.cookie.match(/sipadi_token=([^;]+)/);
    return match?.[1];
  },

  clear() {
    document.cookie = "sipadi_token=; Max-Age=0; path=/";
  },
};
