/**
 * Site configuration - centralized settings for the CodeDAG website
 *
 * Deployment domains:
 * - codedag.com: Main public site (homepage, pricing, policies, docs)
 * - app.codedag.com: Private app (login, payment, dashboard, usage management)
 */

export const siteConfig = {
  /**
   * Base URL for the site, used for SEO metadata, sitemap, and absolute URLs
   */
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://codedag.com',

  /**
   * App URL for the private app site (login, payment, dashboard)
   */
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.codedag.com',

  /**
   * Site name displayed in metadata and branding
   */
  siteName: 'CodeDAG',

  /**
   * Default language for the site (used when no language prefix in URL)
   */
  defaultLanguage: 'en' as const,

  /**
   * Supported languages
   */
  languages: ['en', 'zh', 'ja'] as const,

  /**
   * GitHub repository URL
   */
  githubUrl: 'https://github.com/CodedagAI/codedag-home',

  /**
   * Domain of the public contact addresses (hi@, legal@, privacy@). Pages never
   * write an address out: components/email.tsx builds it from the name before
   * the @ and prints it as character entities.
   */
  emailDomain: 'codedag.com',

  /**
   * Tally form IDs for the waitlist, one form per language.
   * /waitlist redirects to https://tally.so/r/<id>. The three forms share one
   * structure (email, agents in use, intended use, hidden fields lang/source);
   * only the wording differs, so their exports have the same columns.
   */
  waitlistForms: {
    en: 'PdMZRe',
    zh: 'q4x859',
    ja: 'QKgNoG',
  },
};

export type SupportedLanguage = (typeof siteConfig.languages)[number];
