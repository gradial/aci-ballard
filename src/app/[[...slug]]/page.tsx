import { createPage } from '@gradial/aci/next';
import { registry } from '@/cms/registry';

const page = createPage(registry);

export const dynamic = 'force-dynamic';
export const generateMetadata = page.generateMetadata;
export default page.default;