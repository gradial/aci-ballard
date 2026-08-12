const UNIT = '(?:px|rem|em|vh|vw|dvh|dvw|svh|svw|ch|ex|cap|ic|lh|rlh|cm|mm|in|pt|pc|%)';
const HEX_OR_LENGTH = new RegExp(`#[0-9a-fA-F]{3,8}\\b|\\d+(?:\\.\\d+)?${UNIT}`);
const RATIO_ONLY = /^\d+\/\d+$/;
const VARIANT_PREFIX = /^(!)?(?:(?:hover|focus|focus-within|focus-visible|active|disabled|visited|checked|first|last|odd|even|sm|md|lg|xl|2xl|dark|light|motion-safe|motion-reduce|portrait|landscape|print|rtl|ltr|open|placeholder|before|after|first-line|first-letter|selection|marker|group-hover|group-focus|peer-hover|peer-focus|has|not|aria-\w+|data-\w+):)*/;

function extractArbitrary(token) {
  const bare = token.replace(VARIANT_PREFIX, '');
  const open = bare.indexOf('[');
  if (open === -1) return null;
  const close = bare.lastIndexOf(']');
  if (close <= open) return null;
  return bare.slice(open + 1, close);
}

function isBadArbitrary(content) {
  // Allow anything containing a CSS variable reference.
  if (content.includes('var(--')) return false;
  // Allow values with no digits (selectors, keywords like `&>div`).
  if (!/\d/.test(content) && !content.includes('#')) return false;
  // Strip a leading data-type hint like `length:` or `color:`.
  const value = content.replace(/^[a-z-]+:/, '');
  if (RATIO_ONLY.test(value)) return false;
  if (HEX_OR_LENGTH.test(value)) return true;
  // Unitless numeric value (e.g. z-[60], w-[300]). Flag.
  if (/\d/.test(value)) return true;
  return false;
}

function findBadClassTokens(classString) {
  const tokens = classString.trim().split(/\s+/).filter(Boolean);
  const bad = [];
  for (const token of tokens) {
    const arb = extractArbitrary(token);
    if (arb !== null && isBadArbitrary(arb)) {
      bad.push(token);
    }
  }
  return bad;
}

function findBadStyleMatches(styleString) {
  // Strip var(--...) references so legitimate token names containing digits don't match.
  const stripped = styleString.replace(/var\([^)]*\)/g, '');
  const matches = stripped.match(new RegExp(HEX_OR_LENGTH.source, 'g'));
  return matches || [];
}

function reportClass(context, node, value) {
  if (typeof value !== 'string' || !value.includes('[')) return;
  const bad = findBadClassTokens(value);
  if (bad.length > 0) {
    context.report({
      node,
      message: `Raw arbitrary Tailwind values are not allowed: ${bad.join(', ')}. Use design system tokens (var(--...)) instead.`
    });
  }
}

function reportStyle(context, node, value) {
  if (typeof value !== 'string') return;
  const bad = findBadStyleMatches(value);
  if (bad.length > 0) {
    context.report({
      node,
      message: `Raw values are not allowed in inline style: ${bad.join(', ')}. Use design system tokens (var(--...)) instead.`
    });
  }
}

/** @type {import('eslint').Rule.RuleModule} */
const noRawTailwindValues = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow raw hex/length values in Tailwind arbitrary values and inline style attributes; require design tokens via var(--...).'
    },
    schema: []
  },
  create(context) {
    function handleClassNode(node, value) {
      reportClass(context, node, value);
    }

    function handleStyleStringNode(node, value) {
      reportStyle(context, node, value);
    }

    function visitClassLiteral(node) {
      handleClassNode(node, node.value);
    }
    function visitClassTemplate(node) {
      for (const quasi of node.quasis) handleClassNode(node, quasi.value.raw);
    }

    return {
      // JSX/Astro class attribute
      [`JSXAttribute[name.name=/^(class|className)$/] > Literal`]: visitClassLiteral,
      [`JSXAttribute[name.name=/^(class|className)$/] > TemplateLiteral`]: visitClassTemplate,

      // Object-form { class: '...' } (e.g. clsx args, defineProps defaults)
      'Property[key.name="class"] > Literal'(node) {
        handleClassNode(node, node.value);
      },
      'Property[key.name="class"] > TemplateLiteral'(node) {
        for (const quasi of node.quasis) handleClassNode(node, quasi.value.raw);
      },

      // JSX/Astro style="..." (string form, common in Astro and HTML)
      'JSXAttribute[name.name="style"] > Literal'(node) {
        handleStyleStringNode(node, node.value);
      },
      'JSXAttribute[name.name="style"] > TemplateLiteral'(node) {
        for (const quasi of node.quasis) handleStyleStringNode(node, quasi.value.raw);
      },

      // React style={{ color: '#fff', padding: '10px' }}
      'JSXAttribute[name.name="style"] JSXExpressionContainer > ObjectExpression > Property > Literal'(node) {
        if (typeof node.value === 'string') handleStyleStringNode(node, node.value);
      },
      'JSXAttribute[name.name="style"] JSXExpressionContainer > ObjectExpression > Property > TemplateLiteral'(node) {
        for (const quasi of node.quasis) handleStyleStringNode(node, quasi.value.raw);
      }
    };
  }
};

export default noRawTailwindValues;
