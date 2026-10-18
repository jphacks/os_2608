# 文章での相談（Gemini）の準備手順

相談画面で文章を書くと、Gemini（Google のAI）がストレスの種類とつらさを判定します。
APIキーを公開ページに入れると誰でも見えてしまうため、キーを隠す小さな中継サーバー（Cloudflare Workers、無料）を置きます。

この手順をやらなくてもアプリは動きます（文章入力の欄が出ず、今までの選択肢だけになります）。

## 1. Gemini のAPIキーを作る

1. https://aistudio.google.com/ を Google アカウントでひらく。
2. 左のメニューの「Get API key」→「Create API key」を押して、キーを作る。
3. 表示されたキー（`AIza...` で始まる文字列）をコピーしておく。**他の人に見せない・GitHub に書かない**。
4. 課金設定（Set up billing）は**しなくてOK**です。しないあいだは無料枠のままで、上限に達してもエラーになるだけで請求は来ません。なお、無料枠では送った文章がGoogleのサービス改善に使われます。

## 2. Cloudflare に中継サーバーを置く

1. https://dash.cloudflare.com/sign-up でアカウントを作る（無料）。
2. 左のメニューの「Workers & Pages」→「Create」→「Create Worker」を選び、名前を `stress-consult` などにして「Deploy」を押す。
3. 「Edit code」を押し、もとのコードをすべて消して、このリポジトリの `worker/index.js` の中身をそのまま貼り付けて「Deploy」を押す。
4. Worker の「Settings」→「Variables and Secrets」で次の2つを追加する。
   - `GEMINI_API_KEY`: 種類は **Secret**。値は手順1でコピーしたキー。
   - `ALLOWED_ORIGIN`: 種類は Text。値は `https://jphacks.github.io`（末尾に `/` を付けない）。
5. Worker のページに出ている URL（`https://stress-consult.〇〇.workers.dev` の形）をコピーする。

## 3. アプリにURLを教える

1. GitHub のリポジトリの「Settings」→「Secrets and variables」→「Actions」→「Variables」タブを開く。
2. 「New repository variable」を押し、Name に `VITE_CONSULT_API_URL`、Value に手順2-5のURLを入れて保存する。
3. 「Actions」タブの「Deploy to GitHub Pages」を開き、「Run workflow」を押して公開しなおす。
4. 公開ページを開きなおすと、相談画面に文章の入力欄が出ます（古く見えるときはブラウザのキャッシュなので、更新してください）。

## 手元で試すとき

`.env.local` というファイルを作り、`VITE_CONSULT_API_URL=（手順2-5のURL）` と1行書いて `npm run dev` を実行します。手元の `http://localhost:5173` は Worker が許可しています。

## 回数の上限について

無料枠には1分あたり・1日あたりの回数上限があり、数字は AI Studio の画面（https://aistudio.google.com/rate-limit ）で見られます。上限に達するとアプリは「うまく聞き取れなかったよ」と出して、選択肢での相談に案内します。
