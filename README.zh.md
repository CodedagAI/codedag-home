# CodeDAG

[English](./README.md) · 简体中文 · [日本語](./README.ja.md)

CodeDAG 是编程 Agent 的编排引擎，在你自己的电脑上运行。把一批开发任务和它们之间的依赖写成一个工作流文件，CodeDAG 按依赖调度：每个任务一个全新的 Agent 会话、一条自己的分支，结果自动合并到集成分支，由你决定何时合入主分支。

**详细介绍见[文档](https://codedag.com/zh/docs)。**

## 安装

CodeDAG 目前处于内测的 Waitlist 阶段，暂时还不能安装。内测开始后，我们会在这里补上安装方式。

[加入 Waitlist](https://codedag.com/zh/waitlist?source=github-readme)，等待邀请。邀请分批通过邮件发出，获邀后，内测期间享有免费额度。

## 反馈

使用 CodeDAG 遇到问题或有功能建议，请[在这里提 Issue](https://github.com/CodedagAI/codedag-home/issues/new/choose)。报告问题之前，可以先看看[故障排除](https://codedag.com/zh/docs/troubleshooting/troubleshooting)，那里也许已经有答案。文档和 codedag.com 网站的问题也可以在这里反馈。

Issue 是公开的。不要粘贴 API 密钥、令牌或私有代码；分享日志和工作流文件之前，先检查其中有没有这些内容。不便公开讨论的问题或其他事务，请发邮件到 hi@codedag.com。报告安全漏洞请见 [SECURITY.md](./SECURITY.md)。

## 隐私

CodeDAG 在你的电脑上运行。仓库里的代码、运行日志和 Agent 会话都留在你的电脑上。你提交工作流时和工作流开始执行时，CLI 会把工作流文件连同其中的 prompt 发给我们，用来计算额度；我们算完即丢弃文件，只保留一段校验值。Claude Code 和 Codex 直接从你的电脑与各自的模型服务商通信，这些流量不经过我们。详见[隐私政策](https://codedag.com/zh/privacy)。

## 关于本仓库

> [!NOTE]
> 本仓库是 [codedag.com](https://codedag.com/zh) 官网与文档的源码。CodeDAG CLI 不在这里开发，但 CLI 的问题也可以在这里反馈。

## 许可

`docs-website/content/` 下的文档、政策等内容采用 [CC BY 4.0](./LICENSE) 许可。本仓库的其余部分，包括网站代码，采用 [MIT 许可](./LICENSE-CODE)。CodeDAG 的名称和标志不在这两种许可的范围内；第三方文件保留各自的许可，例如 `docs-website/public/fonts/` 下的字体。
