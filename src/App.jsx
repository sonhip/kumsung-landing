import { lazy, Suspense } from "react";
import { Button, Spin } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import TopBar from "./components/layout/TopBar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import ScrollReveal from "./components/ui/ScrollReveal";
import { SITE_TEXT } from "./constants/siteText";

const Stats = lazy(() => import("./components/sections/Stats"));
const PreviousWorks = lazy(() => import("./components/sections/PreviousWorks"));
const OurServices = lazy(() => import("./components/sections/OurServices"));
const OurCompany = lazy(() => import("./components/sections/OurCompany"));
const CTABanner = lazy(() => import("./components/sections/CTABanner"));
const ContactPage = lazy(() => import("./components/sections/ContactPage"));
const AboutPage = lazy(() => import("./components/sections/AboutPage"));

const { company, routes } = SITE_TEXT;

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.div>
);

const HomePage = () => {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <div className="route-page" aria-label={routes.loadingAriaLabel}>
            <Spin size="large" />
          </div>
        }
      >
        <ScrollReveal>
          <Stats />
        </ScrollReveal>
        <ScrollReveal>
          <PreviousWorks />
        </ScrollReveal>
        <ScrollReveal>
          <OurServices />
        </ScrollReveal>
        <ScrollReveal>
          <OurCompany />
        </ScrollReveal>
        <ScrollReveal>
          <CTABanner />
        </ScrollReveal>
      </Suspense>
    </>
  );
};

const RoutePage = ({ title, description }) => {
  return (
    <section className="route-page">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to="/contact">
          <Button className="hero-btn-primary" size="large" type="primary">
            {company.quoteButton}
          </Button>
        </Link>
      </div>
    </section>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/products"
          element={
            <PageTransition>
              <RoutePage
                title={routes.products.title}
                description={routes.products.description}
              />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="page-shell">
      <TopBar />
      <Header />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
