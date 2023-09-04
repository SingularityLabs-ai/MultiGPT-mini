<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">MultiGPT</h1>

<div align="center">

### MultiGPT is a multi-chatbot

[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]

English &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md)

##

### Install

<a href="https://chrome.google.com/webstore/detail/"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="Get MultiGPT for Chromium"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="Get MultiGPT for Microsoft Edge"></a>

##

[Screenshot](#-screenshot) &nbsp;&nbsp;|&nbsp;&nbsp; [Features](#-features) &nbsp;&nbsp;|&nbsp;&nbsp; [Supported Bots](#-supported-bots) &nbsp;&nbsp;|&nbsp;&nbsp; [Manual Installation](#-manual-installation) &nbsp;&nbsp;|&nbsp;&nbsp; [Build from Source](#-build-from-source) &nbsp;&nbsp;|&nbsp;&nbsp; [Changelog](#-changelog)

[author-image]: https://img.shields.io/badge/author-wong2-blue.svg
[author-url]: https://github.com/wong2
[license-image]: https://img.shields.io/github/license/ishandutta2007/MultiGPT?color=blue
[license-url]: https://github.com/SingularityLabs-ai/MultiGPT/blob/main/LICENSE
[release-image]: https://img.shields.io/github/v/release/ishandutta2007/MultiGPT?color=blue
[release-url]: https://github.com/SingularityLabs-ai/MultiGPT/releases/latest
[last-commit-image]: https://img.shields.io/github/last-commit/ishandutta2007/MultiGPT?label=last%20commit
[last-commit-url]: https://github.com/SingularityLabs-ai/MultiGPT/commits

</div>

## Todo

- cohere https://dashboard.cohere.com/playground/generate
- Small_Talk https://developer.kore.ai/docs/bots/bot-builder-tool/small-talk/#Import_Small_Talk
- perplexity.ai
- openrouter.ai
- forefront.ai domain specific bots
- chatgpt and dall e via beta.theb.ai
- deepai.org
- sdk.vercel.ai (have multiple bots like poe)
- Midjourney alternative editor.fusionbrain.ai
- chatgpt via https://chat.acytoo.com
- https://apps.apple.com/app/id6446304087

### GPT4
- GPT4 via liaobots.com
- GPT4 via https://gpt4h.ninvfeng.xyz/
- gpt4 xunika

### Bing(GPT4)
- Bing via hf4all-bingo.hf.space

### GPT3.5
- LAION AI H2oGPT https://gpt-gm.h2o.ai/conversation/
- gptgod
- easy chat openai https://chat9.fastgpt.me/
- GPT3.5 via chat.chatgptdemo.net
- chatgpt via ai.ls
- chatgpt via https://e.aifree.site/
- chatgpt via https://h.aifree.site/
- GPT3.5 via https://chats.free2gpt.xyz/
- GPT3 via https://pizzagpt.it/
- GPT3 via powerchat.top


- slack bots CLAUDE_BOT_ID = ['U05J5M9E7MZ','U05J74AT9DL','U05J79DQC0N']


## Models

### gpt-3.5 / gpt-4

| Website| Provider| gpt-3.5 | gpt-4 | Stream | Status | Auth |
| --- | --- | --- | --- | --- | --- | --- |
| [ai.ls](https://ai.ls) | `g4f.Provider.Ails` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [you.com](https://you.com) | `g4f.Provider.You` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [bing.com](https://bing.com/chat) | `g4f.Provider.Bing` | ❌ | ✔️ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chat9.yqcloud.top](https://chat9.yqcloud.top/) | `g4f.Provider.Yqcloud` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [theb.ai](https://theb.ai) | `g4f.Provider.Theb` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [chat-gpt.org](https://chat-gpt.org/chat) | `g4f.Provider.Aichat` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [bard.google.com](https://bard.google.com) | `g4f.Provider.Bard` | ❌ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ✔️ |
| [play.vercel.ai](https://play.vercel.ai) | `g4f.Provider.Vercel` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [forefront.com](https://forefront.com) | `g4f.Provider.Forefront` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [supertest.lockchat.app](http://supertest.lockchat.app) | `g4f.Provider.Lockchat` | ✔️ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [liaobots.com](https://liaobots.com) | `g4f.Provider.Liaobots` | ✔️ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ✔️ |
| [gpt-gm.h2o.ai](https://gpt-gm.h2o.ai) | `g4f.Provider.H2o` | ❌ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chatgptlogin.ac](https://chatgptlogin.ac) | `g4f.Provider.ChatgptLogin` | ✔️ | ❌ | ❌ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [deepai.org](https://deepai.org) | `g4f.Provider.DeepAi` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chat.getgpt.world](https://chat.getgpt.world/) | `g4f.Provider.GetGpt` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [www.aitianhu.com](https://www.aitianhu.com/api/chat-process) | `g4f.Provider.AItianhu` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [free.easychat.work](https://free.easychat.work) | `g4f.Provider.EasyChat` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chat.acytoo.com](https://chat.acytoo.com/api/completions) | `g4f.Provider.Acytoo` | ✔️ | ❌ | ❌ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [chat.dfehub.com](https://chat.dfehub.com/api/chat) | `g4f.Provider.DfeHub` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [aiservice.vercel.app](https://aiservice.vercel.app/api/chat/answer) | `g4f.Provider.AiService` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [b.ai-huan.xyz](https://b.ai-huan.xyz) | `g4f.Provider.BingHuan` | ✔️ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [wewordle.org](https://wewordle.org/gptapi/v1/android/turbo) | `g4f.Provider.Wewordle` | ✔️ | ❌ | ❌ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [chatgpt.ai](https://chatgpt.ai/gpt-4/) | `g4f.Provider.ChatgptAi` | ❌ | ✔️ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |


### Other Models

| Model| Base Provider | Provider | Website |
| ------- | ----------- | ---- |---- |
| palm2 | Google | `g4f.Provider.Bard` | [bard.google.com](https://bard.google.com/) |
| falcon-40b | Huggingface | `g4f.Provider.H2o` | [H2o](https://www.h2o.ai/) |
| falcon-7b | Huggingface |`g4f.Provider.H2o` | [H2o](https://www.h2o.ai/) |
| llama-13b | Huggingface | `g4f.Provider.H2o`| [H2o](https://www.h2o.ai/) |
| claude-instant-v1-100k | Anthropic | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| claude-instant-v1 | Anthropic | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| claude-v1-100k | Anthropic | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| claude-v1 | Anthropic | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| alpaca-7b | Replicate | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| stablelm-tuned-alpha-7b | Replicate | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| bloom | Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| bloomz | Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| flan-t5-xxl | Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| flan-ul2 | Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| gpt-neox-20b | Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| oasst-sft-4-pythia-12b-epoch-3.5 |Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| santacoder | Huggingface | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| command-medium-nightly | Cohere | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| command-xlarge-nightly | Cohere | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| code-cushman-001 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| code-davinci-002 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-ada-001 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-babbage-001 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-curie-001 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-davinci-002 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-davinci-003 | OpenAI | `g4f.Provider.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |







## 📷 Screenshot

![Screenshot](screenshots/light_1280x800.png?raw=true)

![Screenshot (Dark Mode)](screenshots/dark_1280x800.png?raw=true)

## ✨ Features

- 🤖 Use different chatbots in one app, currently supporting ChatGPT, new Bing Chat, Google Bard, Claude (via Poe), Alpaca, Vicuna, ChatGLM, and will integrate more in the future
- 💬 Chat with multiple chatbots at the same time, making it easy to compare their answers
- 🚀 Support ChatGPT API and GPT-4 Browsing
- 🔍 Shortcut to quickly activate the app anywhere in the browser
- 🎨 Markdown and code highlight support
- 📚 Prompt Library for custom prompts and community prompts
- 💾 Conversation history saved locally
- 📥 Export and Import all your data
- 🔗 Share conversation to markdown
- 🌙 Dark mode

## 🤖 Supported Bots

* ChatGPT (via Webapp/API/Azure/Poe)
* Bing Chat
* Google Bard
* Claude (via Poe)
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* ...


## 🔧 Manual Installation

- Download grandgpt.zip from [Releases](https://github.com/SingularityLabs-ai/GrandGPT/releases)
- Unzip the file
- In Chrome/Edge go to the extensions page (chrome://extensions or edge://extensions)
- Enable Developer Mode
- Drag the unzipped folder anywhere on the page to import it (do not delete the folder afterward)

## 🔨 Build from Source

- Clone the source code
- `yarn install`
- `yarn build`
- Load `dist` folder to browser by following steps in _Manual Installation_

### Credit

This project is inspired by https://github.com/ZohaibAhmed/ChatGPT-Google , https://github.com/wong2/chatgpt-google-extension
