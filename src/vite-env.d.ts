/// <reference types="vite/client" />
declare const __BUILD_YEAR__: number;
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_ACADEMY_URL?: string;
}
