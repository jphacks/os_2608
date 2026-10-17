# 手元で動かす手順（開発者向け）

必要なもの: Node.js 22 以上

```sh
npm install
npm run dev
```

表示された URL（例: http://localhost:5173/os_2608/ ）をブラウザで開きます。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発用サーバーを起動 |
| `npm run build` | 型チェックと本番用ビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |

保存データはブラウザの localStorage に入ります。消したいときは、ブラウザの開発者ツールでこのサイトのデータを削除してください。
