import subprocess
import re

repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"

# 1. Restore to origin/main
subprocess.run(["python", "restore_styles.py"], cwd=repo_root)

# 2. Read the restored styles.css
with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# 3. Apply the exact safe-area fix to the helix scene
# Find the .page-helix-scene block
old_helix_block = """
.page-helix-scene {
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
"""

new_helix_block = """
.page-helix-scene {
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
"""

css = css.replace(old_helix_block.strip(), new_helix_block.strip())

# Also fix the general background wrapper
old_bg_block = """
.site-background,
.helix-background,
.canvas-wrapper,
.motion-background {
  position: fixed;
  top: -120px;
  right: 0;
  bottom: -120px;
  left: 0;
  width: 100vw;
  height: auto;
  min-height: calc(100lvh + 240px);
  pointer-events: none;
  z-index: 0;
  background: var(--site-bg);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout paint size;
  will-change: transform, opacity;
}
"""

new_bg_block = """
.site-background,
.helix-background,
.canvas-wrapper,
.motion-background {
  position: fixed;
  top: -120px;
  right: 0;
  bottom: -120px;
  left: 0;
  width: 100vw;
  height: auto;
  min-height: calc(100vh + 240px + env(safe-area-inset-bottom) + env(safe-area-inset-top));
  min-height: calc(100dvh + 240px + env(safe-area-inset-bottom) + env(safe-area-inset-top));
  pointer-events: none;
  z-index: 0;
  background: var(--site-bg);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  contain: layout paint size;
  will-change: transform, opacity;
}
"""
css = css.replace(old_bg_block.strip(), new_bg_block.strip())

# Fix the mobile override
old_mobile_helix = """
  .page-helix-scene,
  .concept-helix-scene,
  .site-background,
  .helix-background,
  .canvas-wrapper,
  .motion-background {
    height: auto;
    min-height: calc(100vh + 240px);
  }
"""

new_mobile_helix = """
  .page-helix-scene,
  .concept-helix-scene,
  .site-background,
  .helix-background,
  .canvas-wrapper,
  .motion-background {
    height: auto;
    min-height: calc(100vh + 240px + env(safe-area-inset-bottom) + env(safe-area-inset-top));
    min-height: calc(100dvh + 240px + env(safe-area-inset-bottom) + env(safe-area-inset-top));
  }
"""
css = css.replace(old_mobile_helix.strip(), new_mobile_helix.strip())

# Add body padding for safe areas to the very end of the file
css += "\n\n@supports (padding-bottom: env(safe-area-inset-bottom)) {\n  body {\n    padding-bottom: env(safe-area-inset-bottom);\n  }\n}\n"

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
