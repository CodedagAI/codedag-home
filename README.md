# CodeDAG

English · [简体中文](./README.zh.md) · [日本語](./README.ja.md)

CodeDAG is the orchestration engine for coding agents. Declare a batch of development tasks and their dependencies in one workflow file; it schedules them on your machine, each task in a fresh agent session on its own branch, and merges the results into one integration branch for you to land.

**Learn more in the [documentation](https://codedag.com/docs).**

## Installation

CodeDAG can't be installed yet: we're collecting the waitlist for the private beta. We'll add installation instructions here when the private beta begins.

[Join the waitlist](https://codedag.com/waitlist?source=github-readme) to get an invite. Invites go out by email, in batches, and everyone invited gets free credits while the beta runs.

## Feedback

[Open an issue](https://github.com/CodedagAI/codedag-home/issues/new/choose) to report a problem with CodeDAG or to suggest a feature. Before you report a problem, check [Troubleshooting](https://codedag.com/docs/troubleshooting/troubleshooting); it may already have the answer. You can also report problems with the documentation or the codedag.com website here.

Issues are public. Don't paste API keys, tokens or private code, and check logs and workflow files for them before you share them. For a problem you can't discuss in public, or for anything else, email hi@codedag.com. To report a security vulnerability, see [SECURITY.md](./SECURITY.md).

## Privacy

CodeDAG runs on your computer. The code in your repository, your run logs and your agents' sessions stay there. When you submit a workflow and when it starts, the CLI sends us the workflow file, including its prompts, so that we can count credits; we discard the file after counting and keep only a checksum. Claude Code and Codex talk to their model providers directly from your computer, and that traffic doesn't pass through us. See the [privacy policy](https://codedag.com/privacy) for details.

## About this repository

> [!NOTE]
> This repository holds the source of the [codedag.com](https://codedag.com) website and documentation. The CodeDAG CLI isn't developed here, but you can report problems with it here.

## License

The documentation, policies and other content under `docs-website/content/` are licensed under [CC BY 4.0](./LICENSE). The rest of this repository, including the website's code, is licensed under the [MIT License](./LICENSE-CODE). The CodeDAG name and logo aren't covered by either license, and third-party files, such as the fonts under `docs-website/public/fonts/`, keep their own licenses.
