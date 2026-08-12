import '../src/design-system/styles.css';

const preview = {
  globalTypes: {
    theme: {
      description: 'Theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'sun',
        items: ['light', 'dark'],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    // Storybook decorator types are verbose; keep the starter example focused.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any, context: any) => {
      const theme = context.globals.theme || 'light';
      document.body.className = `theme-${theme} min-h-screen bg-[var(--color-surface-default)]`;
      return Story();
    }
  ],
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['Core Atomic Blocks', 'Composition', '*']
      }
    }
  }
};

export default preview;
