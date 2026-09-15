import { createRegistry } from '@gradial/aci';
import { CategoryRail } from '@/components/CategoryRail';
import { Cart } from '@/components/Cart';
import { ContactForm } from '@/components/ContactForm';
import { DataTable } from '@/components/DataTable';
import { EditorialHero } from '@/components/EditorialHero';
import { ErrorPage } from '@/components/ErrorPage';
import { FeaturedStories } from '@/components/FeaturedStories';
import { HomeHero } from '@/components/HomeHero';
import { HelpCenter } from '@/components/HelpCenter';
import { ImageCardGrid } from '@/components/ImageCardGrid';
import { InfoSplit } from '@/components/InfoSplit';
import { LinkColumns } from '@/components/LinkColumns';
import { NewsletterCallout } from '@/components/NewsletterCallout';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductListing } from '@/components/ProductListing';
import { RepairBanner } from '@/components/RepairBanner';
import { ServiceHero } from '@/components/ServiceHero';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavigation } from '@/components/SiteNavigation';
import { SearchPanel } from '@/components/SearchPanel';
import { StoreLocator } from '@/components/StoreLocator';
import { StoryGrid } from '@/components/StoryGrid';
import { StoryDetail } from '@/components/StoryDetail';
import { StepGrid } from '@/components/StepGrid';
import { TrustBar } from '@/components/TrustBar';
import { TextFeature } from '@/components/TextFeature';
import { categoryRailContract } from './contracts/components/categoryRail.contract';
import { cartContract } from './contracts/components/cart.contract';
import { contactFormContract } from './contracts/components/contactForm.contract';
import { dataTableContract } from './contracts/components/dataTable.contract';
import { editorialHeroContract } from './contracts/components/editorialHero.contract';
import { errorPageContract } from './contracts/components/errorPage.contract';
import { featuredStoriesContract } from './contracts/components/featuredStories.contract';
import { homeHeroContract } from './contracts/components/homeHero.contract';
import { helpCenterContract } from './contracts/components/helpCenter.contract';
import { imageCardGridContract } from './contracts/components/imageCardGrid.contract';
import { infoSplitContract } from './contracts/components/infoSplit.contract';
import { linkColumnsContract } from './contracts/components/linkColumns.contract';
import { newsletterCalloutContract } from './contracts/components/newsletterCallout.contract';
import { productGridContract } from './contracts/components/productGrid.contract';
import { productDetailContract } from './contracts/components/productDetail.contract';
import { productListingContract } from './contracts/components/productListing.contract';
import { repairBannerContract } from './contracts/components/repairBanner.contract';
import { serviceHeroContract } from './contracts/components/serviceHero.contract';
import { siteFooterContract } from './contracts/components/siteFooter.contract';
import { siteNavigationContract } from './contracts/components/siteNavigation.contract';
import { searchPanelContract } from './contracts/components/searchPanel.contract';
import { storeLocatorContract } from './contracts/components/storeLocator.contract';
import { storyGridContract } from './contracts/components/storyGrid.contract';
import { storyDetailContract } from './contracts/components/storyDetail.contract';
import { stepGridContract } from './contracts/components/stepGrid.contract';
import { trustBarContract } from './contracts/components/trustBar.contract';
import { textFeatureContract } from './contracts/components/textFeature.contract';

// Register your [contract, component] pairs here.
// See .agents/skills/authoring/SKILL.md for how to add components.
export const registry = createRegistry([
  [categoryRailContract, CategoryRail],
  [cartContract, Cart],
  [contactFormContract, ContactForm],
  [dataTableContract, DataTable],
  [editorialHeroContract, EditorialHero],
  [errorPageContract, ErrorPage],
  [featuredStoriesContract, FeaturedStories],
  [homeHeroContract, HomeHero],
  [helpCenterContract, HelpCenter],
  [imageCardGridContract, ImageCardGrid],
  [infoSplitContract, InfoSplit],
  [linkColumnsContract, LinkColumns],
  [newsletterCalloutContract, NewsletterCallout],
  [productGridContract, ProductGrid],
  [productDetailContract, ProductDetail],
  [productListingContract, ProductListing],
  [repairBannerContract, RepairBanner],
  [serviceHeroContract, ServiceHero],
  [siteFooterContract, SiteFooter],
  [siteNavigationContract, SiteNavigation],
  [searchPanelContract, SearchPanel],
  [storeLocatorContract, StoreLocator],
  [storyGridContract, StoryGrid],
  [storyDetailContract, StoryDetail],
  [stepGridContract, StepGrid],
  [trustBarContract, TrustBar],
  [textFeatureContract, TextFeature],
]);
