import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import type { ImageResponseOptions } from '@takumi-rs/image-response';

export interface GenerateProps {
  lang: string;
  title: ReactNode;
  description?: ReactNode;
}

interface OgFont {
  name: string;
  data: ArrayBuffer | Uint8Array;
  weight: number;
}

const font = readFile('./lib/og/JetBrainsMono-Regular.ttf').then((data) => ({
  name: 'Mono',
  data,
  weight: 400,
}));
const fontBold = readFile('./lib/og/JetBrainsMono-Bold.ttf').then((data) => ({
  name: 'Mono',
  data,
  weight: 600,
}));

/**
 * JetBrains Mono 没有中文、日文的字形。这两种语言的图另加 Noto Sans SC、Noto Sans JP，
 * 西文仍用 JetBrains Mono，它缺的字按 fontFamily 的顺序落到 CJK 字体上。
 * CJK 字体在构建时向 Google Fonts 取子集，只含该语言全部文档标题和描述里的非 ASCII 字符，
 * 每种语言取一次。和根布局用 next/font/google 取 Geist 一样，构建要能访问 Google Fonts；
 * 取不到时构建失败，不会生成缺字的图。
 */
const CJK_FAMILIES: Partial<Record<string, string>> = {
  zh: 'Noto Sans SC',
  ja: 'Noto Sans JP',
};
const cjkFonts = new Map<string, Promise<OgFont[]>>();

async function fetchCjkFonts(family: string, text: string): Promise<OgFont[]> {
  const query = `family=${family.replaceAll(' ', '+')}:wght@400;600&text=${encodeURIComponent(text)}`;
  const res = await fetch(`https://fonts.googleapis.com/css2?${query}`);
  if (!res.ok) throw new Error(`[og] ${family}: Google Fonts returned ${res.status}`);

  const faces = [
    ...(await res.text()).matchAll(/font-weight:\s*(\d+);[^}]*?src:\s*url\(([^)]+)\)/g),
  ];
  if (faces.length === 0) throw new Error(`[og] ${family}: no font faces in the CSS`);

  return Promise.all(
    faces.map(async ([, weight, url]) => {
      const file = await fetch(url);
      if (!file.ok) throw new Error(`[og] ${family} ${weight}: font file returned ${file.status}`);
      return { name: family, data: await file.arrayBuffer(), weight: Number(weight) };
    }),
  );
}

function fontFamily(lang: string): string {
  const cjk = CJK_FAMILIES[lang];
  return cjk ? `Mono, "${cjk}"` : 'Mono';
}

/** getText 返回该语言全部文档的标题和描述，只在第一次需要这种语言的 CJK 字体时调用 */
export async function getImageResponseOptions(
  lang: string,
  getText: () => string,
): Promise<ImageResponseOptions> {
  const family = CJK_FAMILIES[lang];
  let cjk = cjkFonts.get(lang);
  if (family && !cjk) {
    const chars = [...new Set(getText())].filter((c) => c.codePointAt(0)! > 0x7f).join('');
    cjk = fetchCjkFonts(family, chars);
    cjkFonts.set(lang, cjk);
  }

  return {
    width: 1200,
    height: 630,
    format: 'webp',
    fonts: [...(await Promise.all([font, fontBold])), ...(cjk ? await cjk : [])],
  };
}

/**
 * 减半切片标志，与 components/codedag-mark.tsx 同形，颜色取它在深色主题下的样子
 * （同 public/brand/codedag-mark-dark.svg）。分享图里的 SVG 单独栅格化，读不到页面的
 * CSS 变量和 currentColor，颜色直接写成取值：半圆用下面的文字色，三片是 app/home.css
 * 中深色主题的 --home-accent。画成 52 像素，每份 2 像素，竖边落在整像素上。
 */
const ACCENT = '#b899ff';

export function generate({ lang, title, description }: GenerateProps) {
  const siteName = 'CodeDAG';
  const primaryTextColor = 'rgb(240,240,240)';
  const logo = (
    <svg width="52" height="52" viewBox="0 0 26 26">
      <path fill={primaryTextColor} d="M14 0.039A13 13 0 0 1 14 25.961Z" />
      <path
        fill={ACCENT}
        d="M8 1A13 13 0 0 1 12 0.039L12 25.961A13 13 0 0 1 8 25ZM4 3.619A13 13 0 0 1 6 2.046L6 23.954A13 13 0 0 1 4 22.381ZM1 8A13 13 0 0 1 2 6.072L2 19.928A13 13 0 0 1 1 18Z"
      />
    </svg>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: 'rgb(10,10,10)',
        fontFamily: fontFamily(lang),
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        {/* 标题最多两行、描述最多四行，超出的以省略号结尾，下面的标志总在画面里 */}
        <span
          style={{
            fontWeight: 600,
            fontSize: '76px',
            lineHeight: 1.15,
            lineClamp: 2,
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: '40px',
            lineHeight: 1.35,
            marginTop: '28px',
            marginBottom: 0,
            color: 'rgba(240,240,240,0.7)',
            lineClamp: 4,
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginTop: 'auto',
            flexShrink: 0,
            color: primaryTextColor,
          }}
        >
          {logo}
          <span
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {siteName}
          </span>
        </div>
      </div>
    </div>
  );
}
