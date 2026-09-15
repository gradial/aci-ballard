import type { ContentProps } from '@/cms/contracts/components/searchPanel.contract';

export function SearchPanel({ description, suggestions }: ContentProps) {
  return <section className="search-panel section-pad"><form action="/search"><input name="q" autoFocus aria-label="Search" placeholder="Search gear and stories" /><button type="submit">Search</button></form><div><p>{description}</p><ul>{suggestions.map((suggestion) => <li key={suggestion}><a href={`/search?q=${encodeURIComponent(suggestion)}`}>{suggestion}</a></li>)}</ul></div></section>;
}
