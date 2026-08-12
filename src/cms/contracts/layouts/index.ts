const layoutContracts = [
  {
    name: 'default',
    slots: [
      { name: 'header', required: false },
      { name: 'main', required: true },
      { name: 'footer', required: false },
    ],
    defaults: {
      header: [{ kind: 'fragment-ref', fragmentId: 'navbar', inline: true }],
      footer: [{ kind: 'fragment-ref', fragmentId: 'site-footer', inline: true }],
    },
  },
];

export default layoutContracts;
