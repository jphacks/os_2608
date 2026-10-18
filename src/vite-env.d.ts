/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 文章の判定を中継するサーバーのURL。未設定のときは文章入力を出さない
  readonly VITE_CONSULT_API_URL?: string
}
