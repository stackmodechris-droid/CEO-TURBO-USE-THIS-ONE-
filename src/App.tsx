import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import Home from "./pages/Home";

const named = <T extends Record<string, unknown>>(load: () => Promise<T>, key: keyof T) =>
  lazy(() => load().then((m) => ({ default: m[key] as React.ComponentType })));

const AudiencePage = lazy(() => import("./pages/AudiencePage"));
const ServicesHub = lazy(() => import("./pages/ServicesHub"));
const ServicePage = lazy(() => import("./pages/ServicePage"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Results = lazy(() => import("./pages/Results"));
const BrandBoost = lazy(() => import("./pages/BrandBoost"));
const ReviewCards = lazy(() => import("./pages/ReviewCards"));
const ReviewCardSetup = lazy(() => import("./pages/ReviewCardSetup"));
const FreeAudit = lazy(() => import("./pages/FreeAudit"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Book = lazy(() => import("./pages/Book"));
const Plan = lazy(() => import("./pages/Plan"));
const Booked = named(() => import("./pages/Book"), "Booked");
const NotFound = lazy(() => import("./pages/NotFound"));
const GuidesHub = named(() => import("./pages/Guides"), "GuidesHub");
const GuidePage = lazy(() => import("./pages/Guides").then((m) => ({ default: m.GuidePage })));
const About = named(() => import("./pages/Company"), "About");
const Contact = named(() => import("./pages/Company"), "Contact");
const Atlanta = named(() => import("./pages/Company"), "Atlanta");
const PrivacyPolicy = named(() => import("./pages/Legal"), "PrivacyPolicy");
const Terms = named(() => import("./pages/Legal"), "Terms");
const ShippingReturns = named(() => import("./pages/Legal"), "ShippingReturns");
const PromptShop = named(() => import("./pages/NotFound"), "PromptShop");

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artist" element={<AudiencePage slug="artist" />} />
          <Route path="/local-business" element={<AudiencePage slug="local-business" />} />
          <Route path="/shopify" element={<AudiencePage slug="shopify" />} />
          <Route path="/brand-boost" element={<BrandBoost />} />
          <Route path="/free-audit" element={<FreeAudit />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/book" element={<Book />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/booked" element={<Booked />} />
          <Route path="/google-review-cards" element={<ReviewCards />} />
          <Route path="/google-review-card-setup" element={<ReviewCardSetup />} />
          <Route path="/services" element={<ServicesHub />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<CaseStudy />} />
          <Route path="/results" element={<Results />} />
          <Route path="/guides" element={<GuidesHub />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/how-to-get-more-google-reviews" element={<GuidePage slugOverride="how-to-get-more-google-reviews" />} />
          <Route path="/atlanta" element={<Atlanta />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/promptshop" element={<PromptShop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
