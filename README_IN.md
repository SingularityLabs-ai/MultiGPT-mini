<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">MultiGPT</h1>

<div align="center">

### MultiGPT adalah klien chatbot

[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]  

[Inggris](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; Indonesia &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md)

##    
    
### Instal
    
<a href="https://chrome.google.com/webstore/detail"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="Dapatkan MultiGPT untuk Chromium"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="Dapatkan MultiGPT untuk Microsoft Edge"></a>
    
##

[Tangkapan Layar](#-tangkapan-layar) &nbsp;&nbsp;|&nbsp;&nbsp; [Fitur](#-fitur) &nbsp;&nbsp;|&nbsp;&nbsp; [Bot yang Didukung](#-supported-bots) &nbsp;&nbsp;|&nbsp;&nbsp; [Instalasi Manual](#-instalasi-manual) &nbsp;&nbsp;|&nbsp;&nbsp; [Membangun dari Source](#-membangun-dari-source) &nbsp;&nbsp;|&nbsp;&nbsp; [Changelog](#-changelog)
    
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

## 📷 Tangkapan Layar

![Tangkapan Layar](screenshots/light_1280x800.png?raw=true)

![Tangkapan Layar (Mode Gelap)](screenshots/dark_1280x800.png?raw=true)

## ✨ Fitur

- 🤖 Gunakan chatbot yang berbeda dalam satu aplikasi, saat ini mendukung ChatGPT, Bing Chat yang baru, Claude (melalui Poe), Alpaca, Vicuna, ChatGLM,  dan akan mengintegrasikan lebih banyak di masa depan
- 💬 Chat dengan beberapa chatbot secara bersamaan, sehingga mudah untuk membandingkan jawaban mereka
- 🚀 Mendukung API ChatGPT dan Browsing GPT-4
- 🔍 Pintasan untuk dengan cepat mengaktifkan aplikasi di mana saja di browser
- 🎨 Mendukung penyorotan markdown dan kode
- 📚 Perpustakaan Prompt untuk prompt kustom dan prompt komunitas
- 💾 Riwayat percakapan tersimpan secara lokal
- 📥 Ekspor dan Impor semua data Anda
- 🔗 Bagikan percakapan ke markdown
- 🌙 Mode gelap

## 🤖 Bot yang Didukung

* ChatGPT (melalui Webapp/API/Azure/Poe)
* Bing Chat
* Google Bard
* Claude (melalui Poe)
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* ...

## 🔧 Instalasi Manual

- Unduh grandgpt.zip dari [Release](https://github.com/SingularityLabs-ai/GrandGPT/releases)
- Ekstrak file
- Di Chrome/Edge, buka halaman ekstensi (chrome://extensions atau edge://extensions)
- Aktifkan Mode Pengembang
- Seret folder yang telah diekstrak ke mana saja di halaman untuk mengimpor (jangan hapus folder setelah itu)

## 🔨 Membangun dari Source

- Clone source code
- `yarn install`
- `yarn build`
- Muat folder `dist` ke browser dengan mengikuti langkah-langkah dalam _Instalasi Manual_

### Kredit

Proyek ini terinspirasi oleh https://github.com/ZohaibAhmed/ChatGPT-Google , https://github.com/wong2/chatgpt-google-extension
