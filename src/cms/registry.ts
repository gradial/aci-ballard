import { createRegistry } from '@gradial/aci';
import { FieldHero } from '@/components/FieldHero';
import { GearGrid } from '@/components/GearGrid';
import { ProcessSteps } from '@/components/ProcessSteps';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavigation } from '@/components/SiteNavigation';
import { WorkingStandard } from '@/components/WorkingStandard';
import { fieldHeroContract } from './contracts/components/fieldHero.contract';
import { gearGridContract } from './contracts/components/gearGrid.contract';
import { processStepsContract } from './contracts/components/processSteps.contract';
import { siteFooterContract } from './contracts/components/siteFooter.contract';
import { siteNavigationContract } from './contracts/components/siteNavigation.contract';
import { workingStandardContract } from './contracts/components/workingStandard.contract';

// Register your [contract, component] pairs here.
// See .agents/skills/authoring/SKILL.md for how to add components.
export const registry = createRegistry([
  [fieldHeroContract, FieldHero],
  [gearGridContract, GearGrid],
  [processStepsContract, ProcessSteps],
  [siteFooterContract, SiteFooter],
  [siteNavigationContract, SiteNavigation],
  [workingStandardContract, WorkingStandard],
]);
