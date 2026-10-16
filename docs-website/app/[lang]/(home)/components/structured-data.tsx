import { siteConfig } from '@/lib/config';
import { getHomepageTranslations } from '@/lib/homepage-translations';
import { getPricingTranslations } from '@/lib/pricing-translations';
import { getLanguagePrefix } from '@/lib/url';

/**
 * 首页的结构化数据（JSON-LD，schema.org 词汇），让搜索引擎把品牌、官网和产品对上号。
 * 三种语言共用，随语言变的只有简介、首页与定价页的地址和两种付款周期的名称。
 * 只写页面和用户文档里能核实的内容：
 * - 操作系统：发布说明 0.1.0 的“平台与安装”和常见问题“支持 Windows 吗？”都写着支持 macOS 和 Linux
 * - 价格：与定价页一致（月付 $12／月，年付 $96／年）
 * 不写评分、用户数；sameAs 等有了真实的社交账号再加。
 */
export function StructuredData({ lang }: { lang: string }) {
  const { meta } = getHomepageTranslations(lang);
  const { plan } = getPricingTranslations(lang);
  const prefix = getLanguagePrefix(lang);
  const organizationId = `${siteConfig.baseUrl}/#organization`;
  const pricingUrl = `${siteConfig.baseUrl}${prefix}/pricing`;

  const offer = (name: string, price: number, billingDuration: string) => ({
    '@type': 'Offer',
    name,
    price,
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'USD',
      billingDuration,
    },
    url: pricingUrl,
  });

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteConfig.siteName,
        url: siteConfig.baseUrl,
        logo: `${siteConfig.baseUrl}/brand/codedag-mark-light-512.png`,
      },
      {
        '@type': 'SoftwareApplication',
        name: siteConfig.siteName,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'macOS, Linux',
        // 与页面输出的规范地址一致：英文首页是 https://codedag.com，其余语言带前缀
        url: `${siteConfig.baseUrl}${prefix}`,
        description: meta.description,
        publisher: { '@id': organizationId },
        offers: [offer(plan.monthly, 12, 'P1M'), offer(plan.yearly, 96, 'P1Y')],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // 转义 <，文案里即使出现 </script> 也不会提前结束这段脚本
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
