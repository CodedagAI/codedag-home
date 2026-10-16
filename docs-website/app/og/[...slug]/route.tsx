import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generate as MetadataImage, getImageResponseOptions } from './generate';
import { ImageResponse } from '@takumi-rs/image-response';
import { getPageImage } from '@/lib/metadata';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/[...slug]'>,
) {
  const { slug } = await params;
  // 地址的写法见 lib/metadata.ts 的 getPageImage：非默认语言的图多一段语言前缀
  const segments = slug.slice(0, -1);
  const [first, ...rest] = segments;
  const prefixed =
    first !== i18n.defaultLanguage && (i18n.languages as readonly string[]).includes(first);
  const lang = prefixed ? first : i18n.defaultLanguage;
  const page = source.getPage(prefixed ? rest : segments, lang);
  if (!page) notFound();

  return new ImageResponse(
    <MetadataImage
      lang={lang}
      title={page.data.title}
      description={page.data.description}
    />,
    await getImageResponseOptions(lang, () =>
      source
        .getPages(lang)
        .map((p) => `${p.data.title ?? ''}${p.data.description ?? ''}`)
        .join(''),
    ),
  );
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
