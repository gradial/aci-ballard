import type { ContentProps } from '@/cms/contracts/components/helpCenter.contract';

export function HelpCenter({ heading, introduction, faqGroups, sizes, info }: ContentProps) {
  return <div className="help-center section-pad">
    <h1>{heading}</h1><p className="help-intro">{introduction}</p>
    <div className="help-columns"><div>{faqGroups.map((group) => <section id={group.heading === 'Orders and shipping' ? 'orders' : group.heading === 'Returns and exchanges' ? 'returns' : 'repair'} key={group.heading}><h2>{group.heading}</h2>{group.questions.map((question) => <details key={question.title}><summary><span>{question.title}</span><i aria-hidden="true">⌄</i></summary><p>{question.answer}</p></details>)}</section>)}</div>
      <div><section><h2>Size and fit</h2><p>Measurements in inches. Every product page has a fit note that says how that piece runs. Read it before you use this table.</p><table><thead><tr><th>Size</th><th>Chest</th><th>Waist</th></tr></thead><tbody>{sizes.map((row) => <tr key={row.size}><td>{row.size}</td><td>{row.chest}</td><td>{row.waist}</td></tr>)}</tbody></table><small>{"Ballard Field runs to 5XL. Kids' sizes are by age and height on each product page."}</small></section>
        {info.map((item) => <section id={item.heading.toLowerCase().replaceAll(' ', '-')} key={item.heading}><h2>{item.heading}</h2><p>{item.text}</p></section>)}
      </div>
    </div>
  </div>;
}
