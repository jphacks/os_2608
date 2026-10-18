# キューア

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2026/07/IMG_5316.png)](https://www.youtube.com/watch?v=piaNsc6ilBI)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
他社製品のアプリを見てみると、社会問題をゲームとして楽しめるようにすることで解決するという手法が見られます。
現代社会において、仕事や学業、人間関係、疲労など日常的なストレスは避けられません。
日常の小さなストレスの積み重ねに対して

【チームの実体験・動機をここに記入。例: 自分たちが実際にストレスを抱えた場面、周りの人の様子など】

そこで、ストレスの記録そのものを「ペットをかわいがる体験」にすれば、毎日気軽に続けられるのではないかと考え、このアプリを作りました。
### 製品説明（具体的な製品の説明）
### 特長
#### 1. 特長1
#### 2. 特長2
#### 3. 特長3

### 解決出来ること
### 今後の展望
### 注力したこと（こだわり等）
* 
* 

## 開発技術
### 活用した技術
#### API・データ
* Google Gemini API (`gemini-3.1-flash-lite`)
* Cloudflare Workers
* ブラウザの localStorage

#### フレームワーク・ライブラリ・モジュール
* React 19
* TypeScript
* Vite
* @fontsource/dotgothic16
* 素のCSS
* GitHub Actions
* GitHub Pages

#### デバイス
* スマートフォンのブラウザ('Safari')

### 独自技術
#### ハッカソンで開発した独自機能・技術
* **ストレス4系統の判定と集計** [src/growth.ts](src/growth.ts) / [worker/index.js](worker/index.js)
* **相談の画面**[src/screens/Consult.tsx](src/screens/Consult.tsx) / [src/choices.ts](src/choices.ts)
* **進化の色のくじ引き** [src/growth.ts](src/growth.ts)
* **親密度・お部屋** [src/affection.ts](src/affection.ts) / [src/rooms.ts](src/rooms.ts)
* **振り返り画面** [src/screens/Review.tsx](src/screens/Review.tsx) / [src/dayChart.ts](src/dayChart.ts)
* **ショップ** [src/shop.ts](src/shop.ts)
* **相談のクールタイム** [src/cooldown.ts](src/cooldown.ts)
* **チュートリアル** [src/screens/Tutorial.tsx](src/screens/Tutorial.tsx)
