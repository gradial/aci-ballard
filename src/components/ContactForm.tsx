import type { ContentProps } from '@/cms/contracts/components/contactForm.contract';

export function ContactForm({ heading, description, kind }: ContentProps) {
  return <section className="contact-section section-pad">
    <div><h2>{heading}</h2><p>{description}</p></div>
    {kind === 'repair' ? <form action="/repair" method="get">
      <div className="form-pair"><label>Name<input name="name" required /></label><label>Email<input name="email" type="email" required /></label></div>
      <label>What is it<input name="item" placeholder="Salmon Bay Parka, slate, about 2019" /></label>
      <label>{"What's wrong"}<textarea name="issue" placeholder="Left cuff hook and loop worn out. Seam tape lifting inside the hood." /></label>
      <button type="submit">Send request</button>
    </form> : <form action="/field" method="get">
      <div className="form-pair"><label>Organization<input name="org" required /></label><label>Work email<input name="email" type="email" required /></label></div>
      <div className="form-pair"><label>Crew size<input name="size" inputMode="numeric" placeholder="250" /></label><label>Standards required<input name="standards" placeholder="ANSI/ISEA 107-2020 Class 3" /></label></div>
      <label>Notes<textarea name="notes" rows={3} /></label><button type="submit">Send request</button>
    </form>}
  </section>;
}
