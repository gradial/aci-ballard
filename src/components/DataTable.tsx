import type { ContentProps } from '@/cms/contracts/components/dataTable.contract';

export function DataTable({ heading, theme = 'white', columns, rows }: ContentProps) {
  return <section className={`data-table-section data-table-section--${theme} section-pad`}><h2>{heading}</h2><div className="data-table-scroll"><table>{columns.some(Boolean) && <thead><tr>{columns.map((column, index) => <th key={`${column}-${index}`}>{column}</th>)}</tr></thead>}<tbody>{rows.map((row) => <tr key={row.id}>{row.cells.map((cell, index) => <td key={`${row.id}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
}
