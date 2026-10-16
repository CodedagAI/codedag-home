'use client';

import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import type { Item, Node } from 'fumadocs-core/page-tree';
import { useRouter, useParams } from 'next/navigation';

export default function CustomSearchDialog(props: SharedProps) {
  const params = useParams();
  const locale = (params.lang as string) ?? 'en';

  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    api: '/api/search',
    locale,
  });

  // Page tree quick action: jump straight to a page whose title starts with the query
  const { full } = useTreeContext();
  const router = useRouter();
  const searchMap = useMemo(() => {
    const map = new Map<string, Item>();
    function onNode(node: Node) {
      if (node.type === 'page' && typeof node.name === 'string') {
        map.set(node.name.toLowerCase(), node);
      } else if (node.type === 'folder') {
        if (node.index) onNode(node.index);
        for (const item of node.children) onNode(item);
      }
    }
    for (const item of full.children) onNode(item);
    return map;
  }, [full]);

  const pageTreeAction = useMemo<SearchItemType | undefined>(() => {
    if (search.length === 0) return;
    const normalized = search.toLowerCase();
    for (const [k, page] of searchMap) {
      if (!k.startsWith(normalized)) continue;
      return {
        id: 'quick-action',
        type: 'action',
        node: (
          <div className="inline-flex items-center gap-2 text-fd-muted-foreground">
            <ArrowRight className="size-4" />
            <p>
              Jump to{' '}
              <span className="font-medium text-fd-foreground">
                {page.name}
              </span>
            </p>
          </div>
        ),
        onSelect: () => router.push(page.url),
      };
    }
  }, [router, search, searchMap]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>

        <SearchDialogList
          items={
            query.data !== 'empty' || pageTreeAction
              ? [
                  ...(pageTreeAction ? [pageTreeAction] : []),
                  ...(Array.isArray(query.data) ? query.data : []),
                ]
              : null
          }
        />

        <SearchDialogFooter className="flex flex-row flex-wrap gap-2 items-center justify-end">
          <a
            href="https://orama.com"
            rel="noreferrer noopener"
            className="text-xs text-nowrap text-fd-muted-foreground"
          >
            Powered by Orama
          </a>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
