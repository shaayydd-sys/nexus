import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's fix the canvas safe areas properly this time while keeping the layout intact
css = css.replace("""
.page-helix-scene,
.concept-helix-scene {
  position: fixed;
  top: -120px;
  right: 0;
  bottom: -120px;
  left: 0;
  width: 100vw;
  height: auto;
  min-height: calc(100lvh + 240px);
  z-index: 0;
  pointer-events: none;
  opacity: 1;
  background: var(--site-bg);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout paint size;
  will-change: transform, opacity;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}
""", """
.page-helix-scene,
.concept-helix-scene {
  position: fixed;
  top: -120px;
  right: 0;
  bottom: -120px;
  left: 0;
  width: 100vw;
  height: auto;
  min-height: calc(100vh + 240px + env(safe-area-inset-bottom) + env(safe-area-inset-top));
  min-height: calc(100dvh + 240px + env(safe-area-inset-bottom) + env(safe-area-inset-top));
  z-index: 0;
  pointer-events: none;
  opacity: 1;
  background: var(--site-bg);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout paint size;
  will-change: transform, opacity;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
}
""")


with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
