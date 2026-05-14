import { CSSProperties, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { motion, type MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  ArrowRight,
  Buildings,
  Check,
  FileText,
  List,
  MapPin,
  SealCheck,
  X,
} from "@phosphor-icons/react";
import nexusLogo from "./assets/nexus-logo.svg";

type Page = "home" | "products" | "about" | "contact";

type NavItem = {
  label: string;
  page: Page;
  path: string;
};

type Product = {
  name: string;
  status: string;
  description: string;
  tags: string[];
};

const navItems: NavItem[] = [
  { label: "Home", page: "home", path: "#/" },
  { label: "Products", page: "products", path: "#/products" },
  { label: "About Us", page: "about", path: "#/about" },
  { label: "Contact Us", page: "contact", path: "#/contact" },
];

const products: Product[] = [
  {
    name: "Methanol",
    status: "Planned category",
    description:
      "Commodity alcohol for industrial supply conversations, subject to grade and documentation confirmation.",
    tags: ["Industrial solvent", "Bulk inquiry", "Documentation required"],
  },
  {
    name: "Cyclohexane",
    status: "Planned category",
    description:
      "Chemical raw material category for qualified buyers and supplier counterparties.",
    tags: ["Raw material", "Brokerage", "Commercial inquiry"],
  },
  {
    name: "Urea",
    status: "Planned category",
    description:
      "Fertilizer commodity category for international trading and sourcing discussions.",
    tags: ["Fertilizer", "Agriculture", "Supply inquiry"],
  },
  {
    name: "Caprolactam",
    status: "Planned category",
    description:
      "Intermediate chemical category for product availability and grade-specific discussions.",
    tags: ["Intermediate", "Industrial", "Grade pending"],
  },
  {
    name: "Fertilizers",
    status: "Planned category",
    description:
      "Selected fertilizer commodities handled through trading and brokerage channels.",
    tags: ["Commodity", "Procurement", "Trade desk"],
  },
  {
    name: "Basic Chemical Commodities",
    status: "Planned category",
    description:
      "Additional chemical raw materials to be listed as the commercial portfolio is finalized.",
    tags: ["Raw materials", "Flexible scope", "B2B supply"],
  },
];

const legalRows = [
  ["Company Name", "PT NEXUS CHEM BRIDGE"],
  ["Registration Number (NIB)", "1603260067144"],
  ["Tax Number (NPWP)", "1000000008827496"],
  ["Director", "Wibhi Leksono"],
  ["Legal Address", "Jalan Ratna No. 80, Tonja, Denpasar Utara, Kota Denpasar, Bali 80239, Indonesia"],
  ["KBLI 46100", "Wholesale trade on a fee or contract basis"],
  ["KBLI 46651", "Wholesale of chemical products, including industrial chemicals"],
];

const imageSources = {
  tanks: "/images/industrial-storage-tanks.jpg",
  methanol: "/images/methanol-plant.jpg",
  plant: "/images/chemical-processing-equipment.jpg",
};

function getCurrentPage(): Page {
  const hashRoute = window.location.hash.replace(/^#\/?/, "").split(/[?#]/)[0];
  if (hashRoute.startsWith("products")) return "products";
  if (hashRoute.startsWith("about")) return "about";
  if (hashRoute.startsWith("contact")) return "contact";

  const path = window.location.pathname;
  if (path.startsWith("/products")) return "products";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/contact")) return "contact";
  return "home";
}

function App() {
  const [page, setPage] = useState<Page>(getCurrentPage);

  useEffect(() => {
    const handlePop = () => setPage(getCurrentPage());
    window.addEventListener("popstate", handlePop);
    window.addEventListener("hashchange", handlePop);
    return () => {
      window.removeEventListener("popstate", handlePop);
      window.removeEventListener("hashchange", handlePop);
    };
  }, []);

  const navigate = (path: string, scrollTargetId?: string) => {
    window.history.pushState({}, "", path);
    const nextPage = getCurrentPage();
    setPage(nextPage);

    window.setTimeout(() => {
      if (scrollTargetId) {
        document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, nextPage === page ? 40 : 120);
  };

  return (
    <>
      <MotionRuntime page={page} />
      <Header page={page} navigate={navigate} />
      <main className={page === "home" ? "home-main" : undefined}>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "products" && <ProductsPage navigate={navigate} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer navigate={navigate} />
    </>
  );
}

function MotionRuntime({ page }: { page: Page }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.18,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });

    let frameId = 0;
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    const updateParallax = () => {
      const viewportHeight = window.innerHeight || 1;
      parallaxItems.forEach((item) => {
        const strength = Number(item.dataset.parallax || 0);
        const rect = item.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        item.style.setProperty("--parallax-y", `${progress * strength * -1}px`);
      });
    };

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      updateParallax();
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    const splitTargets = Array.from(document.querySelectorAll<HTMLElement>(".page-intro h1, .section-copy h2, .section-heading h2, .image-band h2"))
      .filter((target) => !target.closest(".home-cinematic"));
    const originalHeadings = splitTargets.map((target) => ({ target, html: target.innerHTML }));

    splitTargets.forEach((target) => {
      const words = target.textContent?.trim().split(/\s+/) ?? [];
      target.innerHTML = words
        .map((word) => `<span class="text-mask"><span>${word}</span></span>`)
        .join(" ");
    });

    const revealTargets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    revealTargets.forEach((target) => {
      const lines = target.querySelectorAll(".text-mask > span");

      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { yPercent: 112, opacity: 0.18 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.92,
            ease: "power4.out",
            stagger: 0.035,
            scrollTrigger: {
              trigger: target,
              start: "top 84%",
              once: true,
            },
          },
        );
      }

      const secondary = target.querySelectorAll<HTMLElement>("p, .hero-actions, .product-row, .trust-item, .legal-row, .field, .contact-card dl > div, img");

      gsap.fromTo(
        secondary,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.045,
          delay: lines.length ? 0.1 : 0,
          scrollTrigger: {
            trigger: target,
            start: "top 86%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        target,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.82,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.globalTimeline.clear();
      originalHeadings.forEach(({ target, html }) => {
        target.innerHTML = html;
      });
      lenis.destroy();
    };
  }, [page]);

  return null;
}

function Header({ page, navigate }: { page: Page; navigate: (path: string, scrollTargetId?: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className={`site-header ${page === "home" ? "home-header" : ""}`} data-reveal>
      <a
        className="brand-mark cursor-pointer"
        href="#/"
        onClick={(event) => {
          event.preventDefault();
          handleNav("#/");
        }}
        aria-label="PT NEXUS CHEM BRIDGE home"
      >
        <span className="brand-symbol" aria-hidden="true" />
        <span>PT NEXUS CHEM BRIDGE</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a
            key={item.page}
            href={item.path}
            className={item.page === page ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              handleNav(item.path);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="text-cta" type="button" onClick={() => navigate("#/contact", "contact-form")}>
          Discuss Supply
          <ArrowRight size={14} weight="bold" />
        </button>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" data-reveal>
          {navItems.map((item) => (
            <a
              key={item.page}
              href={item.path}
              onClick={(event) => {
                event.preventDefault();
                handleNav(item.path);
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              navigate("#/contact", "contact-form");
            }}
          >
            Request a Quote
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      )}
    </header>
  );
}

type ScrollSectionRenderProps = {
  progress: MotionValue<number>;
};

type ScrollSectionProps = {
  label?: string;
  title?: string;
  text?: string;
  height?: string;
  className?: string;
  children?: ReactNode | ((props: ScrollSectionRenderProps) => ReactNode);
};

type AnimatedCardData = {
  label: string;
  title: string;
  text: string;
  icon?: ReactNode;
};

function HomePage({ navigate }: { navigate: (path: string, scrollTargetId?: string) => void }) {
  return (
    <PageShell>
      <ConceptTopbar navigate={navigate} />
      <div className="home-cinematic">
        <SharedHelixBackground />

        <ScrollSection className="hero-scroll-stage" height="200vh">
          {({ progress }) => <HeroProductsScene progress={progress} />}
        </ScrollSection>

        <ScrollSection className="product-focus-scene" label="02" title="Products" height="175vh">
          {({ progress }) => <ProductFocusScene progress={progress} navigate={navigate} />}
        </ScrollSection>

        <ScrollSection className="trading-scope-scene" label="03" title="Trading scope" height="185vh">
          {({ progress }) => <TradingScopeScene progress={progress} />}
        </ScrollSection>

        <ScrollSection className="business-activity-scene" label="04" title="Business activities" height="180vh">
          {({ progress }) => <BusinessActivitiesScene progress={progress} />}
        </ScrollSection>

        <ScrollSection className="legal-information-scene" label="05" title="Company profile" height="190vh">
          {({ progress }) => <LegalInformationScene progress={progress} />}
        </ScrollSection>

        <ScrollSection className="contact-inquiry-scene" label="06" title="Contact inquiry" height="170vh">
          {({ progress }) => <ContactInquiryScene progress={progress} navigate={navigate} />}
        </ScrollSection>
      </div>
    </PageShell>
  );
}

function ScrollSection({ label, title, text, height = "180vh", className = "", children }: ScrollSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 78,
    damping: 24,
    mass: 0.55,
  });

  return (
    <section
      className={`scroll-section ${className}`.trim()}
      ref={sectionRef}
      style={{ "--scroll-section-height": height } as CSSProperties}
    >
      <div className="scroll-section__sticky">
        {typeof children === "function" ? (
          children({ progress })
        ) : (
          <div className="cinematic-scene">
            {label && <span className="cinematic-label">{label}</span>}
            {title && <AnimatedTitle progress={progress}>{title}</AnimatedTitle>}
            {text && <AnimatedParagraph progress={progress}>{text}</AnimatedParagraph>}
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

function AnimatedTitle({ progress, children, className = "" }: { progress: MotionValue<number>; children: ReactNode; className?: string }) {
  const opacity = useTransform(progress, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.2, 0.8, 1], [80, 0, 0, -80]);
  const scale = useTransform(progress, [0, 0.3, 1], [0.96, 1, 1.04]);

  return (
    <motion.h2 className={`animated-title ${className}`.trim()} style={{ opacity, y, scale }}>
      {children}
    </motion.h2>
  );
}

function AnimatedParagraph({ progress, children, className = "" }: { progress: MotionValue<number>; children: ReactNode; className?: string }) {
  const opacity = useTransform(progress, [0, 0.22, 0.78, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.28, 0.82, 1], [80, 0, 0, -56]);

  return (
    <motion.p className={`animated-paragraph ${className}`.trim()} style={{ opacity, y }}>
      {children}
    </motion.p>
  );
}

function AnimatedCards({ progress, cards, className = "" }: { progress: MotionValue<number>; cards: AnimatedCardData[]; className?: string }) {
  const opacity = useTransform(progress, [0, 0.16, 0.78, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.22, 0.82, 1], [70, 0, 0, -60]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const nextIndex = Math.max(0, Math.min(cards.length - 1, index));
    const slides = Array.from(track.querySelectorAll<HTMLElement>(".carousel-slide"));
    const nextCard = slides[nextIndex];
    if (!nextCard) return;

    setActiveIndex(nextIndex);
    track.scrollTo({
      left: nextCard.offsetLeft,
      behavior: "smooth",
    });
  };

  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    if (scrollFrameRef.current !== null) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const currentTrack = trackRef.current;
      if (!currentTrack) return;

      const slides = Array.from(currentTrack.querySelectorAll<HTMLElement>(".carousel-slide"));
      if (slides.length === 0) return;

      const trackCenter = currentTrack.scrollLeft + currentTrack.clientWidth / 2;
      const closestIndex = slides.reduce((closest, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const closestCard = slides[closest];
        const closestCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
        return Math.abs(cardCenter - trackCenter) < Math.abs(closestCenter - trackCenter) ? index : closest;
      }, 0);

      setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
    });
  };

  useEffect(() => {
    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [cards.length]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  return (
    <motion.div className={`animated-cards ${className}`.trim()} style={{ opacity, y }}>
      <div className="animated-cards-viewport">
        <div className="animated-cards-track" ref={trackRef} onScroll={handleTrackScroll}>
          {cards.map((card, index) => (
            <div className="carousel-slide" key={card.title}>
              <div className="card-shadow-wrapper">
                <AnimatedCard index={index}>
                  {card.icon && <div className="animated-card__icon">{card.icon}</div>}
                  <span>{card.label}</span>
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </AnimatedCard>
              </div>
            </div>
          ))}
        </div>
      </div>
      {cards.length > 1 && (
        <div className="carousel-controls" aria-label="Card carousel controls">
          <button
            className="carousel-arrow"
            type="button"
            aria-label="Previous card"
            disabled={activeIndex === 0}
            onClick={() => scrollToCard(activeIndex - 1)}
          >
            {"<"}
          </button>
          <button
            className="carousel-arrow"
            type="button"
            aria-label="Next card"
            disabled={activeIndex === cards.length - 1}
            onClick={() => scrollToCard(activeIndex + 1)}
          >
            {">"}
          </button>
          <div className="carousel-dots">
            {cards.map((card, index) => (
              <button
                className={`carousel-dot ${index === activeIndex ? "active" : ""}`.trim()}
                key={card.title}
                type="button"
                aria-label={`Go to card ${index + 1}`}
                onClick={() => scrollToCard(index)}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AnimatedCard({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div
      className="animated-card info-card"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.52, delay: index * 0.075, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SharedHelixBackground() {
  return <HeroHelixScene className="page-helix-scene shared-helix-background" />;
}

function ConceptTopbar({ navigate }: { navigate: (path: string, scrollTargetId?: string) => void }) {
  const [isConceptMenuOpen, setIsConceptMenuOpen] = useState(false);

  const handleLogoClick = () => {
    setIsConceptMenuOpen(false);
    if (getCurrentPage() !== "home") {
      navigate("#/");
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.nav
      className="concept-topbar"
      aria-label="Hero navigation"
      initial={false}
      onMouseEnter={() => setIsConceptMenuOpen(true)}
      onMouseLeave={() => setIsConceptMenuOpen(false)}
      onFocus={() => setIsConceptMenuOpen(true)}
      onBlur={(event) => {
        const nextFocus = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(nextFocus)) {
          setIsConceptMenuOpen(false);
        }
      }}
      animate={{
        height: isConceptMenuOpen ? 320 : 72,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        borderBottomLeftRadius: isConceptMenuOpen ? 32 : 36,
        borderBottomRightRadius: isConceptMenuOpen ? 32 : 36,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ x: "-50%" }}
    >
      <div className="concept-topbar-row">
        <button
          className="concept-menu"
          type="button"
          aria-label={isConceptMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isConceptMenuOpen}
          onClick={(event) => {
            event.preventDefault();
            if (window.matchMedia("(hover: none)").matches) {
              setIsConceptMenuOpen((value) => !value);
            }
          }}
        >
          <span />
          <span />
        </button>
        <button className="concept-mark" type="button" aria-label="Scroll to home start" onClick={handleLogoClick}>
          <img src={nexusLogo} alt="Nexus" />
        </button>
        <button className="concept-contact" type="button" onClick={() => navigate("#/contact", "contact-form")}>
          Contact us
        </button>
      </div>
      <motion.div
        className="concept-navbar-menu"
        initial={false}
        animate={{
          opacity: isConceptMenuOpen ? 1 : 0,
          y: isConceptMenuOpen ? 0 : -8,
          pointerEvents: isConceptMenuOpen ? "auto" : "none",
        }}
        transition={{
          duration: 0.3,
          delay: isConceptMenuOpen ? 0.12 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {navItems.map((item, index) => (
          <motion.a
            key={item.page}
            href={item.path}
            initial={false}
            animate={{
              opacity: isConceptMenuOpen ? 1 : 0,
              y: isConceptMenuOpen ? 0 : -8,
            }}
            transition={{
              duration: 0.28,
              delay: isConceptMenuOpen ? 0.16 + index * 0.045 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => {
              event.preventDefault();
              setIsConceptMenuOpen(false);
              navigate(item.path);
            }}
          >
            <span>{item.label}</span>
            <ArrowRight size={14} weight="bold" />
          </motion.a>
        ))}
      </motion.div>
    </motion.nav>
  );
}

function HeroProductsScene({ progress }: { progress: MotionValue<number> }) {
  const chemX = useTransform(progress, [0, 0.82], ["0vw", "-64vw"]);
  const bridgeX = useTransform(progress, [0, 0.82], ["0vw", "64vw"]);
  const wordOpacity = useTransform(progress, [0, 0.62], [1, 0]);
  const nexusY = useTransform(progress, [0, 0.58], ["0vh", "-18vh"]);
  const nexusOpacity = useTransform(progress, [0, 0.46], [1, 0]);
  const cardX = useTransform(progress, [0, 0.9], ["calc(-50% + 16vw)", "-50%"]);
  const cardY = useTransform(progress, [0, 0.9], ["8vh", "-50%"]);
  const cardScale = useTransform(progress, [0, 0.9], [0.96, 1.15]);
  const productTitleY = useTransform(progress, [0.38, 0.74], [60, 0]);
  const productTitleOpacity = useTransform(progress, [0.38, 0.68], [0, 1]);
  const productTextY = useTransform(progress, [0.46, 0.82], [80, 0]);
  const productTextOpacity = useTransform(progress, [0.46, 0.78], [0, 1]);

  return (
    <div className="hero-section concept-hero">
      <div className="concept-brand">
        <motion.h1 className="concept-title" style={{ y: nexusY, opacity: nexusOpacity }}>
          NEXUS
        </motion.h1>
        <motion.span className="concept-word concept-word-left" style={{ x: chemX, opacity: wordOpacity }}>
          CHEM
        </motion.span>
        <motion.span className="concept-word concept-word-right" style={{ x: bridgeX, opacity: wordOpacity }}>
          BRIDGE
        </motion.span>
      </div>

      <motion.div className="concept-product-copy">
        <motion.h2 style={{ y: productTitleY, opacity: productTitleOpacity }}>
          Industrial Chemical Products
        </motion.h2>
        <motion.p style={{ y: productTextY, opacity: productTextOpacity }}>
          We connect international buyers and suppliers of industrial chemicals, fertilizers,
          and essential raw materials through reliable trading and brokerage solutions.
        </motion.p>
      </motion.div>

      <motion.div
        className="concept-card"
        aria-label="Featured product"
        style={{ x: cardX, y: cardY, scale: cardScale }}
      >
        <div>
          <strong>Caprolactam</strong>
          <span>Formula</span>
        </div>
        <div className="concept-formula-box">
          <span>C6H11NO</span>
        </div>
        <div className="concept-card-nav" aria-hidden="true">
          <span>{"<"}</span>
          <span>{">"}</span>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </motion.div>
    </div>
  );
}

function ProductFocusScene({ progress, navigate }: { progress: MotionValue<number>; navigate: (path: string, scrollTargetId?: string) => void }) {
  const cards: AnimatedCardData[] = products.map((product) => ({
    label: product.status,
    title: product.name,
    text: product.description,
  }));
  const buttonOpacity = useTransform(progress, [0.28, 0.48, 0.84, 1], [0, 1, 1, 0]);
  const buttonY = useTransform(progress, [0.28, 0.52, 0.86, 1], [48, 0, 0, -44]);

  return (
    <div className="cinematic-scene product-focus-cinematic-scene">
      <span className="cinematic-label">02</span>
      <AnimatedTitle progress={progress}>Six starting categories for qualified chemical inquiries.</AnimatedTitle>
      <AnimatedParagraph progress={progress}>
        Product names, grade, origin, packaging, availability, and documentation are confirmed through direct commercial inquiry.
      </AnimatedParagraph>
      <AnimatedCards progress={progress} cards={cards} className="product-category-cards" />
      <motion.div className="cinematic-cta-row compact" style={{ opacity: buttonOpacity, y: buttonY }}>
        <button className="line-button" type="button" onClick={() => navigate("#/products")}>
          View Product Categories
          <ArrowRight size={18} weight="bold" />
        </button>
      </motion.div>
    </div>
  );
}

function TradingScopeScene({ progress }: { progress: MotionValue<number> }) {
  const cards: AnimatedCardData[] = [
    {
      label: "Scope",
      title: "International brokerage",
      text: "Qualified conversations between buyers, suppliers, and commercial counterparties.",
    },
    {
      label: "Products",
      title: "Industrial chemicals",
      text: "Methanol, cyclohexane, urea, caprolactam, fertilizers, and basic raw materials.",
    },
    {
      label: "Process",
      title: "Documentation first",
      text: "Grade, origin, volume, destination, and document needs are clarified before quoting.",
    },
  ];

  return (
    <div className="cinematic-scene split-cinematic-scene">
      <motion.div className="cinematic-index" style={{ opacity: useTransform(progress, [0, 0.12, 0.82, 1], [0, 1, 1, 0]) }}>
        <span>03</span>
        <p>Trading scope</p>
      </motion.div>
      <div className="cinematic-copy">
        <AnimatedTitle progress={progress}>Built for precise B2B chemical supply conversations.</AnimatedTitle>
        <AnimatedParagraph progress={progress}>
          PT NEXUS CHEM BRIDGE operates across international trading and brokerage of industrial chemicals,
          fertilizers, and related commodity raw materials.
        </AnimatedParagraph>
      </div>
      <AnimatedCards progress={progress} cards={cards} className="scope-cards" />
    </div>
  );
}

function BusinessActivitiesScene({ progress }: { progress: MotionValue<number> }) {
  const cards: AnimatedCardData[] = [
    {
      label: "KBLI 46100",
      title: "Wholesale trade on a fee or contract basis",
      text: "Commercial brokerage activity for qualified B2B trading relationships.",
      icon: <FileText size={20} weight="duotone" />,
    },
    {
      label: "KBLI 46651",
      title: "Wholesale of chemical products",
      text: "Industrial chemical product trading, including basic chemical commodities.",
      icon: <SealCheck size={20} weight="duotone" />,
    },
    {
      label: "License",
      title: "NIB 1603260067144",
      text: "Business identification serving as the main company license.",
      icon: <Check size={20} weight="bold" />,
    },
    {
      label: "Address",
      title: "Denpasar, Bali",
      text: "Legal address at Jalan Ratna No. 80, Tonja, Denpasar Utara.",
      icon: <MapPin size={20} weight="duotone" />,
    },
  ];

  return (
    <div className="cinematic-scene card-cinematic-scene">
      <span className="cinematic-label">04</span>
      <AnimatedTitle progress={progress}>Business activities are stated clearly before the first inquiry.</AnimatedTitle>
      <AnimatedParagraph progress={progress}>
        The site keeps legal scope close to the commercial path so buyers and suppliers can evaluate the company quickly.
      </AnimatedParagraph>
      <AnimatedCards progress={progress} cards={cards} className="activity-cards" />
    </div>
  );
}

function LegalInformationScene({ progress }: { progress: MotionValue<number> }) {
  const cards: AnimatedCardData[] = [
    { label: "Legal name", title: "PT NEXUS CHEM BRIDGE", text: "Indonesia-registered chemical trading and brokerage company." },
    { label: "NIB", title: "1603260067144", text: "Main business identification and license number." },
    { label: "NPWP", title: "1000000008827496", text: "Tax registration number for company verification." },
    { label: "Director", title: "Wibhi Leksono", text: "Registered company director." },
    { label: "Shareholders", title: "50% / 50%", text: "Ljubisa Stevanovic and Sabareesh Madhavan." },
    { label: "Address", title: "Jalan Ratna No. 80", text: "Tonja, Denpasar Utara, Kota Denpasar, Bali 80239, Indonesia." },
  ];

  return (
    <div className="cinematic-scene legal-cinematic-scene">
      <span className="cinematic-label">05</span>
      <AnimatedTitle progress={progress}>Company information stays visible, simple, and verifiable.</AnimatedTitle>
      <AnimatedParagraph progress={progress}>
        Registration, tax, address, director, and ownership details are presented without burying the inquiry path.
      </AnimatedParagraph>
      <AnimatedCards progress={progress} cards={cards} className="legal-cards" />
    </div>
  );
}

function ContactInquiryScene({ progress, navigate }: { progress: MotionValue<number>; navigate: (path: string, scrollTargetId?: string) => void }) {
  const buttonOpacity = useTransform(progress, [0.24, 0.46, 0.86, 1], [0, 1, 1, 0]);
  const buttonY = useTransform(progress, [0.24, 0.5, 0.86, 1], [52, 0, 0, -48]);

  return (
    <div className="cinematic-scene contact-cinematic-scene">
      <span className="cinematic-label">06</span>
      <AnimatedTitle progress={progress}>Start with product, volume, destination, and documents.</AnimatedTitle>
      <AnimatedParagraph progress={progress}>
        Send the commercial basics and the team can respond with a focused supply discussion instead of a generic catalog exchange.
      </AnimatedParagraph>
      <motion.div className="cinematic-cta-row" style={{ opacity: buttonOpacity, y: buttonY }}>
        <button className="primary-button inverse" type="button" onClick={() => navigate("#/contact", "contact-form")}>
          Start an Inquiry
          <ArrowRight size={18} weight="bold" />
        </button>
        <button className="line-button" type="button" onClick={() => navigate("#/about")}>
          View Company Details
          <ArrowRight size={18} weight="bold" />
        </button>
      </motion.div>
    </div>
  );
}

function HeroHelixScene({ className = "concept-helix-scene" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 7.2, 12.8);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0.2, 0.7, 9.1);
    camera.lookAt(0, -0.15, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0xffffff, 0);
    const isMobileViewport = () => window.matchMedia("(max-width: 768px)").matches;
    const getPixelRatio = () => Math.min(window.devicePixelRatio || 1, isMobileViewport() ? 1.5 : 1.8);
    renderer.setPixelRatio(getPixelRatio());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.58);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.12);
    keyLight.position.set(-2.6, 4.4, 4.8);
    keyLight.castShadow = true;
    const shadowMapSize = isMobileViewport() ? 1024 : 2048;
    keyLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 14;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf5f5f2, 0.92);
    fillLight.position.set(3.4, -1.1, 3.2);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const ribGeometries: RoundedBoxGeometry[] = [];
    const ribMaterials: THREE.MeshStandardMaterial[] = [];
    const ribs: Array<{ mesh: THREE.Mesh; baseRotationY: number }> = [];
    const ribCount = 128;
    const radius = 0.78;
    const verticalStep = 0.064;
    const angleStep = 0.31;
    const centerOffset = (ribCount - 1) / 2;

    for (let index = 0; index < ribCount; index += 1) {
      const progress = index / (ribCount - 1);
      const angle = index * angleStep;
      const y = (index - centerOffset) * verticalStep;
      const geometry = new RoundedBoxGeometry(1.48, 0.076, 0.32, 4, 0.024);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().lerpColors(
          new THREE.Color(0xecece8),
          new THREE.Color(0xfbfbfa),
          progress,
        ),
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0.9 + Math.sin(progress * Math.PI) * 0.1,
      });
      ribGeometries.push(geometry);
      ribMaterials.push(material);

      const rib = new THREE.Mesh(geometry, material);
      rib.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const baseRotationY = angle * 0.52 - 0.72;
      rib.rotation.set(0, baseRotationY, 0);
      rib.castShadow = true;
      rib.receiveShadow = true;
      ribs.push({ mesh: rib, baseRotationY });
      group.add(rib);
    }

    let width = 1;
    let height = 1;
    const resize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      renderer.setPixelRatio(getPixelRatio());
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const scale = width < 760 ? 1.24 : 1.48;
      group.scale.setScalar(scale);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const footer = document.querySelector<HTMLElement>(".site-footer");
    let frameId = 0;
    let currentProgress = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothStep = (edge0: number, edge1: number, value: number) => {
      const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
      return t * t * (3 - 2 * t);
    };

    const animate = (time: number) => {
      const stage = (mount.closest(".home-cinematic") ?? mount.closest(".hero-scroll-stage")) as HTMLElement | null;
      const rect = stage?.getBoundingClientRect();
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const pageProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      const rawProgress = rect
        ? Math.min(Math.max(-rect.top / Math.max(rect.height - window.innerHeight, 1), 0), 1.2)
        : Math.min(pageProgress * 1.25, 1.2);
      currentProgress += (rawProgress - currentProgress) * 0.075;
      const footerRect = footer?.getBoundingClientRect();
      const footerFade = footerRect
        ? Math.min(Math.max((window.innerHeight - footerRect.top + 40) / 260, 0), 1)
        : 0;
      const sectionBase = 0.92 - Math.min(currentProgress * 0.2, 0.2);
      const readabilityFade = smoothStep(0.52, 0.74, currentProgress) * (1 - smoothStep(0.86, 1.04, currentProgress));
      const contactReturn = smoothStep(0.86, 1.02, currentProgress) * 0.14;
      const opacityFloor = width < 760 ? 0.38 : 0.22;
      const helixOpacity = Math.max(opacityFloor, sectionBase - readabilityFade * 0.34 + contactReturn);
      const stableOpacity = Math.max(opacityFloor, (1 - footerFade * 0.72) * helixOpacity);
      mount.style.opacity = stableOpacity.toFixed(3);
      mount.style.transform = "translate3d(0, 0, 0)";

      const idle = reducedMotion ? 0 : time * 0.00016;
      const breathing = reducedMotion ? 0 : Math.sin(time * 0.00042) * 0.095;
      const roll = reducedMotion ? 0 : Math.sin(time * 0.00032) * 0.035;
      if (!reducedMotion) {
        ribs.forEach((rib, index) => {
          rib.mesh.rotation.y = rib.baseRotationY + Math.sin(time * 0.00072 + index * 0.18) * 0.022;
        });
      }
      group.position.set(
        width < 760 ? -0.38 + currentProgress * 0.12 : -0.64 + currentProgress * 0.22,
        -0.1 - currentProgress * 2.7 + breathing,
        -1.08 + currentProgress * 0.9 + breathing * 0.32,
      );
      group.rotation.set(
        THREE.MathUtils.degToRad(-14) + roll,
        -0.72 + currentProgress * 1.08 + idle,
        THREE.MathUtils.degToRad(10) - roll * 0.45,
      );

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      ribGeometries.forEach((geometry) => geometry.dispose());
      ribMaterials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}

function ProductsPage({ navigate }: { navigate: (path: string, scrollTargetId?: string) => void }) {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Products"
        title="Chemical categories for qualified commercial inquiries."
        text="The portfolio is provisional until exact product names, grades, and supply parameters are finalized. Each category routes to a direct inquiry path."
      />
      <section className="product-page-list" data-reveal>
        <h2 className="sr-only">Product categories</h2>
        <ProductRows navigate={navigate} />
      </section>
      <section className="split-section compact">
        <div className="section-index" data-reveal>
          <span>02</span>
          <p>How inquiries work</p>
        </div>
        <div className="section-copy" data-reveal>
          <h2>Send the product, volume, destination, and documentation needs.</h2>
          <p>
            The contact form asks for enough commercial context to begin a useful conversation
            without turning the website into a dense commodity catalog too early.
          </p>
          <button className="primary-button" type="button" onClick={() => navigate("#/contact", "contact-form")}>
            Discuss Supply
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}

function AboutPage({ navigate }: { navigate: (path: string, scrollTargetId?: string) => void }) {
  return (
    <PageShell>
      <PageIntro
        eyebrow="About Us"
        title="A registered Indonesian company focused on chemical trade brokerage."
        text="PT NEXUS CHEM BRIDGE is positioned for international B2B trading conversations across industrial chemicals, fertilizers, and basic chemical commodities."
      />

      <section className="legal-panel" data-reveal>
        <div className="legal-heading">
          <Buildings size={24} weight="duotone" />
          <div>
            <p className="eyebrow">Company profile</p>
            <h2>Legal and operating details</h2>
          </div>
        </div>
        <div className="legal-rows">
          {legalRows.map(([label, value], index) => (
            <motion.div
              className="legal-row info-card"
              key={label}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              whileHover={{
                y: -6,
                scale: 1.015,
                transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
              }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.52, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="shareholder-grid" data-reveal>
        <InfoBlock title="Shareholders" text="Ljubisa Stevanovic, 50%. Sabareesh Madhavan, 50%." />
        <InfoBlock title="Business scope" text="International trading and brokerage of industrial chemicals and related products." />
        <InfoBlock title="License" text="NIB 1603260067144 serves as the main business license." />
      </section>

      <section className="image-band quiet" data-reveal>
        <img data-parallax="28" src={imageSources.plant} alt="Industrial chemical processing equipment" />
        <div>
          <span>Commercial contact</span>
          <h2>For product discussions, use the inquiry form and include the target category.</h2>
          <button className="primary-button inverse" type="button" onClick={() => navigate("#/contact", "contact-form")}>
            Contact Us
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}

function ContactPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Contact Us"
        title="Send a chemical supply or brokerage inquiry."
        text="Share the product category, destination, volume range, and documentation needs. The team can use that context to start the right commercial discussion."
      />
      <section className="contact-layout" id="contact-form">
        <ContactForm />
        <aside className="contact-card" data-reveal>
          <p className="eyebrow">Company details</p>
          <h2>PT NEXUS CHEM BRIDGE</h2>
          <dl>
            <div>
              <dt>NIB</dt>
              <dd>1603260067144</dd>
            </div>
            <div>
              <dt>NPWP</dt>
              <dd>1000000008827496</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>Jalan Ratna No. 80, Tonja, Denpasar Utara, Kota Denpasar, Bali 80239, Indonesia</dd>
            </div>
          </dl>
        </aside>
      </section>
    </PageShell>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productOptions = useMemo(() => products.map((product) => product.name), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};

    ["name", "company", "email", "message"].forEach((field) => {
      if (!String(formData.get(field) || "").trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    const email = String(formData.get("email") || "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Use a valid business email address.";
    }

    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate data-reveal>
      <div className="form-grid">
        <Field label="Name" name="name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" placeholder="Your full name" />
        </Field>
        <Field label="Company" name="company" error={errors.company}>
          <input id="company" name="company" autoComplete="organization" placeholder="Company name" />
        </Field>
      </div>
      <Field label="Business email" name="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="name@company.com" />
      </Field>
      <div className="form-grid">
        <Field label="Product interest" name="product">
          <select id="product" name="product" defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {productOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Inquiry type" name="inquiry">
          <select id="inquiry" name="inquiry" defaultValue="Supply inquiry">
            <option>Supply inquiry</option>
            <option>Brokerage discussion</option>
            <option>Supplier introduction</option>
            <option>Documentation request</option>
          </select>
        </Field>
      </div>
      <Field label="Message" name="message" error={errors.message} helper="Include volume range, destination, grade, packaging, and timing if known.">
        <textarea id="message" name="message" rows={6} placeholder="Tell us what you are looking for." />
      </Field>
      {submitted && (
        <div className="success-state" role="status">
          <Check size={18} weight="bold" />
          <span>Inquiry details are ready. Connect this form to your email or CRM before launch.</span>
        </div>
      )}
      <button className="primary-button form-submit" type="submit">
        Submit Inquiry
        <ArrowRight size={18} weight="bold" />
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  helper,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {helper && <p className="helper-text">{helper}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

function ProductRows({ limit, navigate }: { limit?: number; navigate: (path: string, scrollTargetId?: string) => void }) {
  return (
    <div className="product-rows">
      {products.slice(0, limit).map((product, index) => (
        <article className="product-row" key={product.name} data-reveal style={{ "--index": index } as React.CSSProperties}>
          <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p>{product.status}</p>
            <h3>{product.name}</h3>
          </div>
          <p>{product.description}</p>
          <div className="tag-list">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <button type="button" aria-label={`Inquire about ${product.name}`} onClick={() => navigate("#/contact", "contact-form")}>
            <ArrowRight size={18} weight="bold" />
          </button>
        </article>
      ))}
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      className="info-block info-card"
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-intro" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="page-shell">{children}</div>;
}

function Footer({ navigate }: { navigate: (path: string, scrollTargetId?: string) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>PT NEXUS CHEM BRIDGE</strong>
        <p>International trading and brokerage of industrial chemicals and related commodities.</p>
      </div>
      <div className="footer-links">
        <button type="button" onClick={() => navigate("#/contact", "contact-form")}>
          Request a Quote
          <ArrowRight size={16} weight="bold" />
        </button>
        <a href="https://commons.wikimedia.org/wiki/File:Industrial_storage_tanks.jpg" target="_blank" rel="noreferrer">
          Image credits
          <ArrowRight size={16} weight="bold" />
        </a>
      </div>
    </footer>
  );
}

export default App;
