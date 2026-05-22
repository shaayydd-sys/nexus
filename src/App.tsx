import { CSSProperties, FormEvent, ReactNode, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type MotionStyle, type MotionValue, type Variants, useScroll, useSpring, useTransform } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  ArrowRight,
  Check,
} from "@phosphor-icons/react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Boxes,
  ChevronDown,
  FileCheck,
  FileText as LucideFileText,
  FlaskConical,
  Globe2,
  MapPin as LucideMapPin,
  Package,
  PackageCheck,
  ReceiptText,
  Truck,
  UserRound,
} from "lucide-react";
import nexusLogo from "./assets/nexus-logo.svg";
import methanolImage from "./assets/products/methanol-photo.jpeg";
import cyclohexanoneCyclohexaneImage from "./assets/products/cyclohexanone-cyclohexane-photo.jpeg";
import ureaCarbamideImage from "./assets/products/urea-carbamide-photo.jpeg";
import caprolactamImage from "./assets/products/caprolactam-photo.jpeg";
import ammoniumNitrateImage from "./assets/products/ammonium-nitrate-photo.jpeg";
import ammoniumSulphateImage from "./assets/products/ammonium-sulphate-photo.jpeg";

type Page = "home" | "products" | "about" | "contact";

type NavItem = {
  label: string;
  page: Page;
  path: string;
};

type Product = {
  name: string;
  status: string;
  previewLabel: string;
  previewValue: string;
  description: string;
  shortDescription: string;
  formula?: string;
  purity?: string;
  form: string;
  markets: string[];
  packing: string;
  use: string[];
  transport: string;
  primaryApplications: string;
  availableVolume: string;
  priceIndication: string;
  safety?: string;
  tags: string[];
  images: Array<{
    src: string;
    alt: string;
  }>;
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
    status: "Product type",
    previewLabel: "Formula",
    previewValue: "CH3OH",
    shortDescription: "Simple alcohol-based organic chemical used as a base feedstock.",
    description:
      "Simple alcohol-based organic chemical widely used as a base feedstock in chemical production and fuel applications. Clear liquid product suitable for industrial processing and energy use.",
    formula: "CH3OH",
    purity: "99.85%",
    form: "Liquid",
    markets: ["China", "India", "Southeast Asia"],
    packing: "Bulk / ISO Tank",
    use: ["Chemicals", "Fuel Blending"],
    transport: "Bulk / Tankers",
    primaryApplications: "Chemical feedstock, fuel blending, industrial processing, and energy-related applications.",
    availableVolume: "Subject to commercial inquiry and supply confirmation.",
    priceIndication: "Indicative pricing confirmed by market, origin, volume, and contract terms.",
    tags: ["Industrial solvent", "Bulk inquiry", "99.85% purity"],
    images: [
      { src: methanolImage, alt: "Minimal studio photograph of clear methanol liquid in a glass vial." },
    ],
  },
  {
    name: "Cyclohexanone & Cyclohexane",
    status: "Product type",
    previewLabel: "Product",
    previewValue: "Technical Grade",
    shortDescription: "Solvent and Nylon-chain intermediates supplied for qualified industrial buyers.",
    description:
      "Cyclohexanone is a colourless oily liquid used as an industrial solvent and chemical intermediate. Cyclohexane is a clear, highly flammable hydrocarbon solvent and a key intermediate in Nylon production.",
    formula: "C6H10O / C6H12",
    form: "Liquid",
    markets: ["China", "Turkey", "Asia-Pacific"],
    packing: "Bulk chemical tankers / ISO-tanks",
    use: ["Nylon intermediates", "Industrial solvents", "Polymer and rubber industries"],
    transport: "Bulk / Chemical tankers / ISO-tanks",
    primaryApplications:
      "Cyclohexanone is used in caprolactam and adipic acid production, and as a solvent for PVC, lacquers, inks, and pesticide formulations. Cyclohexane is used as feedstock for KA-oil production and as a solvent in polymer and rubber industries.",
    availableVolume: "40,000-60,000 metric tonnes per annum combined.",
    priceIndication: "USD 900-1,100 per metric tonne (CFR, subject to market conditions and contract terms).",
    safety: "Classified as dangerous goods Class 3 (flammable liquid). Shipments comply with applicable IMDG and ADR regulations.",
    tags: ["Technical grade", "Class 3", "Bulk supply"],
    images: [
      { src: cyclohexanoneCyclohexaneImage, alt: "Minimal studio photograph of clear cyclohexanone and cyclohexane solvent vials." },
    ],
  },
  {
    name: "Urea / Carbamide",
    status: "Product type",
    previewLabel: "Nitrogen",
    previewValue: "46% N",
    shortDescription: "White crystalline nitrogen fertilizer and chemical synthesis feedstock.",
    description:
      "Urea is a white crystalline solid with the highest nitrogen content among solid nitrogenous fertilisers. It is also widely used as a feedstock in chemical synthesis.",
    formula: "CH4N2O",
    form: "Prilled or granular solid",
    markets: ["Turkey", "Brazil", "Peru", "UAE", "India"],
    packing: "Bulk carrier / 50 kg bags / 1,000 kg big-bags",
    use: ["Nitrogen fertilizer", "Urea-formaldehyde resins", "Melamine", "AdBlue / DEF", "Animal feed supplements"],
    transport: "Bulk carrier / Bagged cargo",
    primaryApplications:
      "Agricultural nitrogen fertilizer for direct application, plus industrial use in resins, melamine, AdBlue (DEF), and animal feed supplements.",
    availableVolume: "200,000-400,000 metric tonnes per annum.",
    priceIndication: "USD 380-430 per metric tonne (FOB/CFR, subject to market conditions and contract terms).",
    tags: ["Fertilizer", "46% N", "Bulk or bagged"],
    images: [
      { src: ureaCarbamideImage, alt: "Minimal studio photograph of white urea crystalline granules in a dish." },
    ],
  },
  {
    name: "Caprolactam",
    status: "Product type",
    previewLabel: "Formula",
    previewValue: "C6H11NO",
    shortDescription: "Key monomer for Nylon-6 fibres, filaments, and engineering plastics.",
    description:
      "Caprolactam is a cyclic amide and the key monomer in the production of Nylon-6 (Polyamide-6). It appears as white flakes or a colourless liquid when melted.",
    formula: "C6H11NO",
    form: "Molten liquid or solid flakes",
    markets: ["China", "Turkey", "India", "Southeast Asia"],
    packing: "Molten bulk / heated ISO-tanks / rail tankers / 1,000 kg big-bags",
    use: ["Nylon-6 fibres", "Engineering plastics", "Textile yarn", "Tyre cord", "Injection moulding"],
    transport: "Bulk heated tanks / ISO-tanks / rail tankers / big-bags",
    primaryApplications:
      "Production of Nylon-6 fibres, filaments, and engineering plastics for textile yarn, carpet fibre, tyre cord, fishing nets, rope, monofilament, automotive, and industrial components.",
    availableVolume: "80,000-100,000 metric tonnes per annum.",
    priceIndication: "USD 1,300-1,500 per metric tonne (CFR, subject to market conditions and contract terms).",
    tags: ["Nylon-6", "Intermediate", "Bulk or flakes"],
    images: [
      { src: caprolactamImage, alt: "Minimal studio photograph of white caprolactam flakes on a light surface." },
    ],
  },
  {
    name: "Ammonium Nitrate",
    status: "Product type",
    previewLabel: "Nitrogen",
    previewValue: "34% N",
    shortDescription: "Effective nitrogen fertilizer and technical-grade industrial component.",
    description:
      "Ammonium nitrate is a white crystalline solid containing nitrogen in both ammonium and nitrate form, making it one of the most effective nitrogen fertilisers for agricultural use.",
    formula: "NH4NO3",
    form: "Granular or prilled solid",
    markets: ["Brazil", "Turkey", "UAE"],
    packing: "Bulk / 50 kg bags / 1,000 kg big-bags",
    use: ["Nitrogen fertilizer", "Cereals", "Oilseeds", "Pasture", "Technical grade explosives"],
    transport: "Bulk or bagged dangerous goods cargo",
    primaryApplications:
      "Agricultural straight nitrogen fertilizer, particularly effective for cereals, oilseeds, and pasture. Technical grade material is also used in ANFO for mining and construction sectors.",
    availableVolume: "150,000-200,000 metric tonnes per annum.",
    priceIndication: "USD 350-420 per metric tonne (FOB/CFR, subject to market conditions and contract terms).",
    safety: "Classified as dangerous goods Class 5.1 (oxidising substance). Shipments comply with applicable IMDG and national transport regulations.",
    tags: ["Fertilizer", "Class 5.1", "34% N"],
    images: [
      { src: ammoniumNitrateImage, alt: "Minimal studio photograph of white ammonium nitrate prills in a shallow tray." },
    ],
  },
  {
    name: "Ammonium Sulphate",
    status: "Product type",
    previewLabel: "N / S",
    previewValue: "21% / 24%",
    shortDescription: "Nitrogen-sulphur fertilizer for sulphur-deficient agricultural soils.",
    description:
      "Ammonium sulphate is a white crystalline salt containing 21% nitrogen and 24% sulphur, addressing both nitrogen and sulphur deficiencies in soil.",
    formula: "(NH4)2SO4",
    form: "Crystalline or compacted granular solid",
    markets: ["Brazil", "Colombia", "Mexico", "Turkey", "Asia-Pacific"],
    packing: "Bulk carrier / 50 kg bags / 1,000 kg big-bags",
    use: ["Nitrogen-sulphur fertilizer", "Food additive E517", "Ammonium salts", "Flame retardants", "Water treatment"],
    transport: "Bulk or bagged non-hazardous cargo",
    primaryApplications:
      "Agricultural nitrogen-sulphur fertilizer for sulphur-deficient soils, cereals, oilseeds, sugar cane, and tea plantations. Also used in food and industrial applications.",
    availableVolume: "50,000-80,000 metric tonnes per annum.",
    priceIndication: "USD 130-150 per metric tonne (FOB/CFR, subject to market conditions and contract terms).",
    safety: "Non-hazardous cargo with no special transport restrictions.",
    tags: ["Fertilizer", "Non-hazardous", "N/S supply"],
    images: [
      { src: ammoniumSulphateImage, alt: "Minimal studio photograph of ammonium sulphate crystals in a dish." },
    ],
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

function getProductSubtitle(product: Product) {
  return product.formula ?? product.previewValue;
}

const cinematicEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const pageHeroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.11,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: cinematicEase,
    },
  },
};

const titleLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      ease: cinematicEase,
    },
  },
};

const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 44,
    scale: 0.96,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: cinematicEase,
    },
  },
};

type PremiumCarouselRenderState = {
  activeIndex: number;
  distance: number;
  index: number;
  isCenter: boolean;
  isEdgePeek: boolean;
  isVisible: boolean;
  side: "left" | "right";
  signedOffset: number;
};

type PremiumCarouselProps<T> = {
  items: T[];
  renderCard: (item: T, state: PremiumCarouselRenderState) => ReactNode;
  getKey: (item: T) => string;
  cardClassName: (item: T, state: PremiumCarouselRenderState) => string;
  className?: string;
  cta?: ReactNode;
  dotsLabel?: string;
  getAriaLabel?: (item: T) => string;
  getDotLabel?: (item: T, index: number) => string;
  initialIndex?: number;
  itemOffset?: number;
  mode?: "hero" | "section";
  nextLabel?: string;
  onItemClick?: (item: T, index: number) => void;
  prevLabel?: string;
  sideCardOpacity?: MotionStyle["opacity"];
  trackStyle?: MotionStyle;
  chromeStyle?: MotionStyle;
};

function PremiumCarousel<T>({
  items,
  renderCard,
  getKey,
  cardClassName,
  className = "",
  cta,
  dotsLabel = "Carousel controls",
  getAriaLabel,
  getDotLabel,
  initialIndex = 0,
  itemOffset = 410,
  mode = "section",
  nextLabel = "Next item",
  onItemClick,
  prevLabel = "Previous item",
  sideCardOpacity,
  trackStyle,
  chromeStyle,
}: PremiumCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [measuredCardHeight, setMeasuredCardHeight] = useState<number | null>(null);
  const [resolvedItemOffset, setResolvedItemOffset] = useState(itemOffset);
  const loopCarouselIndex = (index: number) => {
    if (items.length === 0) return 0;
    return ((index % items.length) + items.length) % items.length;
  };
  const normalizedActiveIndex = loopCarouselIndex(activeIndex);
  const isHero = mode === "hero";

  useEffect(() => {
    setActiveIndex(loopCarouselIndex(initialIndex));
  }, [items.length, initialIndex]);

  useLayoutEffect(() => {
    let frameId = 0;
    const resolveItemOffset = () => {
      const root = carouselRef.current;
      if (!root) return;

      const cssOffset = getComputedStyle(root).getPropertyValue("--premium-carousel-item-offset").trim();
      const nextOffset = cssOffset
        ? Number.parseFloat(cssOffset.endsWith("vw")
          ? String((window.innerWidth * Number.parseFloat(cssOffset)) / 100)
          : cssOffset)
        : itemOffset;

      if (Number.isFinite(nextOffset) && nextOffset > 0) {
        setResolvedItemOffset((current) => (Math.abs(current - nextOffset) > 0.5 ? nextOffset : current));
      }
    };

    const scheduleResolve = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(resolveItemOffset);
    };

    scheduleResolve();
    window.addEventListener("resize", scheduleResolve);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleResolve);
    };
  }, [itemOffset]);

  useLayoutEffect(() => {
    if (isHero) return undefined;

    let frameId = 0;
    const measureCards = () => {
      const root = carouselRef.current;
      if (!root || root.offsetParent === null) return;

      const fallbackHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue("--premium-carousel-card-height")) || 0;
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".premium-carousel-card"));
      if (cards.length === 0) return;

      const heights = cards.map((card) => {
        const previousHeight = card.style.height;
        const previousMinHeight = card.style.minHeight;
        card.style.height = "auto";
        card.style.minHeight = "0px";
        const height = card.getBoundingClientRect().height;
        card.style.height = previousHeight;
        card.style.minHeight = previousMinHeight;
        return height;
      });
      const nextHeight = Math.ceil(Math.max(fallbackHeight, ...heights));
      if (!Number.isFinite(nextHeight) || nextHeight <= 0) return;

      setMeasuredCardHeight((currentHeight) => (Math.abs((currentHeight ?? 0) - nextHeight) > 0.5 ? nextHeight : currentHeight));
    };

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measureCards);
    };

    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [isHero, items.length]);

  if (items.length === 0) return null;

  const goToItem = (index: number) => setActiveIndex(loopCarouselIndex(index));
  const moveCarousel = (direction: number) => setActiveIndex((current) => loopCarouselIndex(current + direction));
  const isMobileCarousel = () => window.matchMedia("(max-width: 768px)").matches;
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isMobileCarousel() || event.pointerType === "mouse" || items.length < 2) return;
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || !isMobileCarousel() || items.length < 2) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 34 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    moveCarousel(deltaX < 0 ? 1 : -1);
  };
  const handlePointerCancel = () => {
    swipeStartRef.current = null;
  };
  const getSignedOffset = (index: number) => {
    let offset = (index - normalizedActiveIndex + items.length) % items.length;
    if (offset > items.length / 2) {
      offset -= items.length;
    }
    return offset;
  };
  const sectionStyle = !isHero && measuredCardHeight
    ? ({ "--premium-carousel-measured-card-height": `${measuredCardHeight}px` } as CSSProperties)
    : undefined;

  return (
    <div
      className={`premium-carousel ${isHero ? "premium-carousel-hero" : "premium-carousel-section"} ${className}`.trim()}
      ref={carouselRef}
      style={sectionStyle}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <motion.div
        className="home-carousel-track-layer premium-carousel-track-layer"
        initial={isHero ? { opacity: 0 } : false}
        animate={isHero ? { opacity: 1 } : undefined}
        transition={isHero ? { duration: 0.9, delay: 0.65, ease: cinematicEase } : undefined}
        style={trackStyle}
      >
        {items.map((item, index) => {
          const signedOffset = getSignedOffset(index);
          const distance = Math.abs(signedOffset);
          const isCenter = distance === 0;
          const isEdgePeek = distance === 2;
          const isVisible = distance <= 2;
          const side = signedOffset < 0 ? "left" : "right";
          const state: PremiumCarouselRenderState = {
            activeIndex: normalizedActiveIndex,
            distance,
            index,
            isCenter,
            isEdgePeek,
            isVisible,
            side,
            signedOffset,
          };

          return (
            <motion.div
              className="home-carousel-track-item premium-carousel-track-item"
              data-side={side}
              data-distance={Math.min(distance, 3)}
              aria-hidden={!isVisible}
              key={getKey(item)}
              initial={false}
              animate={{
                x: signedOffset * resolvedItemOffset,
                opacity: isVisible ? (isEdgePeek ? 0.28 : 1) : 0,
                scale: isCenter ? 1 : isEdgePeek ? 0.94 : 0.98,
                filter: isEdgePeek ? "blur(1.4px)" : "blur(0px)",
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                zIndex: 8 - Math.min(distance, 6),
                pointerEvents: distance <= 1 ? "auto" : "none",
              }}
              onClick={() => {
                if (distance <= 1) onItemClick?.(item, index);
              }}
              onKeyDown={(event) => {
                if (!onItemClick || distance > 1) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onItemClick(item, index);
                }
              }}
            >
              <motion.div
                className={cardClassName(item, state)}
                aria-label={getAriaLabel?.(item)}
                role={onItemClick ? "button" : undefined}
                tabIndex={onItemClick && distance <= 1 ? 0 : undefined}
                style={{ opacity: isCenter ? 1 : sideCardOpacity }}
              >
                {renderCard(item, state)}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div className="home-carousel-chrome premium-carousel-chrome" style={chromeStyle}>
        {items.length > 1 && (
          <>
            <button className="home-carousel-arrow home-carousel-arrow-left" type="button" aria-label={prevLabel} onClick={() => moveCarousel(-1)}>
              {"‹"}
            </button>
            <button className="home-carousel-arrow home-carousel-arrow-right" type="button" aria-label={nextLabel} onClick={() => moveCarousel(1)}>
              {"›"}
            </button>
          </>
        )}

        {items.length > 1 && (
          <div className="carousel-controls home-carousel-dots premium-carousel-dots" aria-label={dotsLabel}>
            <div className="carousel-dots">
              {items.map((item, index) => (
                <button
                  className={`carousel-dot ${index === normalizedActiveIndex ? "active" : ""}`.trim()}
                  key={getKey(item)}
                  type="button"
                  aria-label={getDotLabel?.(item, index) ?? `Go to item ${index + 1}`}
                  onClick={() => goToItem(index)}
                />
              ))}
            </div>
          </div>
        )}

        {cta && <div className="hero-product-actions premium-carousel-actions">{cta}</div>}
      </motion.div>
    </div>
  );
}

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
      <SharedHelixBackground page={page} />
      <ConceptTopbar navigate={navigate} page={page} />
      <main className="home-main">
        {page === "home" && <HomePage navigate={navigate} onProductSelect={setSelectedProduct} />}
        {page === "products" && <ProductsPage navigate={navigate} onProductSelect={setSelectedProduct} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer navigate={navigate} />
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
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

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const lenis = isTouchDevice
      ? null
      : new Lenis({
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

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    } else {
      window.addEventListener("scroll", ScrollTrigger.update, { passive: true });
    }

    const raf = (time: number) => {
      lenis?.raf(time);
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
      if (lenis) {
        lenis.destroy();
      } else {
        window.removeEventListener("scroll", ScrollTrigger.update);
      }
    };
  }, [page]);

  return null;
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

type ProductCardData = AnimatedCardData & {
  product: Product;
};

type CardIconType =
  | "company"
  | "registration"
  | "tax"
  | "director"
  | "address"
  | "business"
  | "product"
  | "formula"
  | "markets"
  | "packing"
  | "transport"
  | "check";

function CardIcon({ type }: { type: CardIconType }) {
  const iconProps = {
    className: "card-icon",
    "aria-hidden": true,
    focusable: false,
    strokeWidth: 1.6,
  } as const;

  switch (type) {
    case "company":
      return <LucideFileText {...iconProps} />;
    case "registration":
      return <FileCheck {...iconProps} />;
    case "tax":
      return <ReceiptText {...iconProps} />;
    case "director":
      return <UserRound {...iconProps} />;
    case "address":
      return <LucideMapPin {...iconProps} />;
    case "business":
      return <BriefcaseBusiness {...iconProps} />;
    case "product":
      return <Package {...iconProps} />;
    case "formula":
      return <FlaskConical {...iconProps} />;
    case "markets":
      return <Globe2 {...iconProps} />;
    case "packing":
      return <Boxes {...iconProps} />;
    case "transport":
      return <Truck {...iconProps} />;
    case "check":
      return <BadgeCheck {...iconProps} />;
    default:
      return <PackageCheck {...iconProps} />;
  }
}

function getLegalCardIconType(label: string): CardIconType {
  if (label.includes("Registration") || label.includes("NIB")) return "registration";
  if (label.includes("Tax") || label.includes("NPWP")) return "tax";
  if (label.includes("Director")) return "director";
  if (label.includes("Address")) return "address";
  if (label.includes("KBLI")) return "business";
  return "company";
}

function HomePage({ navigate, onProductSelect }: { navigate: (path: string, scrollTargetId?: string) => void; onProductSelect: (product: Product) => void }) {
  return (
    <PageShell>
      <div className="home-cinematic">
        <ScrollSection className="hero-scroll-stage" height="200vh">
          {({ progress }) => <HeroProductsScene progress={progress} navigate={navigate} onProductSelect={onProductSelect} />}
        </ScrollSection>

        <ScrollSection className="trading-scope-scene" label="03" title="Trading scope" height="185vh">
          {({ progress }) => <TradingScopeScene progress={progress} />}
        </ScrollSection>

        <ScrollSection className="business-activity-scene" label="04" title="Business activities" height="180vh">
          {({ progress }) => <BusinessActivitiesScene progress={progress} />}
        </ScrollSection>

        <ScrollSection className="legal-information-scene" label="05" title="Company profile" height="190vh">
          {({ progress }) => <LegalInformationScene progress={progress} navigate={navigate} />}
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

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function AnimatedTitle({
  progress,
  children,
  className = "",
  startVisible = false,
}: {
  progress: MotionValue<number>;
  children: ReactNode;
  className?: string;
  startVisible?: boolean;
}) {
  const isMobile = useIsMobileViewport();
  const opacityRange = startVisible
    ? isMobile ? [0, 0.88, 1] : [0, 0.75, 1]
    : isMobile ? [0, 0.18, 0.88, 1] : [0, 0.15, 0.75, 1];
  const yRange = startVisible
    ? isMobile ? [0, 0.9, 1] : [0, 0.8, 1]
    : isMobile ? [0, 0.24, 0.9, 1] : [0, 0.2, 0.8, 1];
  const scaleRange = startVisible ? [0, 1] : isMobile ? [0, 0.34, 1] : [0, 0.3, 1];
  const opacity = useTransform(progress, opacityRange, startVisible ? [1, 1, 0] : [0, 1, 1, 0]);
  const y = useTransform(progress, yRange, startVisible ? [0, 0, -80] : [80, 0, 0, -80]);
  const scale = useTransform(progress, scaleRange, startVisible ? [1, 1.04] : [0.96, 1, 1.04]);

  return (
    <motion.h2 className={`animated-title ${className}`.trim()} style={{ opacity, y, scale }}>
      {children}
    </motion.h2>
  );
}

function AnimatedParagraph({
  progress,
  children,
  className = "",
  startVisible = false,
}: {
  progress: MotionValue<number>;
  children: ReactNode;
  className?: string;
  startVisible?: boolean;
}) {
  const isMobile = useIsMobileViewport();
  const opacityRange = startVisible
    ? isMobile ? [0, 0.9, 1] : [0, 0.78, 1]
    : isMobile ? [0, 0.26, 0.9, 1] : [0, 0.22, 0.78, 1];
  const yRange = startVisible
    ? isMobile ? [0, 0.92, 1] : [0, 0.82, 1]
    : isMobile ? [0, 0.32, 0.92, 1] : [0, 0.28, 0.82, 1];
  const opacity = useTransform(progress, opacityRange, startVisible ? [1, 1, 0] : [0, 1, 1, 0]);
  const y = useTransform(progress, yRange, startVisible ? [0, 0, -56] : [80, 0, 0, -56]);

  return (
    <motion.p className={`animated-paragraph ${className}`.trim()} style={{ opacity, y }}>
      {children}
    </motion.p>
  );
}

function AnimatedCards({
  progress,
  cards,
  className = "",
  onCardClick,
  carouselCta,
  startVisible = false,
  initialIndex = 0,
}: {
  progress: MotionValue<number>;
  cards: AnimatedCardData[];
  className?: string;
  onCardClick?: (card: AnimatedCardData, index: number) => void;
  carouselCta?: ReactNode;
  startVisible?: boolean;
  initialIndex?: number;
}) {
  const isMobile = useIsMobileViewport();
  const opacityRange = startVisible
    ? isMobile ? [0, 0.94, 1] : [0, 0.9, 1]
    : isMobile ? [0, 0.2, 0.94, 1] : [0, 0.16, 0.9, 1];
  const yRange = startVisible
    ? isMobile ? [0, 0.92, 1] : [0, 0.86, 1]
    : isMobile ? [0, 0.26, 0.92, 1] : [0, 0.22, 0.86, 1];
  const opacity = useTransform(progress, opacityRange, startVisible ? [1, 1, 0] : [0, 1, 1, 0]);
  const y = useTransform(progress, yRange, startVisible ? [0, 0, 24] : [70, 0, 0, 24]);

  const renderCardContent = (card: AnimatedCardData) => {
    const productCard = "product" in card ? (card as ProductCardData) : null;

    if (productCard) {
      return (
        <div className="product-preview-card-content">
          <div className="product-preview-card-header">
            <strong>{productCard.product.name}</strong>
            <span>{getProductSubtitle(productCard.product)}</span>
          </div>
          <div className="product-preview-media">
            <img src={productCard.product.images[0].src} alt={productCard.product.images[0].alt} loading="lazy" />
          </div>
        </div>
      );
    }

    return (
      <>
        {card.icon && <div className="card-icon-wrapper">{card.icon}</div>}
        <span>{card.label}</span>
        <strong>{card.title}</strong>
        <p>{card.text}</p>
      </>
    );
  };

  const renderGridCard = (card: AnimatedCardData, index: number, key: string) => (
    <AnimatedCard
      index={index}
      className={"product" in card ? "product-preview-card" : ""}
      key={key}
      onClick={onCardClick ? () => onCardClick(card, index) : undefined}
      ariaLabel={onCardClick ? `Open details for ${card.title}` : undefined}
    >
      {renderCardContent(card)}
    </AnimatedCard>
  );

  return (
    <motion.div className={`animated-cards ${className}`.trim()} style={{ opacity, y }}>
      <div className="animated-cards-grid">
        {cards.map((card, index) => renderGridCard(card, index, `grid-${card.title}`))}
      </div>

      <PremiumCarousel
        items={cards}
        getKey={(card) => card.title}
        initialIndex={initialIndex}
        className="animated-cards-premium-carousel"
        dotsLabel="Card carousel controls"
        prevLabel="Previous card"
        nextLabel="Next card"
        getAriaLabel={onCardClick ? (card) => "Open details for " + card.title : undefined}
        getDotLabel={(_, index) => "Go to card " + (index + 1)}
        onItemClick={onCardClick}
        cardClassName={(card, state) =>
          [
            "animated-card",
            "info-card",
            "premium-carousel-card",
            "product" in card ? "product-preview-card" : "",
            onCardClick ? "is-clickable" : "",
            state.isCenter ? "home-carousel-center-card" : "home-carousel-side-card",
            state.isEdgePeek ? "home-carousel-edge-card" : "",
            state.isEdgePeek ? "home-carousel-edge-card-" + state.side : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
        renderCard={(card) => renderCardContent(card)}
        cta={carouselCta}
      />

      {carouselCta && (
        <div className="carousel-controls-stack animated-cards-grid-controls">
          <div className="carousel-cta">
            {carouselCta}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AnimatedCard({
  index,
  children,
  onClick,
  ariaLabel,
  className = "",
}: {
  index: number;
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`animated-card info-card ${className} ${onClick ? "is-clickable" : ""}`.trim()}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      whileHover={{
        y: -6,
        scale: 1.015,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      whileTap={onClick ? { scale: 0.992 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.52, delay: index * 0.075, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  const detailRows = product
    ? [
        ["Primary applications", product.primaryApplications],
        ["Available volume", product.availableVolume],
        ["Price indication", product.priceIndication],
        ["Key markets", product.markets.join(", ")],
        ["Packing & form", `${product.packing}. Form: ${product.form}.`],
        ["Transport / safety", product.safety ? `${product.transport}. ${product.safety}` : product.transport],
      ]
    : [];

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="product-detail-overlay"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.article
            className="product-detail-panel product-detail-scroll info-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <button className="product-detail-close" type="button" aria-label="Close product details" onClick={onClose}>
              ×
            </button>

            <div className="product-detail-header">
              <span>{getProductSubtitle(product)}</span>
              <h2 id="product-detail-title">{product.name}</h2>
              <p>{product.description}</p>
            </div>

            <figure className="product-detail-image">
              <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy" />
            </figure>

            <div className="product-detail-meta" aria-label="Product summary">
              {product.form && (
                <div>
                  <span>Form</span>
                  <strong>{product.form}</strong>
                </div>
              )}
              {product.purity && (
                <div>
                  <span>Purity</span>
                  <strong>{product.purity}</strong>
                </div>
              )}
              {product.formula && (
                <div>
                  <span>Formula</span>
                  <strong>{product.formula}</strong>
                </div>
              )}
              <div>
                <span>Markets</span>
                <strong>{product.markets.slice(0, 3).join(" / ")}</strong>
              </div>
            </div>

            <div className="product-detail-grid">
              {detailRows.map(([label, value]) => (
                <section className="product-detail-section" key={label}>
                  <span>{label}</span>
                  <p>{value}</p>
                </section>
              ))}
            </div>

            <div className="product-detail-tags">
              {product.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SharedHelixBackground({ page }: { page: Page }) {
  return (
    <motion.div
      className="shared-helix-entrance"
      key={`helix-${page}`}
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: cinematicEase }}
      aria-hidden="true"
    >
      <HeroHelixScene className="page-helix-scene shared-helix-background" />
    </motion.div>
  );
}

function ConceptTopbar({ navigate, page }: { navigate: (path: string, scrollTargetId?: string) => void; page: Page }) {
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
      key={`topbar-${page}`}
      aria-label="Hero navigation"
      initial={{ opacity: 0, y: -24 }}
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
        opacity: 1,
        y: 0,
        height: isConceptMenuOpen ? 320 : 72,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        borderBottomLeftRadius: isConceptMenuOpen ? 32 : 36,
        borderBottomRightRadius: isConceptMenuOpen ? 32 : 36,
      }}
      transition={{
        default: { duration: 0.45, ease: cinematicEase },
        opacity: { duration: 0.7, delay: 0.1, ease: cinematicEase },
        y: { duration: 0.7, delay: 0.1, ease: cinematicEase },
      }}
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
            if (window.matchMedia("(pointer: coarse)").matches) {
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

function HeroProductsScene({
  progress,
  navigate,
  onProductSelect,
}: {
  progress: MotionValue<number>;
  navigate: (path: string, scrollTargetId?: string) => void;
  onProductSelect: (product: Product) => void;
}) {
  const featuredProduct = products.find((product) => product.name === "Caprolactam") ?? products[0];
  const featuredProductIndex = Math.max(0, products.findIndex((product) => product.name === featuredProduct.name));
  const chemX = useTransform(progress, [0, 0.82], ["0vw", "-64vw"]);
  const bridgeX = useTransform(progress, [0, 0.82], ["0vw", "64vw"]);
  const wordOpacity = useTransform(progress, [0, 0.62], [1, 0]);
  const nexusY = useTransform(progress, [0, 0.58], ["0vh", "-18vh"]);
  const nexusOpacity = useTransform(progress, [0, 0.46], [1, 0]);
  const cardX = useTransform(progress, [0, 0.55], ["calc(-50% + 16vw)", "-50%"]);
  const cardY = useTransform(progress, [0, 0.55], ["8vh", "-50%"]);
  const cardScale = useTransform(progress, [0, 0.55], [0.96, 1.08]);
  const productTitleY = useTransform(progress, [0.38, 0.74], [60, 0]);
  const productTitleOpacity = useTransform(progress, [0.38, 0.68], [0, 1]);
  const productTextY = useTransform(progress, [0.46, 0.82], [80, 0]);
  const productTextOpacity = useTransform(progress, [0.46, 0.78], [0, 1]);
  const sideCardOpacity = useTransform(progress, [0.52, 0.75], [0, 1]);
  const carouselChromeOpacity = useTransform(progress, [0.62, 0.84], [0, 1]);
  const carouselChromeY = useTransform(progress, [0.62, 0.84], [18, 0]);

  const renderHeroProductCardContent = (product: Product, isCenter: boolean) => (
    <>
      <div>
        <strong>{product.name}</strong>
        <span>{getProductSubtitle(product)}</span>
      </div>
      <div className="concept-formula-box product-preview-media">
        <img src={product.images[0].src} alt={product.images[0].alt} loading={isCenter ? "eager" : "lazy"} />
      </div>
    </>
  );

  return (
    <div className="hero-section concept-hero">
      <motion.div
        className="concept-brand"
        initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.05, delay: 0.22, ease: cinematicEase }}
      >
        <motion.h1 className="concept-title" style={{ y: nexusY, opacity: nexusOpacity }}>
          NEXUS
        </motion.h1>
        <motion.span className="concept-word concept-word-left" style={{ x: chemX, opacity: wordOpacity }}>
          CHEM
        </motion.span>
        <motion.span className="concept-word concept-word-right" style={{ x: bridgeX, opacity: wordOpacity }}>
          BRIDGE
        </motion.span>
      </motion.div>

      <motion.div className="concept-product-copy">
        <motion.h2 style={{ y: productTitleY, opacity: productTitleOpacity }}>
          Industrial Chemical Products
        </motion.h2>
        <motion.p style={{ y: productTextY, opacity: productTextOpacity }}>
          We connect international buyers and suppliers of industrial chemicals, fertilizers,
          and essential raw materials through reliable trading and brokerage solutions.
        </motion.p>
      </motion.div>

      <PremiumCarousel
        items={products}
        getKey={(product) => product.name}
        initialIndex={featuredProductIndex}
        mode="hero"
        trackStyle={{ x: cardX, y: cardY, scale: cardScale }}
        chromeStyle={{ opacity: carouselChromeOpacity, x: "-50%", y: carouselChromeY }}
        sideCardOpacity={sideCardOpacity}
        dotsLabel="Product carousel controls"
        prevLabel="Previous product"
        nextLabel="Next product"
        getAriaLabel={(product) => "Open details for " + product.name}
        getDotLabel={(product) => "Go to " + product.name}
        onItemClick={onProductSelect}
        cardClassName={(_, state) =>
          [
            "concept-card",
            "home-carousel-product-card",
            state.isCenter ? "home-carousel-center-card" : "home-carousel-side-card",
            state.isEdgePeek ? "home-carousel-edge-card" : "",
            state.isEdgePeek ? "home-carousel-edge-card-" + state.side : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
        renderCard={(product, state) => renderHeroProductCardContent(product, state.isCenter)}
        cta={
          <>
            <button className="hero-product-button hero-product-button-primary" type="button" onClick={() => navigate("#/contact", "contact-form")}>
              <span>Start an Inquiry</span>
              <ArrowRight size={20} weight="bold" />
            </button>
            <button className="hero-product-button hero-product-button-secondary" type="button" onClick={() => navigate("#/about")}>
              <span>View Company Details</span>
              <ArrowRight size={20} weight="bold" />
            </button>
          </>
        }
      />
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
      icon: <CardIcon type="business" />,
    },
    {
      label: "KBLI 46651",
      title: "Wholesale of chemical products",
      text: "Industrial chemical product trading, including basic chemical commodities.",
      icon: <CardIcon type="product" />,
    },
    {
      label: "License",
      title: "NIB 1603260067144",
      text: "Business identification serving as the main company license.",
      icon: <CardIcon type="registration" />,
    },
    {
      label: "Address",
      title: "Denpasar, Bali",
      text: "Legal address at Jalan Ratna No. 80, Tonja, Denpasar Utara.",
      icon: <CardIcon type="address" />,
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

function LegalInformationScene({ progress, navigate }: { progress: MotionValue<number>; navigate: (path: string, scrollTargetId?: string) => void }) {
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
      <AnimatedCards
        progress={progress}
        cards={cards}
        className="legal-cards"
        carouselCta={
          <button className="secondary-button" type="button" onClick={() => navigate("#/about")}>
            View Company Details
            <ArrowRight size={18} weight="bold" />
          </button>
        }
      />
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
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0xf8f6f1, 1);
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
    const ribs: Array<{ mesh: THREE.Mesh; material: THREE.MeshStandardMaterial; baseRotationY: number; baseOpacity: number }> = [];
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
      const baseOpacity = 0.9 + Math.sin(progress * Math.PI) * 0.1;
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().lerpColors(
          new THREE.Color(0xecece8),
          new THREE.Color(0xfbfbfa),
          progress,
        ),
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: baseOpacity,
      });
      ribGeometries.push(geometry);
      ribMaterials.push(material);

      const rib = new THREE.Mesh(geometry, material);
      rib.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const baseRotationY = angle * 0.52 - 0.72;
      rib.rotation.set(0, baseRotationY, 0);
      rib.castShadow = true;
      rib.receiveShadow = true;
      ribs.push({ mesh: rib, material, baseRotationY, baseOpacity });
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
      group.scale.setScalar(width < 760 ? 1.72 : 1.48);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frameId = 0;
    let currentProgress = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothStep = (edge0: number, edge1: number, value: number) => {
      const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
      return t * t * (3 - 2 * t);
    };

    const animate = (time: number) => {
      const stage = (
        mount.closest(".home-cinematic")
        ?? document.querySelector<HTMLElement>(".home-cinematic")
        ?? document.querySelector<HTMLElement>(".hero-scroll-stage")
      ) as HTMLElement | null;
      const rect = stage?.getBoundingClientRect();
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const pageProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      const rawProgress = rect
        ? Math.min(Math.max(-rect.top / Math.max(rect.height - window.innerHeight, 1), 0), 1.2)
        : Math.min(pageProgress * 1.25, 1.2);
      currentProgress += (rawProgress - currentProgress) * 0.075;
      const sectionBase = 0.92 - Math.min(currentProgress * 0.2, 0.2);
      const readabilityFade = smoothStep(0.52, 0.74, currentProgress) * (1 - smoothStep(0.86, 1.04, currentProgress));
      const contactReturn = smoothStep(0.86, 1.02, currentProgress) * 0.14;
      const mobileViewport = width < 760;
      const helixOpacity = Math.max(mobileViewport ? 0.7 : 0.65, sectionBase - readabilityFade * 0.34 + contactReturn);
      mount.style.opacity = "1";
      mount.style.transform = "translate3d(0, 0, 0)";

      const idle = reducedMotion ? 0 : time * 0.00016;
      const breathing = reducedMotion ? 0 : Math.sin(time * 0.00042) * 0.095;
      const roll = reducedMotion ? 0 : Math.sin(time * 0.00032) * 0.035;
      if (!reducedMotion) {
        ribs.forEach((rib, index) => {
          rib.mesh.rotation.y = rib.baseRotationY + Math.sin(time * 0.00072 + index * 0.18) * 0.022;
          rib.material.opacity = rib.baseOpacity * helixOpacity;
        });
      } else {
        ribs.forEach((rib) => {
          rib.material.opacity = rib.baseOpacity * helixOpacity;
        });
      }
      group.position.set(
        mobileViewport ? -0.22 + currentProgress * 0.14 : -0.64 + currentProgress * 0.22,
        mobileViewport ? 0.08 - currentProgress * 2.82 + breathing : -0.1 - currentProgress * 2.7 + breathing,
        mobileViewport ? -0.9 + breathing * 0.24 : -1.08 + currentProgress * 0.9 + breathing * 0.32,
      );
      group.rotation.set(
        THREE.MathUtils.degToRad(-14) + roll,
        mobileViewport ? -0.62 + currentProgress * 0.54 + idle : -0.72 + currentProgress * 1.08 + idle,
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

function ProductsPage({
  navigate,
  onProductSelect,
}: {
  navigate: (path: string, scrollTargetId?: string) => void;
  onProductSelect: (product: Product) => void;
}) {
  return (
    <PageShell>
      <div className="home-cinematic page-cinematic products-page-cinematic">
        <ScrollSection className="products-catalog-scene" height="190vh">
          {({ progress }) => <ProductsCatalogScene progress={progress} navigate={navigate} onProductSelect={onProductSelect} />}
        </ScrollSection>
        <ScrollSection className="products-inquiry-scene" height="170vh">
          {({ progress }) => <ProductsInquiryScene progress={progress} navigate={navigate} />}
        </ScrollSection>
      </div>
    </PageShell>
  );
}

function AboutPage({ navigate }: { navigate: (path: string, scrollTargetId?: string) => void }) {
  return (
    <PageShell>
      <div className="home-cinematic page-cinematic about-page-cinematic">
        <ScrollSection className="about-profile-scene" height="185vh">
          {({ progress }) => <AboutProfileScene progress={progress} navigate={navigate} />}
        </ScrollSection>
        <ScrollSection className="about-legal-scene" height="200vh">
          {({ progress }) => <AboutLegalScene progress={progress} navigate={navigate} />}
        </ScrollSection>
      </div>
    </PageShell>
  );
}

function ContactPage() {
  const contactScrollRef = useRef<HTMLDivElement | null>(null);
  const formSectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: contactScrollRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 76,
    damping: 24,
    mass: 0.56,
  });

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageShell>
      <div className="home-cinematic page-cinematic contact-page-cinematic">
        <div className="contact-scroll-experience" ref={contactScrollRef}>
          <ContactIntroScene progress={progress} onRequestQuote={scrollToForm} />
          <ContactFormScene progress={progress} formRef={formSectionRef} />
        </div>
      </div>
    </PageShell>
  );
}

function ProductsCatalogScene({
  progress,
  navigate,
  onProductSelect,
}: {
  progress: MotionValue<number>;
  navigate: (path: string, scrollTargetId?: string) => void;
  onProductSelect: (product: Product) => void;
}) {
  const productCards: ProductCardData[] = products.map((product) => ({
    label: product.previewLabel,
    title: product.name,
    text: product.shortDescription,
    product,
  }));

  return (
    <motion.div
      className="cinematic-scene card-cinematic-scene page-cinematic-scene"
      initial="hidden"
      animate="visible"
      variants={pageHeroContainerVariants}
    >
      <motion.span className="cinematic-label" variants={heroItemVariants}>Products</motion.span>
      <motion.div variants={heroItemVariants}>
        <AnimatedTitle progress={progress} startVisible>
          <motion.span className="products-title-line" variants={titleLineVariants}>Six products for</motion.span>
          <motion.span className="products-title-line" variants={titleLineVariants}>qualified chemical inquiries.</motion.span>
        </AnimatedTitle>
      </motion.div>
      <motion.div variants={heroItemVariants}>
        <AnimatedParagraph progress={progress} startVisible>
          Product names, grade, origin, packaging, availability, and documentation are confirmed through direct commercial inquiry.
        </AnimatedParagraph>
      </motion.div>
      <motion.div variants={cardEntranceVariants}>
        <AnimatedCards
          progress={progress}
          cards={productCards}
          className="product-category-cards page-product-cards"
          onCardClick={(card) => {
            if ("product" in card) {
              onProductSelect((card as ProductCardData).product);
            }
          }}
          startVisible
          carouselCta={
            <>
              <button className="primary-button" type="button" onClick={() => navigate("#/contact", "contact-form")}>
                Request a Quote
                <ArrowRight size={18} weight="bold" />
              </button>
              <button className="secondary-button" type="button" onClick={() => navigate("#/about")}>
                View Company Details
                <ArrowRight size={18} weight="bold" />
              </button>
            </>
          }
        />
      </motion.div>
    </motion.div>
  );
}

function ProductsInquiryScene({ progress, navigate }: { progress: MotionValue<number>; navigate: (path: string, scrollTargetId?: string) => void }) {
  const cards: AnimatedCardData[] = [
    {
      label: "01",
      title: "Product basics",
      text: "Share product, grade target, volume range, and destination before pricing or documentation discussions begin.",
      icon: <CardIcon type="formula" />,
    },
    {
      label: "02",
      title: "Commercial fit",
      text: "The team evaluates counterparties, documentation needs, packaging, and practical trading path.",
      icon: <CardIcon type="check" />,
    },
    {
      label: "03",
      title: "Supply discussion",
      text: "Qualified conversations move toward available terms, origin, timing, and next documentation steps.",
      icon: <CardIcon type="transport" />,
    },
  ];
  return (
    <div className="cinematic-scene card-cinematic-scene page-cinematic-scene">
      <span className="cinematic-label">Inquiry path</span>
      <AnimatedTitle progress={progress}>Start with product, volume, destination, and documents.</AnimatedTitle>
      <AnimatedParagraph progress={progress}>
        The website stays intentionally concise. Specific supply parameters are handled through the contact form instead of a generic catalog exchange.
      </AnimatedParagraph>
      <AnimatedCards
        progress={progress}
        cards={cards}
        className="activity-cards page-process-cards"
        carouselCta={
          <button className="primary-button" type="button" onClick={() => navigate("#/contact", "contact-form")}>
            Discuss Supply
            <ArrowRight size={18} weight="bold" />
          </button>
        }
      />
    </div>
  );
}

function AboutProfileScene({ progress, navigate }: { progress: MotionValue<number>; navigate: (path: string, scrollTargetId?: string) => void }) {
  const cards: AnimatedCardData[] = [
    {
      label: "Legal name",
      title: "PT NEXUS CHEM BRIDGE",
      text: "Indonesia-registered chemical trading and brokerage company.",
      icon: <CardIcon type="company" />,
    },
    {
      label: "Business scope",
      title: "International brokerage",
      text: "Industrial chemicals, fertilizers, and related basic chemical commodities.",
      icon: <CardIcon type="business" />,
    },
    {
      label: "Main license",
      title: "NIB 1603260067144",
      text: "Business identification number serving as the primary company license.",
      icon: <CardIcon type="registration" />,
    },
  ];
  return (
    <motion.div
      className="cinematic-scene card-cinematic-scene page-cinematic-scene"
      initial="hidden"
      animate="visible"
      variants={pageHeroContainerVariants}
    >
      <motion.span className="cinematic-label" variants={heroItemVariants}>About Us</motion.span>
      <motion.div variants={heroItemVariants}>
        <AnimatedTitle progress={progress} startVisible>A registered Indonesian company for chemical trade brokerage.</AnimatedTitle>
      </motion.div>
      <motion.div variants={heroItemVariants}>
        <AnimatedParagraph progress={progress} startVisible>
          The company profile is kept close to the inquiry path so buyers and suppliers can verify the business before opening a commercial discussion.
        </AnimatedParagraph>
      </motion.div>
      <motion.div variants={cardEntranceVariants}>
        <AnimatedCards
          progress={progress}
          cards={cards}
          className="legal-cards page-profile-cards"
          startVisible
          carouselCta={
            <button className="primary-button" type="button" onClick={() => navigate("#/contact", "contact-form")}>
              Contact Us
              <ArrowRight size={18} weight="bold" />
            </button>
          }
        />
      </motion.div>
    </motion.div>
  );
}

function AboutLegalScene({ progress, navigate }: { progress: MotionValue<number>; navigate: (path: string, scrollTargetId?: string) => void }) {
  const legalCards = legalRows.map(([label, value]) => ({
    label,
    title: value,
    text: label.includes("KBLI") ? "Registered business activity for wholesale and chemical product trade." : "Company verification detail for commercial counterparties.",
    icon: <CardIcon type={getLegalCardIconType(label)} />,
  }));

  return (
    <div className="cinematic-scene card-cinematic-scene page-cinematic-scene">
      <span className="cinematic-label">Legal information</span>
      <AnimatedTitle progress={progress}>Company information stays visible, simple, and verifiable.</AnimatedTitle>
      <AnimatedParagraph progress={progress}>
        Registration, tax, address, director, and business activity details are presented as separate liquid glass records.
      </AnimatedParagraph>
      <AnimatedCards
        progress={progress}
        cards={legalCards}
        className="legal-cards page-legal-cards"
        carouselCta={
          <button className="secondary-button" type="button" onClick={() => navigate("#/products")}>
            View Products
            <ArrowRight size={18} weight="bold" />
          </button>
        }
      />
    </div>
  );
}

function ContactIntroScene({ progress, onRequestQuote }: { progress: MotionValue<number>; onRequestQuote: () => void }) {
  const headingOpacity = useTransform(progress, [0, 0.28, 0.46], [1, 1, 0]);
  const headingY = useTransform(progress, [0, 0.46], [0, -80]);
  const subtitleOpacity = useTransform(progress, [0.06, 0.34, 0.52], [1, 1, 0]);
  const subtitleY = useTransform(progress, [0.06, 0.52], [0, -50]);
  const buttonOpacity = useTransform(progress, [0.12, 0.38, 0.56], [1, 1, 0]);
  const buttonY = useTransform(progress, [0.12, 0.56], [0, -30]);

  return (
    <section className="contact-intro-scroll-section" aria-labelledby="contact-intro-title">
      <div className="contact-intro-sticky">
        <motion.div
          className="cinematic-scene contact-intro-scene"
          initial="hidden"
          animate="visible"
          variants={pageHeroContainerVariants}
        >
          <motion.div variants={heroItemVariants}>
            <motion.h1 className="contact-intro-title" id="contact-intro-title" style={{ opacity: headingOpacity, y: headingY }}>
              Send a chemical supply or brokerage inquiry.
            </motion.h1>
          </motion.div>
          <motion.div variants={heroItemVariants}>
            <motion.p className="contact-intro-subtitle" style={{ opacity: subtitleOpacity, y: subtitleY }}>
              Share the product, destination, volume range, and documentation needs so the team can start the right commercial discussion.
            </motion.p>
          </motion.div>
          <motion.div variants={cardEntranceVariants}>
            <motion.div className="contact-intro-actions" style={{ opacity: buttonOpacity, y: buttonY }}>
              <button className="primary-button contact-request-button" type="button" onClick={onRequestQuote}>
                Request a Quote
                <ArrowRight size={18} weight="bold" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactFormScene({ progress, formRef }: { progress: MotionValue<number>; formRef: RefObject<HTMLElement | null> }) {
  const labelOpacity = useTransform(progress, [0.28, 0.4], [0, 1]);
  const headingOpacity = useTransform(progress, [0.32, 0.46], [0, 1]);
  const headingY = useTransform(progress, [0.32, 0.46], [80, 0]);
  const helperOpacity = useTransform(progress, [0.36, 0.5], [0, 1]);
  const helperY = useTransform(progress, [0.36, 0.5], [52, 0]);
  const formOpacity = useTransform(progress, [0.38, 0.5], [0, 1]);
  const formY = useTransform(progress, [0.38, 0.5], [100, 0]);
  const formScale = useTransform(progress, [0.38, 0.5], [0.96, 1]);

  return (
    <section className="contact-form-scroll-section" id="contact-form" ref={formRef} aria-labelledby="contact-form-title">
      <div className="cinematic-scene contact-form-cinematic-scene contact-page-scene">
        <motion.span className="cinematic-label" style={{ opacity: labelOpacity }}>Fill in form</motion.span>
        <motion.h2 className="contact-form-title" id="contact-form-title" style={{ opacity: headingOpacity, y: headingY }}>
          Tell us what you need.
        </motion.h2>
        <motion.p className="contact-form-helper" style={{ opacity: helperOpacity, y: helperY }}>
          Send the product, quantity, destination, and documentation requirements. We will review the inquiry and respond with the next commercial steps.
        </motion.p>
        <motion.div className="contact-form-stage" style={{ opacity: formOpacity, y: formY, scale: formScale }}>
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState("");

  const productOptions = useMemo(() => products.map((product) => product.name), []);
  const formVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.055,
        delayChildren: 0.12,
      },
    },
  };
  const fieldVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};

    ["name", "company", "email", "product", "destination", "volume", "message"].forEach((field) => {
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
    <motion.form
      className="contact-form liquid-form"
      onSubmit={handleSubmit}
      noValidate
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={formVariants}
    >
      <div className="form-grid">
        <Field label="Name" name="name" error={errors.name} variants={fieldVariants}>
          <input id="name" name="name" autoComplete="name" placeholder="Your full name" />
        </Field>
        <Field label="Company" name="company" error={errors.company} variants={fieldVariants}>
          <input id="company" name="company" autoComplete="organization" placeholder="Company name" />
        </Field>
      </div>
      <Field label="Email" name="email" error={errors.email} variants={fieldVariants}>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="name@company.com" />
      </Field>
      <div className="form-grid">
        <Field label="Product of interest" name="product" error={errors.product} variants={fieldVariants}>
          <ProductInterestDropdown
            id="product"
            name="product"
            options={productOptions}
            value={selectedProduct}
            onChange={setSelectedProduct}
            hasError={Boolean(errors.product)}
          />
        </Field>
        <Field label="Destination / market" name="destination" error={errors.destination} variants={fieldVariants}>
          <input id="destination" name="destination" autoComplete="country-name" placeholder="Destination country or market" />
        </Field>
      </div>
      <Field label="Volume range" name="volume" error={errors.volume} variants={fieldVariants}>
        <input id="volume" name="volume" placeholder="Estimated quantity or shipment range" />
      </Field>
      <Field label="Message / inquiry details" name="message" error={errors.message} helper="Include grade, packaging, timing, documentation, and any counterparties if known." variants={fieldVariants}>
        <textarea id="message" name="message" rows={6} placeholder="Tell us what you need." />
      </Field>
      {submitted && (
        <div className="success-state" role="status">
          <Check size={18} weight="bold" />
          <span>Inquiry details are ready. Connect this form to your email or CRM before launch.</span>
        </div>
      )}
      <motion.button className="primary-button form-submit" type="submit" variants={fieldVariants}>
        Send Inquiry
        <ArrowRight size={18} weight="bold" />
      </motion.button>
    </motion.form>
  );
}

function Field({
  label,
  name,
  error,
  helper,
  variants,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  helper?: string;
  variants?: Variants;
  children: ReactNode;
}) {
  return (
    <motion.div className="field" variants={variants}>
      <label htmlFor={name} id={`${name}-label`}>{label}</label>
      {children}
      {helper && <p className="helper-text">{helper}</p>}
      {error && <p className="error-text">{error}</p>}
    </motion.div>
  );
}

function ProductInterestDropdown({
  id,
  name,
  options,
  value,
  onChange,
  hasError = false,
}: {
  id: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(() => Math.max(options.indexOf(value), 0));
  const selectedIndex = options.indexOf(value);
  const menuId = `${id}-menu`;
  const buttonId = `${id}-button`;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, selectedIndex]);

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const moveHighlight = (direction: number) => {
    setHighlightedIndex((current) => {
      const nextIndex = (current + direction + options.length) % options.length;
      return nextIndex;
    });
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      moveHighlight(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      moveHighlight(-1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const highlightedOption = options[highlightedIndex];
      if (highlightedOption) {
        selectOption(highlightedOption);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className={`product-dropdown ${isOpen ? "is-open" : ""} ${hasError ? "has-error" : ""}`.trim()} ref={dropdownRef}>
      <input id={id} name={name} type="hidden" value={value} />
      <button
        className="product-dropdown-control"
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-labelledby={`${id}-label ${buttonId}`}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className={value ? "product-dropdown-value" : "product-dropdown-placeholder"}>
          {value || "Select a product"}
        </span>
        <ChevronDown className="product-dropdown-chevron" size={18} strokeWidth={1.8} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="product-dropdown-menu"
            id={menuId}
            role="listbox"
            aria-labelledby={`${id}-label`}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {options.map((option, index) => {
              const isSelected = option === value;
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  className={`product-dropdown-option ${isSelected ? "is-selected" : ""} ${isHighlighted ? "is-highlighted" : ""}`.trim()}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  key={option}
                  onClick={() => selectOption(option)}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    selectOption(option);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span>{option}</span>
                  {isSelected && <Check size={15} weight="bold" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      </div>
    </footer>
  );
}

export default App;
