'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { WrapText } from 'lucide-react';
import * as Base from 'fumadocs-ui/components/codeblock';
import {
  DynamicCodeBlock as BaseDynamicCodeBlock,
  type DynamicCodeblockProps,
} from 'fumadocs-ui/components/dynamic-codeblock';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { cn } from '@/lib/cn';
import { wrapsByDefault } from '@/lib/code-wrap';
import { getCodeBlockTranslations } from '@/lib/translations/code-block';

export type CodeBlockProps = Base.CodeBlockProps & {
  /**
   * Whether long lines wrap initially; set at build time in source.config.ts.
   */
  'data-wrap'?: boolean;
};

// Adds a line-wrap toggle next to the copy button. The state is kept in memory only;
// `data-wrap` on the figure drives the CSS in app/global.css.
function useLineWrap({
  'data-wrap': defaultWrap = false,
  viewportProps,
  ...props
}: CodeBlockProps): CodeBlockProps {
  const [wrap, setWrap] = useState(defaultWrap);
  const params = useParams();
  const t = getCodeBlockTranslations((params?.lang as string) || 'en');

  return {
    ...props,
    'data-wrap': wrap,
    // without a title the buttons float over the code: leave room for both of them
    viewportProps: props.title
      ? viewportProps
      : {
          ...viewportProps,
          style: {
            '--padding-right': 'calc(var(--spacing) * 14)',
            ...viewportProps?.style,
          } as React.CSSProperties,
        },
    Actions: ({ className, children }) => (
      <div className={cn('flex items-center empty:hidden', className)}>
        <button
          type="button"
          aria-pressed={wrap}
          aria-label={t.wrapLines}
          title={t.wrapLines}
          className={cn(
            buttonVariants({
              className:
                'hover:text-fd-accent-foreground aria-pressed:bg-fd-accent aria-pressed:text-fd-accent-foreground',
              size: 'icon-xs',
            }),
          )}
          onClick={() => setWrap((v) => !v)}
        >
          <WrapText />
        </button>
        {children}
      </div>
    ),
  };
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  return (
    <Base.CodeBlock {...useLineWrap(props)}>
      <Base.Pre>{children}</Base.Pre>
    </Base.CodeBlock>
  );
}

export function DynamicCodeBlock({
  codeblock,
  ...props
}: DynamicCodeblockProps) {
  const wrapProps = useLineWrap({
    'data-wrap': wrapsByDefault(props.lang),
    ...codeblock,
  });

  return <BaseDynamicCodeBlock {...props} codeblock={wrapProps} />;
}
