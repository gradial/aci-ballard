/**
 * ACI Conformance Tests
 *
 * Validates that the site conforms to canonical ACI integration patterns.
 * See https://docs.gradial.com/aci/testing for details.
 */
import { conformancePreset } from '@gradial/aci/testing';

conformancePreset({
  framework: 'next',
  siteId: 'aci-ballard',
});
