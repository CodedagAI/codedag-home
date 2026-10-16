/**
 * 首页三语文案。
 *
 * 产品表述以中文用户文档为准（content/docs/**\/*.zh.mdx）；中文先定稿，
 * 英文和日文按各自语言的表达习惯重写，不逐句对译。
 */

import type { SiteMode } from './site-mode';

export type SupportedLocale = 'en' | 'zh' | 'ja';

/** 字符串，或一组“段内不换行”的片段 */
export type Heading = string | string[];

/**
 * 两拍标题：前一拍立论，后一拍兑现或转折。页面上前一拍用正文色，后面的用次要色，
 * 每一拍内部不换行。反引号里的词按代码排；星号里的词用品牌紫，
 * 只用在首屏标题里合起来是产品名的那两个词上。
 * 中文的一拍在手机上放不下一行时写成分段数组（同 Heading），拍内只在段与段之间折行。
 */
export type Beats = Heading[];

export type AgentId = 'claude' | 'codex';

/** 贯穿全页的示例工作流 site-search：任务交给谁、依赖谁。标题在各语言的 tasks 里 */
export const exampleTasks: { id: number; agent: AgentId; dependencies: number[] }[] = [
  { id: 1, agent: 'claude', dependencies: [] },
  { id: 2, agent: 'codex', dependencies: [1] },
  { id: 3, agent: 'claude', dependencies: [1] },
  { id: 4, agent: 'claude', dependencies: [1] },
  { id: 5, agent: 'claude', dependencies: [2, 3, 4] },
  { id: 6, agent: 'codex', dependencies: [5] },
];

export const agentNames: Record<AgentId, string> = {
  claude: 'Claude Code',
  codex: 'Codex',
};

export interface Capability {
  /** 序号线上的短名 */
  name: string;
  title: Beats;
  body: string;
  chips: [string, string, string];
}

export interface HomepageTranslations {
  meta: {
    title: string;
    description: string;
  };
  /** 示例工作流的六个任务标题，顺序同 exampleTasks */
  tasks: [string, string, string, string, string, string];
  hero: {
    title: Beats;
    /** 逐句写：第一句说它是什么，后面的说凭什么。宽屏上折行落在句与句之间 */
    lead: string[];
    docsLink: string;
    /** 按钮旁边的一句说明：前半句固定，说在本机、用已有的 Agent 订阅运行；中点之后随模式换（内测免费，或注册送的额度） */
    status: Record<SiteMode, string>;
    stage: {
      label: string;
      /** {n} 换成已完成的任务数 */
      progress: string;
      pause: string;
      play: string;
    };
  };
  burden: {
    /** 压在虚线框上沿的标签：这一格画的是没有 CodeDAG 时的样子 */
    tag: string;
    title: Beats;
    body: string;
    stage: {
      label: string;
      you: string;
      /** {n} 换成在等的会话数 */
      waiting: string;
      done: string;
      question: string;
    };
  };
  capabilities: {
    label: string;
    /** 痛点与能力节之间的转折标签，与 burden.tag 是一对 */
    turn: string;
    orchestrate: Capability & {
      stage: {
        label: string;
        specPrompt: string;
        testPrompt: string;
        /** 引擎那条线的名字 */
        engine: string;
        /** 文件里依赖行右端的小标签 */
        engineTag: string;
        you: string;
        /** {n} 换成工作区编号 */
        workspace: string;
        submit: string;
        back: string;
        away: string;
      };
    };
    steer: Capability & {
      stage: {
        label: string;
        /** 看板上停在审核门禁前的那一行的标注 */
        waiting: string;
        /** 看板上被中断的那一行的标注 */
        kept: string;
        message: string;
        pause: string;
        kill: string;
        recover: string;
      };
    };
    merge: Capability & {
      stage: {
        label: string;
        noCommits: string;
        yourCall: string;
        reworked: string;
        /** 三条分支合流处的两行标注 */
        merged: string;
        resolved: string;
      };
    };
    philosophyLink: string;
  };
  fit: {
    label: string;
    title: Beats;
    cards: { name: string; body: string; label: string }[];
    link: string;
    /** 目前支持哪些 Agent：这一节最后的一行小字。首屏和页面标题只说“编程 Agent” */
    agents: string;
  };
  local: {
    label: string;
    title: Beats;
    /** received 是讲“收到什么”的那一句，接在 body 后面，链到文档里逐项的清单 */
    facts: { title: string; body: string; received?: string }[];
    diagram: {
      label: string;
      machine: string;
      repo: string;
      repoNote: string;
      /** 跟在 cdg 三个字母后面的说明 */
      cli: string;
      /** cdg 伸向 Agent 的那条线旁边的字 */
      starts: string;
      /** Agent 出本机的两条线上走的东西 */
      agentCargo: string;
      providers: string;
      direct: string;
      /** cdg 出本机的那条点线上走的东西 */
      serviceCargo: string;
      service: string;
      /** 账号服务的卡片只有两句：收的是做什么用的信息，工作流文件算完怎样处理 */
      receives: string;
      discard: string;
      /** 没有发给 CodeDAG 的东西：小标题和三个小块 */
      kept: string;
      keptItems: [string, string, string];
    };
    /** received 那一句链接的提示文字，悬停时由浏览器显示 */
    link: string;
  };
  pricing: {
    label: string;
    title: Beats;
    figures: { value: string; unit: string; note: string }[];
    example: string;
    exampleLabel: string;
    modelNote: string;
    link: string;
  };
  closing: {
    title: Record<SiteMode, Beats>;
    body: Record<SiteMode, string>;
    docsLink: string;
  };
}

const translations: Record<SupportedLocale, HomepageTranslations> = {
  zh: {
    meta: {
      title: 'CodeDAG：编程 Agent 的编排引擎',
      description:
        'CodeDAG 是编程 Agent 的编排引擎，在你自己的电脑上运行。把一批开发任务和它们之间的依赖写成一个工作流文件，CodeDAG 按依赖调度：每个任务一个全新的 Agent 会话、一条自己的分支，结果自动合并到集成分支，由你决定何时合入主分支。',
    },
    tasks: ['写方案', '写测试', '做接口', '做页面', '跑通测试', '审查改动'],
    hero: {
      title: ['Agent 写*代码*，', '引擎跑 *DAG*。'],
      lead: [
        'CodeDAG 是编程 Agent 的编排引擎。',
        '你的 prompt，按依赖连起来，就是 DAG。',
        '任务再多，调度也不走样。不靠你盯，也不靠模型记。',
      ],
      docsLink: '阅读文档',
      status: {
        waitlist: '用你已有的 Agent 订阅在本机运行 · 内测期间免费',
        beta: '用你已有的 Agent 订阅在本机运行 · 内测期间免费',
        live: '用你已有的 Agent 订阅在本机运行 · 注册即送 800 点免费额度',
      },
      stage: {
        label:
          '示意动画：提交工作流 site-search 之后，六个任务按依赖自行推进。写方案完成后，做接口、做页面、写测试同时执行，然后跑通测试、审查改动，结果汇入集成分支。',
        progress: '{n}/6 已完成',
        pause: '暂停动画',
        play: '继续播放',
      },
    },
    burden: {
      tag: '没有 CodeDAG',
      title: [['一直以来，这台引擎', '都是你。'], ['你一走，', '它们全都停下。']],
      body: '多个终端来回切，会话都停着，等你下一条 prompt。谁等谁、该推进谁，全靠你记着。分支也得自己合。',
      stage: {
        label: '示意图：没有 CodeDAG 时，三个 Agent 会话都停着，每一个都在等你输入下一条 prompt。',
        you: '你',
        waiting: '{n} 个在等你',
        done: '做完了，等下一条 prompt',
        question: '有个问题要问你',
      },
    },
    capabilities: {
      label: '它怎样工作',
      turn: '有了 CodeDAG',
      orchestrate: {
        name: '编排',
        title: ['任务之间，确定性调度。', '任务之内，Agent 自主。'],
        body: '依赖显式声明，引擎按拓扑序调度。上游完成，下游立刻启动。下一步看 DAG，不看模型。任务只是一段 prompt。写目标就够，步骤不用写。',
        chips: ['每个任务全新会话，上下文干净', '编排即代码：校验、重跑、迭代', 'DAG 也可以让 Agent 替你写'],
        stage: {
          label:
            '示意图：工作流文件 site-search.yaml 里，声明依赖的那几行由 CodeDAG 的编排引擎执行，每个任务的 prompt 交给一个全新的 Claude Code 或 Codex 会话。运行时，写方案被接受后，引擎并行启动做接口、做页面和写测试；三个都被接受后启动跑通测试，然后是审查改动。从提交到回来查看，这段时间你不在。',
          specPrompt: '读 docs/search.md，把方案写成 docs/spec.md。',
          testPrompt: '按 docs/spec.md 写测试。',
          engine: 'CodeDAG 引擎',
          engineTag: '引擎',
          you: '你',
          workspace: '工作区 {n}',
          submit: '提交',
          back: '回来',
          away: '不在',
        },
      },
      steer: {
        name: '接手',
        title: ['看得见，', '叫得停。'],
        body: '每个任务都是进得去的会话。随时看，直接纠正。能暂停，能中断，能恢复。回原会话接着做，上下文都在。',
        chips: ['完整日志，实时跟随', '停一个任务，或整个工作流', '审核门禁设在哪由你定'],
        stage: {
          label:
            '示意图：状态看板上，任务 2 已做完，停着等你审核；任务 3 被你中断，会话还保留着；任务 4 正在执行。你进入任务 4 的会话，直接给 Agent 一句纠正。暂停、中断、恢复各是一条命令，这里用恢复让任务 3 在原会话里接着做。',
          waiting: '等你审核',
          kept: '会话还在',
          message: '表格用现有的 Table 组件',
          pause: '暂停',
          kill: '中断',
          recover: '恢复',
        },
      },
      merge: {
        name: '合并',
        title: ['自动合并，自动解冲突。', '主分支原封不动。'],
        body: '每个任务一条分支。上游结果自动合入下游。冲突交给 Agent 解。单个任务可以丢弃或重做。最后汇成一条集成分支。合不合入主分支，由你决定。',
        chips: ['并行任务各有工作区，互不干扰', '每个任务的改动可以单独查看', '丢弃的改动自动留快照'],
        stage: {
          label:
            '示意图：六个任务各有一条分支，按依赖合流。写测试、做接口、做页面三条分支在“跑通测试”开始之前自动合并，其中的冲突已由 Agent 解决。最后汇入集成分支 cdg/site-search/integration；主分支上没有新提交，是否合入由你决定。',
          noCommits: '没有新提交',
          yourCall: '由你决定',
          reworked: '重做过一次',
          merged: '自动合并',
          resolved: '冲突已解决',
        },
      },
      philosophyLink: '这些取舍背后的八条设计理念',
    },
    fit: {
      label: '适合做什么',
      title: ['能画成 DAG 的事，', '都能交给引擎。'],
      cards: [
        {
          name: '先定方案，再分头做',
          body: '方案定了，几个部分并行开工，最后汇合跑通。',
          label: '任务图：一个任务之后两个任务并行，再汇到一个任务',
        },
        {
          name: '几项改动一起推',
          body: '互不依赖的改动各走各的分支，做完自动合并。',
          label: '任务图：四个互不依赖的任务并行，最后汇到一处',
        },
        {
          name: '一个写，一个审',
          body: 'Claude Code 实现，Codex 审查并修复，反过来也行。',
          label: '任务图：四个任务连成一条链，两种 Agent 交替',
        },
        {
          name: '一长串，跑一夜',
          body: '大重构拆成十几个串行任务。每个接着上一个的结果做。不用守着。',
          label: '任务图：十二个任务连成一条长链，串行执行',
        },
      ],
      link: '和 Claude Code Dynamic Workflow 的对比',
      agents: '目前支持 Claude Code 和 Codex。',
    },
    local: {
      label: '数据隐私',
      title: ['你的代码，', '一行也不发给我们。'],
      facts: [
        {
          title: '不上传你的代码',
          body: '仓库里的代码、日志和会话，都不发给 CodeDAG。',
          received: '只请求登录信息、工作流文件和 CLI 版本等环境信息。',
        },
        {
          title: '不换你的 Agent',
          body: '跑的就是你自己的 Agent，用量走你已有的订阅，没有 token 账单。',
        },
        {
          title: '不动你的主分支',
          body: '不在主分支上提交，也不向远程仓库推送或拉取。',
        },
      ],
      diagram: {
        label:
          '数据边界示意图。你的电脑上有你的仓库，Claude Code 和 Codex 在仓库里直接读写，并像平时一样用你自己的账号直接连接各自的模型服务，代码与上下文只走这一条路。CodeDAG 的 CLI cdg 也在你的电脑上，负责启动这两个 Agent 的会话；它通向 CodeDAG 账号服务的线只用于登录与额度。账号服务只请求登录和算额度要用的信息，工作流文件算完即丢弃，不保存。仓库里的代码、运行日志和会话内容不发给 CodeDAG。',
        machine: '你的电脑',
        repo: '你的仓库',
        repoNote: 'Agent 在这里直接读写',
        cli: 'CodeDAG CLI',
        starts: '启动会话',
        agentCargo: '代码与上下文',
        providers: '模型服务',
        direct: '和平时一样直连，用你自己的账号',
        serviceCargo: '登录与额度',
        service: 'CodeDAG 账号服务',
        receives: '只请求登录和算额度要用的信息',
        discard: '工作流文件算完即丢弃，不保存。',
        kept: '不发给 CodeDAG',
        keptItems: ['仓库里的代码', '运行日志', '会话内容'],
      },
      link: 'CodeDAG 收到的每一项数据',
    },
    pricing: {
      label: '定价',
      title: ['按任务计费，', '一个任务扣 1 点。'],
      figures: [
        { value: '$12', unit: '/月', note: '年付 $96，折合 $8/月，省 33%' },
        { value: '800', unit: '点额度/月', note: '相当于 800 次代码提交，平均每天 25 次以上' },
        { value: '800', unit: '点免费', note: '注册即送，30 天有效，无需绑卡' },
      ],
      example: '这个工作流有 6 个任务。执行一次，扣 6 点额度。跑多久、改几轮，都是这 6 点。',
      exampleLabel: '示例工作流的任务图，每个任务扣 1 点',
      modelNote: '模型用量走你已有的 Agent 订阅，CodeDAG 不按 token 计费。',
      link: '查看定价与常见问题',
    },
    closing: {
      title: {
        waitlist: ['内测即将开始，', '先占个位置。'],
        beta: ['内测进行中，', '申请一个名额。'],
        live: ['把第一张 DAG，', '交给引擎。'],
      },
      body: {
        waitlist: '邀请分批通过邮件发出。获邀后，内测期间享有免费额度。',
        beta: '邀请分批通过邮件发出。获邀后，内测期间享有免费额度。',
        live: '注册即送 800 点免费额度，30 天有效，无需绑卡。',
      },
      docsLink: '先读文档',
    },
  },

  en: {
    meta: {
      title: 'CodeDAG — The orchestration engine for coding agents',
      description:
        'CodeDAG is the orchestration engine for coding agents. Declare a batch of development tasks and their dependencies in one workflow file; it schedules them on your machine, each task in a fresh agent session on its own branch, and merges the results into one integration branch for you to land.',
    },
    tasks: [
      'Write the spec',
      'Write the tests',
      'Build the API',
      'Build the UI',
      'Make tests pass',
      'Review the diff',
    ],
    hero: {
      title: ['Agents write the *code*.', 'An engine runs the *DAG*.'],
      lead: [
        'CodeDAG is the orchestration engine for coding agents.',
        'Your prompts, linked by dependency, are the DAG. However many tasks, it all runs exactly as written: no babysitting, no model keeping track.',
      ],
      docsLink: 'Read the docs',
      status: {
        waitlist: 'Runs locally on your existing agent subscriptions · Free credits during the private beta',
        beta: 'Runs locally on your existing agent subscriptions · Free credits during the private beta',
        live: 'Runs locally on your existing agent subscriptions · 800 free credits when you sign up',
      },
      stage: {
        label:
          'Illustrative animation: after the workflow site-search is submitted, its six tasks run on their own. Once the spec is written, the tests, the API, and the UI are built at the same time; then the tests are made to pass, the diff is reviewed, and the results land on the integration branch.',
        progress: '{n} of 6 done',
        pause: 'Pause animation',
        play: 'Play animation',
      },
    },
    burden: {
      tag: 'Without CodeDAG',
      title: ['Until now, that engine has been you.', 'Step away, and it all stops.'],
      body: 'Several terminals, each session waiting on your next prompt. You track what depends on what, start each task by hand, and merge the branches yourself.',
      stage: {
        label:
          'Illustration: without CodeDAG, three agent sessions have all stopped, each one waiting for you to type the next prompt.',
        you: 'You',
        waiting: '{n} waiting on you',
        done: 'Done. Needs a prompt.',
        question: 'Has a question for you.',
      },
    },
    capabilities: {
      label: 'How it works',
      turn: 'With CodeDAG',
      orchestrate: {
        name: 'Orchestrate',
        title: ['Deterministic scheduling.', 'Autonomous agents.'],
        body: 'Dependencies are declared, and the engine schedules them in topological order: upstream finishes, downstream starts. What runs next is the DAG’s call, never a model’s. Each task is just a prompt: a goal is enough, no steps required.',
        chips: ['Fresh session, fresh context per task', 'Orchestration as code: validate, rerun', 'Or have an agent write the DAG'],
        stage: {
          label:
            'Illustration: in the workflow file site-search.yaml, the lines that declare dependencies are carried out by the CodeDAG engine, and each task’s prompt goes to a fresh Claude Code or Codex session. In the run, once the spec is accepted the engine starts the API, the UI, and the tests in parallel; once all three are accepted it starts making the tests pass, and then the review. Between submitting and coming back, you are away.',
          specPrompt: 'Read docs/search.md, write docs/spec.md.',
          testPrompt: 'Write tests from docs/spec.md.',
          engine: 'CodeDAG engine',
          engineTag: 'engine',
          you: 'You',
          workspace: 'Workspace {n}',
          submit: 'submit',
          back: 'back',
          away: 'away',
        },
      },
      steer: {
        name: 'Steer',
        title: ['See every step.', 'Stop any task.'],
        body: 'Every task is a session you can attach to: watch it live, correct it directly. Pause it, kill it, recover it. It picks up in the same session, context intact.',
        chips: ['Full logs, tailed live', 'Stop one task or the whole workflow', 'Review gates where you want them'],
        stage: {
          label:
            'Illustration: on the status board, task 2 is done and waiting for your review, task 3 has been killed with its session kept, and task 4 is still running. You open task 4’s session and give the agent a correction. Pause, kill, and recover are one command each; here, recover picks task 3 back up in the same session.',
          waiting: 'Needs your review',
          kept: 'Session kept',
          message: 'use the existing Table',
          pause: 'Pause',
          kill: 'Kill',
          recover: 'Recover',
        },
      },
      merge: {
        name: 'Merge',
        title: ['Auto-merge. Auto-resolve.', '`main` stays untouched.'],
        body: 'One branch per task. Upstream results merge into downstream tasks automatically, and agents resolve the conflicts. Drop or redo any single task. It all ends on one integration branch; landing that on main is your call.',
        chips: [
          'Parallel tasks never share a checkout',
          'Every task’s diff reviewable on its own',
          'Dropped work is kept as a snapshot',
        ],
        stage: {
          label:
            'Illustration: each of the six tasks has its own branch, and the branches join in dependency order. Before “Make tests pass” starts, the three parallel branches are merged automatically and a conflict between them is resolved by an agent. Everything ends on the integration branch cdg/site-search/integration. There are no new commits on main; merging is up to you.',
          noCommits: 'no new commits',
          yourCall: 'your call',
          reworked: 'reworked once',
          merged: 'auto-merged',
          resolved: 'conflict resolved',
        },
      },
      philosophyLink: 'The eight principles behind these choices',
    },
    fit: {
      label: 'What it’s for',
      title: ['If you can draw the DAG,', 'you can hand it off.'],
      cards: [
        {
          name: 'Spec, build, verify',
          body: 'Settle the spec, build the parts in parallel, then make it all pass.',
          label: 'Task graph: one task, then two in parallel, then one that joins them',
        },
        {
          name: 'Several changes at once',
          body: 'Independent changes each get their own branch and merge at the end.',
          label: 'Task graph: four independent tasks in parallel, joined at the end',
        },
        {
          name: 'One builds, one reviews',
          body: 'Claude Code writes it, Codex reviews and fixes it. Or the other way around.',
          label: 'Task graph: a chain of four tasks alternating between the two agents',
        },
        {
          name: 'Step after step, overnight',
          body: 'A big refactor as a dozen sequential tasks, each building on the last. No babysitting.',
          label: 'Task graph: twelve tasks in one long chain, run sequentially',
        },
      ],
      link: 'Compare with Claude Code Dynamic Workflow',
      agents: 'Works with Claude Code and Codex today.',
    },
    local: {
      label: 'Data privacy',
      title: ['Not a line of your code', 'reaches us.'],
      facts: [
        {
          title: 'Never uploads your code',
          body: 'Your code, logs, and sessions are never sent to CodeDAG.',
          received: 'It only gets your sign-in, the workflow file, and basics like the CLI version.',
        },
        {
          title: 'Never replaces your agents',
          body: 'It runs your own agents, on the subscriptions you already have. No token bill.',
        },
        {
          title: 'Never touches your main branch',
          body: 'It doesn’t commit to main, and it doesn’t push to or pull from your remote.',
        },
      ],
      diagram: {
        label:
          'Data boundary diagram. On your machine: your repo, with Claude Code and Codex reading and writing in it directly. The agents connect straight to their own model providers, on your own accounts, as they always do; that is the only path your code and context take. cdg, the CodeDAG CLI, also runs on your machine and starts those agent sessions. Its one line to the CodeDAG account service carries sign-in and credits. The account service receives only what sign-in and credit counting need, and the workflow file is discarded once it has been counted, never stored. Your code, run logs, and session contents are never sent to CodeDAG.',
        machine: 'Your machine',
        repo: 'Your repo',
        repoNote: 'agents read and write here',
        cli: 'the CodeDAG CLI',
        starts: 'starts sessions',
        agentCargo: 'code and context',
        providers: 'Model providers',
        direct: 'Direct, as always. Your own accounts.',
        serviceCargo: 'sign-in and credits',
        service: 'CodeDAG account service',
        receives: 'Only what sign-in and credits need',
        discard: 'The workflow file is discarded once counted, never stored.',
        kept: 'Never sent to CodeDAG',
        keptItems: ['your code', 'run logs', 'session contents'],
      },
      link: 'Every piece of data CodeDAG receives',
    },
    pricing: {
      label: 'Pricing',
      title: ['Billed by the task.', 'One credit each.'],
      figures: [
        { value: '$12', unit: '/month', note: 'Or $96 a year: $8/month, 33% off' },
        { value: '800', unit: 'credits/month', note: 'About 800 commits, over 25 a day' },
        {
          value: '800',
          unit: 'free credits',
          note: 'When you sign up. Valid for 30 days, no card required',
        },
      ],
      example:
        'This workflow has 6 tasks, so a run costs 6 credits. However long it runs, however many rounds of rework, it’s still 6.',
      exampleLabel: 'Task graph of the example workflow, one credit per task',
      modelNote:
        'Model usage stays on the agent subscriptions you already have. CodeDAG never bills by the token.',
      link: 'See pricing and common questions',
    },
    closing: {
      title: {
        waitlist: ['The private beta opens soon.', 'Save your spot.'],
        beta: ['The private beta is underway.', 'Request an invite.'],
        live: ['Hand your first DAG', 'to the engine.'],
      },
      body: {
        waitlist:
          'Invites go out by email, in batches. Everyone invited gets free credits while the beta runs.',
        beta: 'Invites go out by email, in batches. Everyone invited gets free credits while the beta runs.',
        live: '800 free credits when you sign up. Valid for 30 days, no card required.',
      },
      docsLink: 'Read the docs first',
    },
  },

  ja: {
    meta: {
      title: 'CodeDAG — コーディングエージェントのオーケストレーションエンジン',
      description:
        'CodeDAG は、コーディングエージェントのためのオーケストレーションエンジンです。開発タスクとその依存関係を 1 つのワークフローファイルに書くと、手元のマシンで依存関係に従ってスケジュールします。各タスクは新しいエージェントセッションと専用のブランチで進み、結果は統合ブランチに自動でマージされます。メインブランチにマージするかどうかは自分で決められます。',
    },
    tasks: [
      '仕様を書く',
      'テストを書く',
      'API を実装',
      'UI を実装',
      'テストを通す',
      '差分をレビュー',
    ],
    hero: {
      title: ['*コード*はエージェント。', '*DAG* はエンジン。'],
      lead: [
        'CodeDAG はコーディングエージェントのオーケストレーションエンジン。',
        'プロンプトを依存関係でつなげば DAG。',
        'タスクが増えても順序は崩れません。',
        '人の見張りにも、モデルの記憶にも頼りません。',
      ],
      docsLink: 'ドキュメントを読む',
      status: {
        waitlist: '契約済みのエージェントを手元のマシンで動かします · ベータ期間中は無料クレジット付き',
        beta: '契約済みのエージェントを手元のマシンで動かします · ベータ期間中は無料クレジット付き',
        live: '契約済みのエージェントを手元のマシンで動かします · 登録すると 800 クレジットを無料進呈',
      },
      stage: {
        label:
          'イメージアニメーション：ワークフロー site-search を投入すると、6 つのタスクが依存関係に沿って自動で進みます。仕様を書き終えると、API・UI・テストが同時に進み、テストを通し、差分をレビューして、結果が統合ブランチにまとまります。',
        progress: '{n}/6 完了',
        pause: 'アニメーションを一時停止',
        play: 'アニメーションを再生',
      },
    },
    burden: {
      tag: 'CodeDAG なし',
      title: ['いまは、あなたがそのエンジン。', '席を外せば、すべて止まる。'],
      body: 'ターミナルをいくつも開いて、どれも次のプロンプト待ち。依存関係を覚えて、終わったら次を起動し、ブランチも自分でマージします。',
      stage: {
        label:
          'イメージ図：CodeDAG を使わない場合、3 つのエージェントセッションがどれも止まり、次のプロンプトが入力されるのを待っています。',
        you: 'あなた',
        waiting: '{n} 件が待機中',
        done: '完了。次のプロンプト待ち。',
        question: '確認したいことがあります。',
      },
    },
    capabilities: {
      label: '仕組み',
      turn: 'CodeDAG あり',
      orchestrate: {
        name: 'オーケストレーション',
        title: ['順序は決定論的に。', '中身はエージェントに。'],
        body: '依存関係を明示すると、エンジンがトポロジカル順にスケジュールします。上流が終われば、下流はすぐに始まります。次に何を実行するかを決めるのは DAG で、モデルではありません。各タスクはプロンプトひとつ。ゴールを書けば十分。手順は書かなくてもかまいません。',
        chips: ['タスクごとに新しいセッション', 'コードのように検証・再実行・改訂', 'DAG はエージェントに書かせてもいい'],
        stage: {
          label:
            'イメージ図：ワークフローファイル site-search.yaml のうち、依存関係を宣言した行は CodeDAG のエンジンが実行し、各タスクのプロンプトは新しい Claude Code または Codex のセッションに渡されます。実行中は、仕様が承認されるとエンジンが API・UI・テストを並列に開始し、3 つすべてが承認されるとテストを通す作業を、続いて差分のレビューを開始します。投入してから戻るまでのあいだ、ユーザーは不在です。',
          specPrompt: 'docs/search.md を読み、docs/spec.md を書く。',
          testPrompt: 'docs/spec.md に沿ってテストを書く。',
          engine: 'CodeDAG エンジン',
          engineTag: 'エンジン',
          you: 'あなた',
          workspace: 'ワークスペース {n}',
          submit: '投入',
          back: '戻り',
          away: '不在',
        },
      },
      steer: {
        name: '介入',
        title: ['すべて見える。', 'いつでも止められる。'],
        body: '各タスクは、中に入れるセッションです。いつでも様子を見て、直接指示できます。一時停止も、強制停止も、復旧もできます。同じセッションで再開し、コンテキストもそのままです。',
        chips: ['完全なログをリアルタイムで追える', 'タスク単位でも全体でも止められる', 'レビューゲートは好きな場所に'],
        stage: {
          label:
            'イメージ図：ステータスボードでは、タスク 2 が完了してレビューを待ち、タスク 3 は強制停止されていますがセッションは残っています。タスク 4 は実行中で、そのセッションに入ってエージェントに修正を指示します。一時停止、強制停止、復旧はそれぞれコマンド 1 つで、ここでは復旧によってタスク 3 を同じセッションの続きから再開します。',
          waiting: 'レビュー待ち',
          kept: 'セッションは保持',
          message: '既存の Table を使って',
          pause: '一時停止',
          kill: '強制停止',
          recover: '復旧',
        },
      },
      merge: {
        name: 'マージ',
        title: ['ブランチは自動でマージ。', '`main` はそのまま。'],
        body: 'タスクごとに専用のブランチ。上流の結果は下流へ自動でマージされ、コンフリクトはエージェントが解消します。タスク単位で破棄もやり直しもできます。最後は 1 本の統合ブランチにまとまり、main に入れるかどうかは自分で決められます。',
        chips: [
          '並列タスクは別々のワークスペースで',
          '変更はタスクごとに確認できる',
          '破棄してもスナップショットが残る',
        ],
        stage: {
          label:
            'イメージ図：6 つのタスクはそれぞれ専用のブランチを持ち、依存関係の順に合流します。「テストを通す」が始まる前に、並列の 3 本のブランチが自動でマージされ、その際のコンフリクトはエージェントが解消しています。最後は統合ブランチ cdg/site-search/integration にまとまります。main に新しいコミットはなく、マージするかどうかは自分で決めます。',
          noCommits: '新しいコミットなし',
          yourCall: 'あなた次第',
          reworked: '一度やり直し',
          merged: '自動マージ',
          resolved: 'コンフリクト解消',
        },
      },
      philosophyLink: 'これらの選択を支える 8 つの設計理念',
    },
    fit: {
      label: '向いている仕事',
      title: ['DAG が描けるなら、', '任せられる。'],
      cards: [
        {
          name: '仕様を決めて、手分けして作る',
          body: '仕様を決めたら、各パートを並列で作り、最後にまとめて通します。',
          label: 'タスクグラフ：1 つのタスクのあと 2 つが並列に進み、1 つに合流する',
        },
        {
          name: '複数の変更を同時に',
          body: '依存関係のない変更はそれぞれのブランチで進み、最後に自動でマージされます。',
          label: 'タスクグラフ：独立した 4 つのタスクが並列に進み、最後に合流する',
        },
        {
          name: '一方が書き、もう一方がレビュー',
          body: 'Claude Code が実装し、Codex がレビューして修正します。逆でもかまいません。',
          label: 'タスクグラフ：2 種類のエージェントが交互に担当する 4 つのタスクの連鎖',
        },
        {
          name: 'ひとつずつ、ひと晩かけて',
          body: '大きなリファクタリングを十数個の直列タスクに。前の結果を受けて次へ進みます。見張りは不要です。',
          label: 'タスクグラフ：12 個のタスクが 1 本の長い連鎖になり、直列に実行される',
        },
      ],
      link: 'Claude Code Dynamic Workflow と比べる',
      agents: '現在は Claude Code と Codex に対応しています。',
    },
    local: {
      label: 'データプライバシー',
      title: ['コードは、', '一行も私たちには送られない。'],
      facts: [
        {
          title: 'コードはアップロードしない',
          body: 'コード、ログ、セッションは受け取りません。',
          received: '届くのは、ログイン情報、ワークフローファイル、CLI バージョンなどの環境情報だけです。',
        },
        {
          title: 'エージェントは置き換えない',
          body: '動かすのはあなたのエージェントです。利用分は契約済みのサブスクリプションでまかなわれ、トークン料金はかかりません。',
        },
        {
          title: 'メインブランチには触れない',
          body: 'メインブランチにコミットせず、リモートへのプッシュもプルもしません。',
        },
      ],
      diagram: {
        label:
          'データ境界のイメージ図。あなたのマシンにはリポジトリがあり、Claude Code と Codex がその中で直接読み書きします。エージェントはこれまでどおり、自分のアカウントでそれぞれのモデルサービスに直接接続し、コードとコンテキストが通るのはこの経路だけです。CodeDAG の CLI である cdg も同じマシン上で動き、エージェントのセッションを起動します。cdg から CodeDAG アカウントサービスへの線は、ログインとクレジットのためだけのものです。アカウントサービスが受け取るのは、ログインとクレジットの計算に必要な情報だけです。ワークフローファイルは計算後すぐ破棄し、保存しません。リポジトリのコード、実行ログ、セッションの内容は CodeDAG には送られません。',
        machine: 'あなたのマシン',
        repo: 'リポジトリ',
        repoNote: 'エージェントが直接読み書き',
        cli: 'CodeDAG の CLI',
        starts: 'セッションを起動',
        agentCargo: 'コードとコンテキスト',
        providers: 'モデルサービス',
        direct: 'これまでどおり、自分のアカウントで直接接続',
        serviceCargo: 'ログインとクレジット',
        service: 'CodeDAG アカウントサービス',
        receives: 'ログインとクレジット計算に必要な情報だけ',
        discard: 'ワークフローファイルは計算後すぐ破棄し、保存しません。',
        kept: 'CodeDAG には送らない',
        keptItems: ['リポジトリのコード', '実行ログ', 'セッションの内容'],
      },
      link: 'CodeDAG が受け取るデータのすべて',
    },
    pricing: {
      label: '料金',
      title: ['課金はタスク単位。', '1 タスク 1 クレジット。'],
      figures: [
        { value: '$12', unit: '/月', note: '年払いは $96（月あたり $8、33% お得）' },
        { value: '800', unit: 'クレジット/月', note: 'コミット約 800 回分。1 日あたり 25 回以上' },
        { value: '800', unit: '無料クレジット', note: '登録時に進呈。30 日間有効、カード登録は不要' },
      ],
      example:
        'このワークフローは 6 タスクなので、1 回の実行で 6 クレジットです。どれだけ長く走っても、何度やり直しても、6 クレジットのままです。',
      exampleLabel: 'サンプルワークフローのタスクグラフ。タスクごとに 1 クレジット',
      modelNote:
        'モデルの利用分は、契約済みのエージェントのサブスクリプションでまかなわれます。CodeDAG がトークン単位で課金することはありません。',
      link: '料金とよくある質問を見る',
    },
    closing: {
      title: {
        waitlist: ['プライベートベータ、まもなく開始。', '先に登録を。'],
        beta: ['プライベートベータ実施中。', '招待を申請する。'],
        live: ['最初の DAG を、', 'エンジンに任せる。'],
      },
      body: {
        waitlist:
          '招待はメールで順次お送りします。招待された方は、ベータ期間中に無料クレジットを利用できます。',
        beta: '招待はメールで順次お送りします。招待された方は、ベータ期間中に無料クレジットを利用できます。',
        live: '登録すると 800 クレジットを無料で進呈します。30 日間有効で、カード登録は不要です。',
      },
      docsLink: '先にドキュメントを読む',
    },
  },
};

// 不换行空格。写成字符码，源码里不留看不见的字符
const NBSP = String.fromCharCode(0xa0);

/**
 * 正文里不该在空格处折行的地方：[匹配, 把其中的空格换成不换行空格的写法]。
 * 没有空格可换的词（如“任务”「差し引」）由页面组件的 prose() 包成不换行的一段。
 */
const BOUND_PHRASES: [RegExp, string][] = [
  // 产品名与命令。带功能名的全称排在前面：整个名字不拆，放不下就整个另起一行
  [/Claude Code Dynamic Workflow/g, `Claude${NBSP}Code${NBSP}Dynamic${NBSP}Workflow`],
  [/Claude Code/g, `Claude${NBSP}Code`],
  [/git (worktree|clone)/g, `git${NBSP}$1`],
  [/cdg (dag|task) ([a-z]+)/g, `cdg${NBSP}$1${NBSP}$2`],
  [/API key/g, `API${NBSP}key`],
  [/AI モデル/g, `AI${NBSP}モデル`],
  [/タスク ID/g, `タスク${NBSP}ID`],
  [/CPU アーキテクチャ/g, `CPU${NBSP}アーキテクチャ`],
  [/CLI (版本|バージョン)/g, `CLI${NBSP}$1`],
  // 任务和它的编号：task 1、Tasks 2 and 3、任务 2、タスク 1
  [/\b([Tt]asks?) (?=\d)/g, `$1${NBSP}`],
  [/(\d) and (?=\d)/g, `$1${NBSP}and${NBSP}`],
  [/(任务|タスク) (?=\d)/g, `$1${NBSP}`],
  // 数字和它后面的量词、单位：800 credits、800 commits、1 点、30 天、800 次、1 つ、1 日、800 クレジット
  [/(\d) (?=credits?\b|commits?\b|days\b|tasks?\b|点|天|轮|个|次|つ|回|本|日|クレジット|アカウント|タスク)/g, `$1${NBSP}`],
  // 日文：西文词或数字后面的助词、接尾词跟着前面的词走，不落到下一行行首
  [/([A-Za-z0-9]) (?=[がはをにでとのもやへ側])/g, `$1${NBSP}`],
  // 中文：西文词后面的“的”同理
  [/([A-Za-z0-9]) (?=的)/g, `$1${NBSP}`],
  [/你的 prompt/g, `你的${NBSP}prompt`],
  // 按钮旁说明句里的分隔点跟着前一句走，折行时落到下一行的是后半句，不是一个孤零零的点
  [/ · /g, `${NBSP}· `],
];

/** 这些键下面是标题、描述，或者舞台里按真实格式排的内容与替代文字，保持原样 */
const UNBOUND_KEYS = new Set(['meta', 'tasks', 'stage', 'diagram']);

/**
 * 把一组文案里的正文换成不会在词中间折行的写法（BOUND_PHRASES）。
 * 给搜索引擎和分享卡片用的 meta，以及会被复制的工作流片段和命令不处理。
 */
export function bindPhrases<T>(value: T): T {
  if (typeof value === 'string') {
    return BOUND_PHRASES.reduce<string>((text, [from, to]) => text.replace(from, to), value) as T;
  }
  if (Array.isArray(value)) return value.map(bindPhrases) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        UNBOUND_KEYS.has(key) ? item : bindPhrases(item),
      ]),
    ) as T;
  }
  return value;
}

const bound = bindPhrases(translations);

export function getHomepageTranslations(locale: string): HomepageTranslations {
  return bound[locale as SupportedLocale] ?? bound.en;
}
