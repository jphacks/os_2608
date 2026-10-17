# GitHub Pages で公開する手順

アプリは `main` ブランチに取り込まれるたびに、GitHub Actions が自動でビルドして公開します。
最初の1回だけ、次の設定を手作業で行ってください。

## 1. Pages の公開元を GitHub Actions にする

1. ブラウザで https://github.com/jphacks/os_2608 を開く
2. 上部の **Settings** を開く
   - Settings が表示されない場合は、リポジトリの管理権限がありません。jphacks の運営またはチームの管理者に依頼してください。
3. 左メニューの **Pages** を開く
4. **Build and deployment** の **Source** を **GitHub Actions** に変更する（保存ボタンはなく、選んだ時点で反映されます）

## 2. 公開を実行する

- PR を `main` にマージすると自動で公開されます。
- すでにマージ済みで公開を手動でやり直したいとき:
  1. 上部の **Actions** を開く
  2. 左の **Deploy to GitHub Pages** を選ぶ
  3. 右の **Run workflow** → **Run workflow** を押す

## 3. 公開されたか確認する

1. **Actions** で **Deploy to GitHub Pages** の最新の実行が緑のチェックになっていることを確認する
2. https://jphacks.github.io/os_2608/ をスマホで開く

## うまくいかないとき

- Actions が赤くなっている: 実行を開いて、赤い行のログをそのまま Claude に貼ってください。
- `deploy` で「Pages が有効になっていない」旨のエラー: 手順1が反映されていません。もう一度確認してください。
- 組織の設定で Pages や Actions が禁止されている場合は、jphacks の運営に確認が必要です。
