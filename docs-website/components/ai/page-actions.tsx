'use client';
import { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLinkIcon,
  Pencil,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { cva } from 'class-variance-authority';
import { useParams } from 'next/navigation';
import { getPageActionsTranslations } from '@/lib/translations/page-actions';

const cache = new Map<string, string>();

const optionVariants = cva(
  'text-sm p-2 rounded-lg inline-flex items-center gap-2 hover:text-fd-accent-foreground hover:bg-fd-accent [&_svg]:size-4',
);

/**
 * Copy Page button with dropdown for Copy Page as Markdown and View as Markdown
 */
export function CopyPageButton({
  markdownUrl,
}: {
  markdownUrl: string;
}) {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const t = getPageActionsTranslations(lang);
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);

            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  // For dropdown copy action
  const [dropdownChecked, onDropdownCopyClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);

            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex">
      <button
        disabled={isLoading}
        className={cn(
          buttonVariants({
            color: 'secondary',
            size: 'sm',
            className: 'gap-2 rounded-r-none border-r-0 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
          }),
        )}
        onClick={onClick}
      >
        {checked ? <Check /> : <Copy />}
        {t.copyPage}
      </button>
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({
              color: 'secondary',
              size: 'sm',
              className: 'rounded-l-none px-1.5',
            }),
          )}
        >
          <ChevronDown className="size-3.5 text-fd-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col">
          <button
            disabled={isLoading}
            onClick={onDropdownCopyClick}
            className={cn(optionVariants())}
          >
            {dropdownChecked ? <Check className="size-4" /> : <Copy className="size-4" />}
            {t.copyPageAsMarkdown}
          </button>
          <a
            href={markdownUrl}
            rel="noreferrer noopener"
            target="_blank"
            className={cn(optionVariants())}
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Markdown</title>
              <path d="M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.308a1.73 1.73 0 01-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.461v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z" />
            </svg>
            {t.viewAsMarkdown}
            <ExternalLinkIcon className="text-fd-muted-foreground size-3.5 ms-auto" />
          </a>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * Edit on GitHub button
 */
export function EditOnGitHub({
  githubUrl,
}: {
  githubUrl: string;
}) {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const t = getPageActionsTranslations(lang);

  return (
    <a
      href={githubUrl}
      rel="noreferrer noopener"
      target="_blank"
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
        }),
      )}
    >
      <Pencil />
      {t.editOnGitHub}
    </a>
  );
}

/**
 * Open in AI dropdown with Claude, ChatGPT, Google AI Mode, Mistral
 */
export function OpenInAI({
  markdownUrl,
}: {
  markdownUrl: string;
}) {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const t = getPageActionsTranslations(lang);

  const items = useMemo(() => {
    const fullMarkdownUrl =
      typeof window !== 'undefined'
        ? new URL(markdownUrl, window.location.origin).toString()
        : 'loading';
    const q = t.aiPrompt(fullMarkdownUrl);

    return [
      {
        title: t.discussInClaude,
        href: `https://claude.ai/new?${new URLSearchParams({
          q,
        })}`,
        icon: (
          <svg
            fill="currentColor"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Anthropic</title>
            <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
          </svg>
        ),
      },
      {
        title: t.discussInChatGPT,
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: "search",
          q,
        })}`,
        icon: (
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>OpenAI</title>
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        ),
      },
      {
        title: t.discussInGoogleAI,
        href: `https://www.google.com/search?udm=50&source=searchlabs&q=${encodeURIComponent(
          q
        )}`,
        icon: (
          <svg
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Google</title>
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        ),
      },
      {
        title: t.discussInMistral,
        href: `https://chat.mistral.ai/chat?q=${encodeURIComponent(q)}`,
        icon: (
          <svg
            width="41"
            height="29"
            viewBox="0 0 41 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1323_477)">
              <path
                d="M11.7053 0H5.85156V5.79928H11.7053V0Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1272 0H29.2734V5.79928H35.1272V0Z"
                fill="currentColor"
              ></path>
              <path
                d="M17.559 5.79932H5.85156V11.5986H17.559V5.79932Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1293 5.79932H23.4219V11.5986H35.1293V5.79932Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1239 11.5986H5.85156V17.3979H35.1239V11.5986Z"
                fill="currentColor"
              ></path>
              <path
                d="M11.7053 17.3979H5.85156V23.1972H11.7053V17.3979Z"
                fill="currentColor"
              ></path>
              <path
                d="M23.4162 17.3979H17.5625V23.1972H23.4162V17.3979Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1272 17.3979H29.2734V23.1972H35.1272V17.3979Z"
                fill="currentColor"
              ></path>
              <path
                d="M17.5648 23.2007H0V29H17.5648V23.2007Z"
                fill="currentColor"
              ></path>
              <path
                d="M40.9867 23.2007H23.4219V29H40.9867V23.2007Z"
                fill="currentColor"
              ></path>
              <path
                d="M11.7072 0H5.85352V5.79928H11.7072V0Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1252 0H29.2715V5.79928H35.1252V0Z"
                fill="currentColor"
              ></path>
              <path
                d="M17.561 5.79932H5.85352V11.5986H17.561V5.79932Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1254 5.79932H23.418V11.5986H35.1254V5.79932Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1258 11.5986H5.85352V17.3979H35.1258V11.5986Z"
                fill="currentColor"
              ></path>
              <path
                d="M11.7072 17.3979H5.85352V23.1972H11.7072V17.3979Z"
                fill="currentColor"
              ></path>
              <path
                d="M23.4162 17.3979H17.5625V23.1972H23.4162V17.3979Z"
                fill="currentColor"
              ></path>
              <path
                d="M35.1252 17.3979H29.2715V23.1972H35.1252V17.3979Z"
                fill="currentColor"
              ></path>
              <path
                d="M17.5648 23.2007H0V29H17.5648V23.2007Z"
                fill="currentColor"
              ></path>
              <path
                d="M40.9828 23.2007H23.418V29H40.9828V23.2007Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_1323_477">
                <rect width="41" height="29" fill="currentColor"></rect>
              </clipPath>
            </defs>
          </svg>
        ),
      },
      // {
      //   title: t.discussInDeepSeek,
      //   href: `https://chat.deepseek.com/?${new URLSearchParams({
      //     hints: "search",
      //     q,
      //   })}`,
      //   icon: (
      //     <svg
      //       fill="currentColor"
      //       role="img"
      //       viewBox="0 0 35 26"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <g clipPath="url(#a)">
      //         <path
      //           fill="var(--dsw-alias-brand-primary)"
      //           d="M33.615 2.598c-.36-.176-.515.16-.726.33-.072.055-.132.127-.193.193-.526.562-1.14.93-1.943.887-1.174-.067-2.176.302-3.062 1.2-.188-1.107-.814-1.767-1.766-2.191-.498-.22-1.002-.441-1.35-.92-.244-.341-.31-.721-.433-1.096-.077-.226-.154-.457-.415-.496-.282-.044-.393.193-.504.391-.443.81-.614 1.702-.598 2.605.04 2.033.898 3.652 2.603 4.803.193.132.243.264.182.457-.116.397-.254.782-.376 1.179-.078.253-.194.308-.465.198-.936-.391-1.744-.97-2.458-1.669-1.213-1.173-2.31-2.467-3.676-3.48a16.254 16.254 0 0 0-.975-.668c-1.395-1.354.183-2.467.548-2.599.382-.138.133-.612-1.102-.606-1.234.005-2.364.42-3.803.97a4.34 4.34 0 0 1-.66.193 13.577 13.577 0 0 0-4.08-.143c-2.667.297-4.799 1.558-6.365 3.712C.116 8.436-.327 11.378.215 14.444c.57 3.233 2.22 5.91 4.755 8.002 2.63 2.17 5.658 3.233 9.113 3.03 2.098-.122 4.434-.403 7.07-2.633.664.33 1.362.463 2.518.562.892.083 1.75-.044 2.414-.182 1.04-.22.97-1.184.593-1.36-3.05-1.421-2.38-.843-2.99-1.311 1.55-1.834 3.918-5.093 4.648-9.531.072-.49.164-1.18.153-1.577-.006-.242.05-.336.326-.364a5.903 5.903 0 0 0 2.187-.672c1.977-1.08 2.774-2.853 2.962-4.978.028-.325-.006-.661-.35-.832ZM16.39 21.73c-2.956-2.324-4.39-3.089-4.982-3.056-.554.033-.454.667-.332 1.08.127.407.293.688.526 1.046.16.237.271.59-.161.854-.952.589-2.607-.198-2.685-.237-1.927-1.134-3.537-2.632-4.673-4.68-1.096-1.972-1.733-4.087-1.838-6.345-.028-.545.133-.738.676-.837A6.643 6.643 0 0 1 5.086 9.5c3.017.441 5.586 1.79 7.74 3.927 1.229 1.217 2.159 2.671 3.116 4.092 1.02 1.509 2.115 2.946 3.51 4.125.494.413.887.727 1.263.958-1.135.127-3.028.154-4.324-.87v-.002Zm1.417-9.114a.434.434 0 0 1 .587-.408c.06.022.117.055.16.105a.426.426 0 0 1 .122.303.434.434 0 0 1-.437.435.43.43 0 0 1-.432-.435Zm4.402 2.257c-.283.116-.565.215-.836.226-.421.022-.88-.149-1.13-.358-.387-.325-.664-.506-.78-1.073-.05-.242-.022-.617.022-.832.1-.463-.011-.76-.338-1.03-.265-.22-.603-.28-.974-.28a.8.8 0 0 1-.36-.11c-.155-.078-.283-.27-.161-.508.039-.077.227-.264.271-.297.504-.286 1.085-.193 1.623.022.498.204.875.578 1.417 1.107.553.639.653.815.968 1.295.25.374.476.76.632 1.2.094.275-.028.5-.354.638Z"
      //         ></path>
      //       </g>
      //     </svg>
      //   ),
      // },
    ];
  }, [markdownUrl, t]);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({
            color: 'secondary',
            size: 'sm',
            className: 'gap-2',
          }),
        )}
      >
        {t.askAI}
        <ChevronDown className="size-3.5 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            rel="noreferrer noopener"
            target="_blank"
            className={cn(optionVariants())}
          >
            {item.icon}
            {item.title}
            <ExternalLinkIcon className="text-fd-muted-foreground size-3.5 ms-auto" />
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}
