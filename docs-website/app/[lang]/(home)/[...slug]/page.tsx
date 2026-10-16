import { notFound } from 'next/navigation';

/**
 * Catch-all route for unmatched paths
 * This ensures that any unmatched URL under [lang] triggers the not-found boundary
 * which will be wrapped by the layout (with Navbar and Footer)
 */
export default function CatchAllPage() {
  notFound();
}
