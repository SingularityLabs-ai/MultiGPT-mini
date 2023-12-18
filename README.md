
<h1 align="center">MultiGPT</h1>

<div align="center">

### MultiGPT is a multi-chatbot

[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]

[![Join us on Discord](https://invidget.switchblade.xyz/jc4xtF58Ve)](https://discord.gg/jc4xtF58Ve)

##
English &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md)

##

### Install

<a href="https://chrome.google.com/webstore/detail/multigpt-access-all-chatb/dfobejficjaelohpjceiicphofmmglop?hl=en&authuser=0">
    <img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="Get MultiGPT for Chromium">    
</a><a href="https://microsoftedge.microsoft.com/addons/detail/hdlddhcngcdpcgajecjoccekfofmllfn">
    <img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="Get MultiGPT for Microsoft Edge">
</a>
<a href="https://chrome.google.com/webstore/detail/multigpt-access-all-chatb/dfobejficjaelohpjceiicphofmmglop?hl=en&authuser=0">
    <img src="https://github.com/SingularityLabs-ai/MultiGPT-mini/assets/2527354/f501fba7-6488-49f6-b416-ea4bb1788877" width="200" alt="Get MultiGPT for Brave">
</a>




##

[Screenshot](#-screenshot) &nbsp;&nbsp;|&nbsp;&nbsp; [Features](#-features) &nbsp;&nbsp;|&nbsp;&nbsp; [Supported Bots](#-supported-bots) &nbsp;&nbsp;|&nbsp;&nbsp; [Manual Installation](#-manual-installation) &nbsp;&nbsp;|&nbsp;&nbsp; [Build from Source](#-build-from-source) &nbsp;&nbsp;|&nbsp;&nbsp; [Changelog](#-changelog)

[author-image]: https://img.shields.io/badge/author-ishandutta2007-blue.svg
[author-url]: https://github.com/ishandutta2007
[license-image]: https://img.shields.io/github/license/SingularityLabs-ai/MultiGPT?color=blue
[license-url]: https://github.com/SingularityLabs-ai/MultiGPT-mini/blob/main/LICENSE
[release-image]: https://img.shields.io/github/v/release/SingularityLabs-ai/MultiGPT-mini?color=blue
[release-url]: https://github.com/SingularityLabs-ai/MultiGPT-mini/releases/latest
[last-commit-image]: https://img.shields.io/github/last-commit/SingularityLabs-ai/MultiGPT-mini?label=last%20commit
[last-commit-url]: https://github.com/SingularityLabs-ai/MultiGPT-mini/commits

</div>

## 🤖 Supported Bots

 - bing.com
 - chat.openai.com  (via Webapp/API/Azure/Poe)
 - bard.google.com
 - claude.ai
 - pi.ai
 - phind.com
 - you.com
 - cohere.com / cohere.ai
 - perplexity.ai (via poe)
 - Assistant by poe (formerly Sage
 - Google PaLM2
 - LLaMa2
 - iFlytek Spark
 - Alpaca
 - Vicuna


## Todo
- WizardLM
- ChatGLM2
- Qianwen
- Baichuan
- Tongyi Qianwen
- Small_Talk https://developer.kore.ai/docs/bots/bot-builder-tool/small-talk/#Import_Small_Talk
- openrouter.ai
- forefront.ai domain specific bots
- writesonic.com
- chatgpt and dall e via beta.theb.ai
- deepai.org
- sdk.vercel.ai (have multiple bots like poe)
- Midjourney alternative editor.fusionbrain.ai
- chatgpt via https://chat.acytoo.com
- https://apps.apple.com/app/id6446304087

### GPT4
- GPT4 via liaobots.com
- GPT4 via https://gpt4h.ninvfeng.xyz/
- GPT4 xunika
- GPT4 via popai.pro

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

##

## Models

### gpt-3.5 / gpt-4

| Website| Provider| gpt-3.5 | gpt-4 | Stream | Status | Auth |
| --- | --- | --- | --- | --- | --- | --- |
| [ai.ls](https://ai.ls) | `MultiGPT.Ails` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [you.com](https://you.com) | `MultiGPT.You` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [bing.com](https://bing.com/chat) | `MultiGPT.Bing` | ❌ | ✔️ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chat9.yqcloud.top](https://chat9.yqcloud.top/) | `MultiGPT.Yqcloud` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [theb.ai](https://theb.ai) | `MultiGPT.Theb` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [chat-gpt.org](https://chat-gpt.org/chat) | `MultiGPT.Aichat` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [bard.google.com](https://bard.google.com) | `MultiGPT.Bard` | ❌ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ✔️ |
| [play.vercel.ai](https://play.vercel.ai) | `MultiGPT.Vercel` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [forefront.com](https://forefront.com) | `MultiGPT.Forefront` | ✔️ | ❌ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [supertest.lockchat.app](http://supertest.lockchat.app) | `MultiGPT.Lockchat` | ✔️ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [liaobots.com](https://liaobots.com) | `MultiGPT.Liaobots` | ✔️ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ✔️ |
| [gpt-gm.h2o.ai](https://gpt-gm.h2o.ai) | `MultiGPT.H2o` | ❌ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chatgptlogin.ac](https://chatgptlogin.ac) | `MultiGPT.ChatgptLogin` | ✔️ | ❌ | ❌ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [deepai.org](https://deepai.org) | `MultiGPT.DeepAi` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chat.getgpt.world](https://chat.getgpt.world/) | `MultiGPT.GetGpt` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [www.aitianhu.com](https://www.aitianhu.com/api/chat-process) | `MultiGPT.AItianhu` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [free.easychat.work](https://free.easychat.work) | `MultiGPT.EasyChat` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [chat.acytoo.com](https://chat.acytoo.com/api/completions) | `MultiGPT.Acytoo` | ✔️ | ❌ | ❌ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [chat.dfehub.com](https://chat.dfehub.com/api/chat) | `MultiGPT.DfeHub` | ✔️ | ❌ | ✔️ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [aiservice.vercel.app](https://aiservice.vercel.app/api/chat/answer) | `MultiGPT.AiService` | ✔️ | ❌ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |
| [b.ai-huan.xyz](https://b.ai-huan.xyz) | `MultiGPT.BingHuan` | ✔️ | ✔️ | ✔️ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [wewordle.org](https://wewordle.org/gptapi/v1/android/turbo) | `MultiGPT.Wewordle` | ✔️ | ❌ | ❌ | ![Inactive](https://img.shields.io/badge/Inactive-red) | ❌ |
| [chatgpt.ai](https://chatgpt.ai/gpt-4/) | `MultiGPT.ChatgptAi` | ❌ | ✔️ | ❌ | ![Active](https://img.shields.io/badge/Active-brightgreen) | ❌ |


### Other Models

| Model| Base Provider | Provider | Website |
| ------- | ----------- | ---- |---- |
| palm2 | Google | `MultiGPT.Bard` | [bard.google.com](https://bard.google.com/) |
| falcon-40b | Huggingface | `MultiGPT.H2o` | [H2o](https://www.h2o.ai/) |
| falcon-7b | Huggingface |`MultiGPT.H2o` | [H2o](https://www.h2o.ai/) |
| llama-13b | Huggingface | `MultiGPT.H2o`| [H2o](https://www.h2o.ai/) |
| claude-instant-v1-100k | Anthropic | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| claude-instant-v1 | Anthropic | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| claude-v1-100k | Anthropic | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| claude-v1 | Anthropic | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| alpaca-7b | Replicate | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| stablelm-tuned-alpha-7b | Replicate | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| bloom | Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| bloomz | Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| flan-t5-xxl | Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| flan-ul2 | Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| gpt-neox-20b | Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| oasst-sft-4-pythia-12b-epoch-3.5 |Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| santacoder | Huggingface | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| command-medium-nightly | Cohere | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| command-xlarge-nightly | Cohere | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| code-cushman-001 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| code-davinci-002 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-ada-001 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-babbage-001 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-curie-001 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-davinci-002 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |
| text-davinci-003 | OpenAI | `MultiGPT.Vercel` | [sdk.vercel.ai](https://sdk.vercel.ai/) |







## 📷 Screenshot

![Screenshot](screenshots/Screenshot_9in1.png?raw=true)

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


## 🔧 Manual Installation

- Download grandgpt.zip from [Releases](https://github.com/SingularityLabs-ai/GrandGPT-mini/releases)
- Unzip the file
- In Chrome/Edge go to the extensions page (chrome://extensions or edge://extensions)
- Enable Developer Mode
- Drag the unzipped folder anywhere on the page to import it (do not delete the folder afterward)

## 🔨 Build from Source

- Clone the source code
- `yarn install`
- `yarn build`
- Load `dist` folder to browser by following steps in _Manual Installation_


##

### 🤔 Questions? Problems? Suggestions?

#### Get help - [Discord 💬](https://discord.gg/jc4xtF58Ve)

[![Join us on Discord](https://invidget.switchblade.xyz/jc4xtF58Ve)](https://discord.gg/jc4xtF58Ve)

##
