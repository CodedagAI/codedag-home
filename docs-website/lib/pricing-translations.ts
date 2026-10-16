/**
 * 定价页三语文案。
 *
 * 价格、额度等商业口径与用户文档 content/docs/account/credits-and-subscription.zh.mdx 一致；
 * 三种主页模式下文案相同，只有订阅按钮的目标和它下方的说明随模式变化。
 */

import type { Mailbox } from '@/components/email';
import { bindPhrases, type Heading, type SupportedLocale } from './homepage-translations';
import type { SiteMode } from './site-mode';

/** 答案里的一段文字、一个链接，或一个邮箱（只写 @ 前面的名字，地址由 Email 组件拼出来） */
export type AnswerPart = string | { text: string; href: string } | { email: Mailbox };

export interface PricingTranslations {
  meta: {
    title: string;
    description: string;
  };
  title: Heading;
  lead: string;
  plan: {
    name: string;
    billingLabel: string;
    monthly: string;
    yearly: string;
    yearlySaving: string;
    priceMonthly: string;
    priceMonthlyUnit: string;
    priceYearly: string;
    priceYearlyUnit: string;
    yearlyNote: string;
    monthlyNote: string;
    includes: string[];
    modelNote: string;
    taxNote: string;
    /** 订阅按钮下方的说明，随主页模式变化；live 模式没有 */
    entryNote: Record<SiteMode, string>;
  };
  free: {
    title: string;
    body: string;
  };
  charge: {
    title: Heading;
    lead: string;
    steps: { title: string; body: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: AnswerPart[] }[];
  };
}

const translations: Record<SupportedLocale, PricingTranslations> = {
  zh: {
    meta: {
      title: '定价',
      description:
        'CodeDAG 只有一个订阅方案：月付 $12，年付 $96（折合每月 $8），每月 800 点额度，每个任务扣 1 点。注册即送 800 点，30 天有效，无需绑卡。',
    },
    title: ['按任务计费，', '一个任务扣 1 点。'],
    lead: 'CodeDAG 只有一个订阅方案，所有用户功能相同。',
    plan: {
      name: 'CodeDAG 订阅',
      billingLabel: '付款周期',
      monthly: '月付',
      yearly: '年付',
      yearlySaving: '省 33%',
      priceMonthly: '$12',
      priceMonthlyUnit: '/月',
      priceYearly: '$96',
      priceYearlyUnit: '/年',
      yearlyNote: '折合 $8/月，比月付省 33%',
      monthlyNote: '按月续费',
      includes: [
        '每月 800 点额度，每月重置一次，当月没用完的不累计',
        '年付同样按月发放，不是一次发放全年的额度',
        '所有功能，没有功能分级',
        '随时可以取消，当前周期结束时生效',
      ],
      modelNote: '订阅不包含第三方 AI 模型的费用：Claude Code 与 Codex 的用量照常计在你自己的账号上。',
      taxNote: '适用的税费以结账页为准。',
      entryNote: {
        waitlist:
          '以上是公测期间的价格。目前只开放 Waitlist 申请，还不能购买。获邀参加内测的用户，内测期间享有免费额度。',
        beta: '以上是公测期间的价格。目前只开放内测申请，还不能购买。获邀参加内测的用户，内测期间享有免费额度。',
        live: '',
      },
    },
    free: {
      title: '先用免费额度',
      body: '注册即送 800 点，30 天内有效，无需绑卡，每个账号一次。免费期间与订阅之后能用的功能完全相同；订阅后，剩余的额度并入第一个付费周期。',
    },
    charge: {
      title: '额度在什么时候扣',
      lead: '只在一个时刻扣：工作流排到队首、真正开始执行之前，按任务数一次扣清。',
      steps: [
        { title: '提交', body: '检查剩余额度够不够，不扣。' },
        { title: '排队', body: '不扣。开始执行之前取消，不产生费用。' },
        { title: '开始执行', body: '按工作流里的任务数扣除，每个任务 1 点。' },
        { title: '执行与审核', body: '不再扣。暂停后继续、中断后恢复、要求修改或重做，都不会再扣。' },
      ],
    },
    faq: {
      title: '常见问题',
      items: [
        {
          question: '什么操作消耗额度？',
          answer: [
            '只有执行工作流才消耗额度：用 cdg dag submit 提交的工作流开始执行时，按任务数扣除，每个任务 1 点；提交和排队本身不扣。同一个工作流再执行一次，是一次新的执行，重新计费。已经扣除的额度不会自动退回：开始执行之后，无论任务失败、被你取消，还是结果不理想，都不退。如果是 CodeDAG 自身的问题导致工作流没能正常执行，可以写信到 ',
            { email: 'hi' },
            '。',
          ],
        },
        {
          question: '免费额度是什么？',
          answer: [
            '新账号注册即送 800 点 CodeDAG 额度，从注册那天起 30 天内有效，不需要绑定信用卡，每个账号一次。免费期间与订阅之后能用的功能完全相同。订阅后，剩余的免费额度并入第一个付费周期。',
          ],
        },
        {
          question: '免费额度用完或到期之后会怎样？',
          answer: [
            '需要订阅才能继续提交工作流；已经在排队的工作流也不会开始执行。免费额度不需要绑卡，所以不会自动扣费。',
          ],
        },
        {
          question: '订阅的当月额度用完了怎么办？',
          answer: [
            '等下一次重置，或者另外注册一个账号。订阅额度每月重置一次；新账号的额度和订阅都单独计算，不与原账号合并。CodeDAG 暂不提供额度补充包，切换月付和年付也不会带来新的额度。',
          ],
        },
        {
          question: '年付和月付有什么不同？',
          answer: [
            '除了年付更便宜，只是付款周期不同。年付每年 $96，折合每月 $8，比月付省 33%。额度同样是每月 800 点，按月发放，不是一次发放全年的额度，当月没用完的也不累计。',
          ],
        },
        {
          question: '订阅包含 Claude Code 或 Codex 的费用吗？',
          answer: [
            '不包含。CodeDAG 调用你自己安装并登录的 Claude Code 或 Codex，Agent 的用量照常计在你自己的账号上。同时执行的任务是几个独立的会话，一起消耗同一个账号的用量限额，所以并发越高，一个窗口的限额用完得越快。估算与控制的办法，见文档中的“',
            { text: '控制成本', href: '/docs/account/cost-control' },
            '”一页。',
          ],
        },
        {
          question: '可以取消吗？能退款吗？',
          answer: [
            '订阅随时可以取消，在当前付款周期结束时生效，在此之前额度照常可用。已付费用原则上不退款，例外只有重复扣费、计费故障和法律要求退款的情形，细则见',
            { text: '退款政策', href: '/refund' },
            '。',
          ],
        },
        {
          question: '税费怎么算？',
          answer: ['适用的税费以结账页为准。'],
        },
        {
          question: 'CodeDAG 会上传我的代码吗？',
          answer: [
            '不会。任务在你的电脑上执行，除登录时的账号信息外，CodeDAG 服务只接收计算和扣除额度所需的信息：工作流文件的内容（包括其中的 prompt）、相对路径与格式，任务 ID，以及 CLI 版本、操作系统与处理器架构。仓库里的代码和运行日志都不会上传，详见文档中“',
            { text: '你的数据边界', href: '/docs/account/login-and-account#data-boundary' },
            '”一节。',
          ],
        },
        {
          question: '连不上 CodeDAG 服务时会怎样？',
          answer: [
            '已经在执行的工作流通常照常工作。新的提交会失败，服务恢复后重新提交即可；排队中的工作流轮到执行时无法扣除额度，会停下来，服务恢复后执行 cdg dag recover 就能继续。',
          ],
        },
        {
          question: '有企业版吗？',
          answer: [
            '目前没有。CodeDAG 只有一个订阅方案，所有用户功能相同。有其他需要，可以写信到 ',
            { email: 'hi' },
            '。',
          ],
        },
      ],
    },
  },

  en: {
    meta: {
      title: 'Pricing',
      description:
        'CodeDAG has one plan: $12 a month or $96 a year ($8 a month), with 800 credits each month at one credit per task. New accounts get 800 free credits for 30 days, no card required.',
    },
    title: ['Billed by the task.', 'One credit each.'],
    lead: 'CodeDAG has a single plan, and everyone gets the same features.',
    plan: {
      name: 'CodeDAG subscription',
      billingLabel: 'Billing interval',
      monthly: 'Monthly',
      yearly: 'Yearly',
      yearlySaving: 'save 33%',
      priceMonthly: '$12',
      priceMonthlyUnit: '/ month',
      priceYearly: '$96',
      priceYearlyUnit: '/ year',
      yearlyNote: 'Works out to $8 a month, 33% less than monthly',
      monthlyNote: 'Renews every month',
      includes: [
        '800 credits each month, reset once a month, with no rollover',
        'Yearly billing still grants credits month by month, not a year’s worth at once',
        'Every feature, with no feature tiers',
        'Cancel any time; cancellation takes effect at the end of the current period',
      ],
      modelNote:
        'A subscription does not cover third-party AI model costs: Claude Code and Codex usage still counts against your own accounts.',
      taxNote: 'Applicable taxes are determined at checkout.',
      entryNote: {
        waitlist:
          'These are the public beta prices. For now you can only join the waitlist, so there is nothing to buy on this page yet. People invited to the private beta get free credits while the beta runs.',
        beta: 'These are the public beta prices. For now you can only request beta access, so there is nothing to buy on this page yet. People invited to the private beta get free credits while the beta runs.',
        live: '',
      },
    },
    free: {
      title: 'Start with free credits',
      body: 'New accounts get 800 credits, valid for 30 days, with no card required. One grant per account. You get the same features on free credits as on a subscription, and when you subscribe, whatever is left carries into your first paid period.',
    },
    charge: {
      title: 'When credits are deducted',
      lead: 'At exactly one moment: when a workflow reaches the front of the queue and is about to start. Credits for all of its tasks are deducted at once.',
      steps: [
        { title: 'Submit', body: 'Checks that you have enough credits. Nothing is deducted.' },
        {
          title: 'Queue',
          body: 'Nothing is deducted. Cancel before it starts and it costs nothing.',
        },
        {
          title: 'Start',
          body: 'Credits are deducted for the tasks in the workflow, one credit each.',
        },
        {
          title: 'Run and review',
          body: 'Nothing more is deducted, whether you pause and resume, recover after an interrupt, request changes, or rework a task.',
        },
      ],
    },
    faq: {
      title: 'Common questions',
      items: [
        {
          question: 'What uses credits?',
          answer: [
            'Only running a workflow you submit with cdg dag submit. Credits are deducted when the workflow starts, one per task. Submitting it and waiting in the queue cost nothing. Running the same workflow again is a new run and is charged again. Deducted credits are not returned automatically: once a workflow has started, they are not refunded if a task fails, if you cancel it, or if the result disappoints. If a problem on CodeDAG’s side kept a workflow from running properly, write to ',
            { email: 'hi' },
            '.',
          ],
        },
        {
          question: 'What are the free credits?',
          answer: [
            'Every new account starts with 800 CodeDAG credits. They are valid for 30 days from the day you sign up, need no credit card, and are granted once per account. You get the same features on free credits as on a subscription. When you subscribe, any free credits you have left carry into your first paid period.',
          ],
        },
        {
          question: 'What happens when my free credits run out or expire?',
          answer: [
            'You need a subscription to keep submitting workflows, and workflows already in the queue will not start. Free credits need no card, so nothing is charged automatically.',
          ],
        },
        {
          question: 'What if I use up a month’s credits on a subscription?',
          answer: [
            'Wait for the next reset, or sign up for a second account. Subscription credits reset once a month; a second account has its own credits and its own subscription, separate from your first. CodeDAG does not sell credit top-up packs for now, and switching between monthly and yearly billing does not add credits.',
          ],
        },
        {
          question: 'How is yearly billing different from monthly?',
          answer: [
            'Apart from the lower price, the only difference is how often you pay. Yearly is $96 a year, which works out to $8 a month, 33% less than monthly. You still get 800 credits each month: they are granted month by month, not as a year’s worth at once, and unused credits do not roll over.',
          ],
        },
        {
          question: 'Does a subscription cover Claude Code or Codex?',
          answer: [
            'No. CodeDAG drives the Claude Code or Codex you have installed and signed in to, and their usage counts against your own accounts as usual. Tasks that run at the same time are separate sessions drawing on the same account’s usage limit, so the more you run in parallel, the faster you use up that limit. For ways to estimate and control this, see ',
            { text: 'Control Cost', href: '/docs/account/cost-control' },
            ' in the docs.',
          ],
        },
        {
          question: 'Can I cancel? Can I get a refund?',
          answer: [
            'You can cancel any time. Cancellation takes effect at the end of the current billing period, and your credits stay usable until then. Payments are generally non-refundable. The only exceptions are duplicate charges, billing system failures, and refunds required by law. See the ',
            { text: 'refund policy', href: '/refund' },
            ' for details.',
          ],
        },
        {
          question: 'What about taxes?',
          answer: ['Applicable taxes are determined at checkout.'],
        },
        {
          question: 'Does CodeDAG upload my code?',
          answer: [
            'No. Tasks run on your machine. Apart from account details at sign-in, the CodeDAG service receives only what it needs to count and deduct credits: the workflow file’s contents (prompts included), its relative path and format, task IDs, the CLI version, and your operating system and CPU architecture. Your repository’s code and run logs are never uploaded. See ',
            { text: 'Where your data goes', href: '/docs/account/login-and-account#data-boundary' },
            ' in the docs.',
          ],
        },
        {
          question: 'What happens when the CodeDAG service is unreachable?',
          answer: [
            'Workflows that are already running usually carry on. New submissions fail, and you can submit again once the service is back. A queued workflow whose turn comes cannot have its credits deducted, so it stops; once the service is back, cdg dag recover picks it up.',
          ],
        },
        {
          question: 'Is there an enterprise plan?',
          answer: [
            'Not at this time. CodeDAG has one plan, and everyone gets the same features. If you need something else, write to ',
            { email: 'hi' },
            '.',
          ],
        },
      ],
    },
  },

  ja: {
    meta: {
      title: '料金',
      description:
        'CodeDAG のプランは 1 つです。月払い $12、年払い $96（月あたり $8）で、毎月 800 クレジット。タスク 1 つにつき 1 クレジットを消費します。登録すると 800 クレジットが付与されます（30 日間有効、カードの登録は不要）。',
    },
    title: ['課金はタスク単位。', '1 タスク 1 クレジット。'],
    lead: 'CodeDAG のプランは 1 つだけで、どのユーザーも同じ機能を使えます。',
    plan: {
      name: 'サブスクリプション',
      billingLabel: '支払いサイクル',
      monthly: '月払い',
      yearly: '年払い',
      yearlySaving: '33% お得',
      priceMonthly: '$12',
      priceMonthlyUnit: '/月',
      priceYearly: '$96',
      priceYearlyUnit: '/年',
      yearlyNote: '月あたり $8、月払いより 33% お得',
      monthlyNote: '毎月更新',
      includes: [
        '毎月 800 クレジット（月に 1 回リセット、繰り越しなし）',
        '年払いでもクレジットは月ごとに付与され、1 年分をまとめて付与するわけではありません',
        'すべての機能を利用可能（機能別のプランはなし）',
        'いつでも解約可能（解約後も現在の期間が終わるまで利用可）',
      ],
      modelNote:
        'サブスクリプションに、サードパーティ AI モデルの料金は含まれません。Claude Code と Codex の利用分は、これまでどおりご自身のアカウントに計上されます。',
      taxNote: '適用される税金は、決済画面でご確認いただけます。',
      entryNote: {
        waitlist:
          'これはパブリックベータの料金です。現在はウェイトリストへの登録だけを受け付けており、このページからはまだ購入できません。プライベートベータに招待された方は、ベータ期間中に無料クレジットを利用できます。',
        beta: 'これはパブリックベータの料金です。現在はベータ版への申し込みだけを受け付けており、このページからはまだ購入できません。プライベートベータに招待された方は、ベータ期間中に無料クレジットを利用できます。',
        live: '',
      },
    },
    free: {
      title: 'まずは無料クレジットで',
      body: '登録すると 800 クレジットが付与されます。30 日間有効で、カードの登録は不要、1 アカウントにつき 1 回です。無料期間中も、使える機能はサブスクリプションと同じです。サブスクリプションに登録すると、残りのクレジットは最初の有料期間に引き継がれます。',
    },
    charge: {
      title: 'クレジットが差し引かれるタイミング',
      lead: '差し引かれるのは 1 回だけです。ワークフローがキューの先頭に来て、実行が始まる直前に、タスク数の分をまとめて差し引きます。',
      steps: [
        { title: '投入', body: '残りのクレジットが足りるかを確認します。差し引きはありません。' },
        {
          title: 'キューで待機',
          body: '差し引きはありません。実行開始前に取り消せば、費用はかかりません。',
        },
        {
          title: '実行開始',
          body: 'ワークフロー内のタスク数に応じて、タスク 1 つにつき 1 クレジットを差し引きます。',
        },
        {
          title: '実行とレビュー',
          body: '一時停止からの再開、強制停止後の復旧、修正の依頼、やり直しのいずれでも、追加の差し引きはありません。',
        },
      ],
    },
    faq: {
      title: 'よくある質問',
      items: [
        {
          question: 'クレジットを消費するのはどの操作ですか？',
          answer: [
            'cdg dag submit で投入したワークフローの実行だけです。実行開始時に、タスク 1 つにつき 1 クレジットを差し引きます。投入しただけ、キューで待っているだけでは差し引かれません。同じワークフローをもう一度実行すると、新しい実行として、改めてクレジットが差し引かれます。差し引かれたクレジットが自動で戻ることはありません。実行が始まったあとは、タスクが失敗しても、取り消しても、結果に満足できなくても戻りません。CodeDAG 側の問題でワークフローが正常に実行されなかった場合は、',
            { email: 'hi' },
            ' までご連絡ください。',
          ],
        },
        {
          question: '無料クレジットとは何ですか？',
          answer: [
            '新しいアカウントには、登録時に CodeDAG クレジットが 800 付与されます。登録日から 30 日間有効で、クレジットカードの登録は不要、1 アカウントにつき 1 回です。無料期間中も、使える機能はサブスクリプションと同じです。サブスクリプションに登録すると、残りの無料クレジットは最初の有料期間に引き継がれます。',
          ],
        },
        {
          question: '無料クレジットを使い切るか、期限が切れるとどうなりますか？',
          answer: [
            'ワークフローの投入を続けるには、サブスクリプションが必要です。すでにキューにあるワークフローも実行を開始しません。無料クレジットにカードの登録は不要なので、自動で課金されることはありません。',
          ],
        },
        {
          question: 'サブスクリプションでその月のクレジットを使い切ったら？',
          answer: [
            '次のリセットを待つか、別のアカウントを新しく登録してください。サブスクリプションのクレジットは月に 1 回リセットされます。新しいアカウントのクレジットとサブスクリプションは別々に扱われ、元のアカウントとは合算されません。クレジット追加パックは現在提供しておらず、月払いと年払いを切り替えてもクレジットは増えません。',
          ],
        },
        {
          question: '年払いと月払いの違いは何ですか？',
          answer: [
            '年払いのほうが安いことを除けば、違うのは支払いの間隔だけです。年払いは年 $96、月あたり $8 で、月払いより 33% お得です。クレジットは同じく毎月 800 で、月ごとに付与されます。1 年分をまとめて付与するわけではなく、その月に使い切らなかった分の繰り越しもありません。',
          ],
        },
        {
          question: 'サブスクリプションに Claude Code や Codex の料金は含まれますか？',
          answer: [
            '含まれません。CodeDAG は、手元にインストール済みでログイン済みの Claude Code や Codex を呼び出します。エージェントの利用分は、これまでどおりご自身のアカウントに計上されます。同時に実行するタスクは別々のセッションで、同じアカウントの利用上限を一緒に消費するため、並列数を増やすほど上限に早く達します。見積もりと抑え方は、ドキュメントの',
            { text: 'コスト管理のページ', href: '/docs/account/cost-control' },
            'をご覧ください。',
          ],
        },
        {
          question: '解約や返金はできますか？',
          answer: [
            'サブスクリプションはいつでも解約できます。解約後も、現在の請求期間が終わるまではクレジットを通常どおり使えます。お支払い済みの料金は、原則として返金しません。例外は、重複請求、課金の不具合、法令で返金が求められる場合だけです。詳しくは',
            { text: '返金ポリシー', href: '/refund' },
            'をご覧ください。',
          ],
        },
        {
          question: '税金はどうなりますか？',
          answer: ['適用される税金は、決済画面でご確認いただけます。'],
        },
        {
          question: 'コードはアップロードされますか？',
          answer: [
            'いいえ。タスクは手元のマシンで実行されます。ログイン時のアカウント情報を除けば、CodeDAG のサービスが受け取るのは、クレジットの計算と差し引きに必要な情報だけです。ワークフローファイルの内容（プロンプトを含む）、相対パスと形式、タスク ID、CLI のバージョン、OS と CPU アーキテクチャがこれにあたります。リポジトリ内のコードと実行ログはアップロードされません。詳しくは、ドキュメントの',
            { text: 'データの扱いに関する説明', href: '/docs/account/login-and-account#data-boundary' },
            'をご覧ください。',
          ],
        },
        {
          question: 'CodeDAG のサービスに接続できないときはどうなりますか？',
          answer: [
            '実行中のワークフローは、通常そのまま進みます。新しい投入は失敗するので、サービスの復旧後にもう一度投入してください。キューで待っているワークフローは、順番が来てもクレジットを差し引けないため止まります。復旧後に cdg dag recover を実行すれば再開します。',
          ],
        },
        {
          question: 'エンタープライズプランはありますか？',
          answer: [
            '現時点ではありません。CodeDAG のプランは 1 つだけで、どのユーザーも同じ機能を使えます。ほかにご要望があれば、',
            { email: 'hi' },
            ' までご連絡ください。',
          ],
        },
      ],
    },
  },
};

const bound = bindPhrases(translations);

export function getPricingTranslations(locale: string): PricingTranslations {
  return bound[locale as SupportedLocale] ?? bound.en;
}
