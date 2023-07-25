<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">MultiGPT</h1>

<div align="center">

### MultiGPT はオールインワンのチャットボットクライアントです

[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]    
    
[English](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; 日本語

##    
    
### インストール
    
<a href="https://chrome.google.com/webstore/detail"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="Chromium 用の MultiGPT を入手してください"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="Microsoft Edge 用の MultiGPT を入手してください"></a>
    
##

[スクリーンショット](#-スクリーンショット) &nbsp;&nbsp;|&nbsp;&nbsp; [特徴](#-特徴) &nbsp;&nbsp;|&nbsp;&nbsp; [サポートされているボット](#-サポートされているボット) &nbsp;&nbsp;|&nbsp;&nbsp; [手動インストール](#-手動インストール) &nbsp;&nbsp;|&nbsp;&nbsp; [ソースからビルドする](#-ソースからビルドする) &nbsp;&nbsp;|&nbsp;&nbsp; [変更ログ](#-変更ログ)

[author-image]: https://img.shields.io/badge/author-wong2-blue.svg
[author-url]: https://github.com/wong2    
[license-image]: https://img.shields.io/github/license/ishandutta2007/MultiGPT?color=blue
[license-url]: https://github.com/SingularityLabs-ai/MultiGPT/blob/main/LICENSE
[release-image]: https://img.shields.io/github/v/release/ishandutta2007/MultiGPT?color=blue
[release-url]: https://github.com/SingularityLabs-ai/MultiGPT/releases/latest
[last-commit-image]: https://img.shields.io/github/last-commit/ishandutta2007/MultiGPT?label=last%20commit
[last-commit-url]: https://github.com/SingularityLabs-ai/MultiGPT/commits

</div>

##

## 📷 スクリーンショット

![Screenshot](screenshots/light_1280x800.png?raw=true)

![Screenshot (Dark Mode)](screenshots/dark_1280x800.png?raw=true)


## ✨ 特徴

- 🤖 アプリ内で異なるチャットボットを使用します。現在は ChatGPT、新しい Bing Chat、Google Bard、Claude（Poe 経由）、Alpaca、Vicuna、ChatGLM をサポートしており、将来的にはさらに統合されます
- 💬 複数のチャットボットと同時にチャットすることで、回答を比較しやすくします
- 🚀 ChatGPT API および GPT-4 Browsing をサポートします
- 🔍 ブラウザのどこからでもアプリを素早くアクティブにするためのショートカット
- 🎨 Markdown とコードのハイライトのサポート
- 📚 カスタムプロンプトとコミュニティプロンプトのためのプロンプトライブラリ
- 💾 ローカルに保存された会話履歴
- 📥 データのエクスポートとインポート
- 🔗 マークダウン形式で会話を共有
- 🌙 ダークモード

## 🤖 サポートされているボット

* ChatGPT（Web アプリ/API/Azure/Poe経由）
* Bing Chat
* Google Bard
* Claude（Poe 経由）
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* ...

## 🔧 手動インストール

- [リリース](https://github.com/SingularityLabs-ai/GrandGPT/releases)から MultiGPT.zip をダウンロード
- ファイルを解凍
- Chrome/Edge で拡張機能ページに移動します (chrome://extensions または edge://extensions)
- 開発者モードを有効にする
- 解凍したフォルダーをページ上の任意の場所にドラッグしてインポートします (後でフォルダーを削除しないでください)

## 🔨 ソースからビルドする

- ソースコードをクローン
- `yarn install`
- `yarn build`
- _マニュアルインストール_ の手順に従って、`dist` _フォルダをブラウザに読み込みます_

### クレジット

このプロジェクトのインスピレーションとなったのは、 https://github.com/ZohaibAhmed/ChatGPT-Google , https://github.com/wong2/chatgpt-google-extension
