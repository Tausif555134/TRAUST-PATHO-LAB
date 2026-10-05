/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOTLINE_PHONE?: string;
  readonly VITE_RAZORPAY_KEY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
