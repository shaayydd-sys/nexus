import subprocess
import os

repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"

# 1. Restore exactly to origin/main
print("Restoring styles and index...")
result = subprocess.run(["git", "show", "origin/main:src/styles.css"], cwd=repo_root, capture_output=True, text=True)
with open(os.path.join(repo_root, "src/styles.css"), "w", encoding="utf-8") as f:
    f.write(result.stdout)

result_html = subprocess.run(["git", "show", "origin/main:index.html"], cwd=repo_root, capture_output=True, text=True)
with open(os.path.join(repo_root, "index.html"), "w", encoding="utf-8") as f:
    f.write(result_html.stdout)

print("Applying specific safe area fixes...")
# 2. Modify styles.css carefully
with open(os.path.join(repo_root, "src/styles.css"), "r", encoding="utf-8") as f:
    css = f.read()

# Add safe area padding to body so content doesn't get hidden under the iOS bottom bar
css += """

/* --- SAFE AREA FIXES --- */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
"""

# Find the mobile media query that sets min-height: calc(100vh + 240px)
# and replace it with 100lvh to avoid the white flashing on scroll, and add safe area
mobile_override_old = """
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

mobile_override_new = """
  .page-helix-scene,
  .concept-helix-scene,
  .site-background,
  .helix-background,
  .canvas-wrapper,
  .motion-background {
    height: auto;
    /* Use 100lvh to prevent resize flashing on scroll, and add safe-area to extend under toolbar */
    min-height: calc(100lvh + 240px + env(safe-area-inset-bottom, 40px));
  }
"""

if mobile_override_old.strip() in css:
    css = css.replace(mobile_override_old.strip(), mobile_override_new.strip())

with open(os.path.join(repo_root, "src/styles.css"), "w", encoding="utf-8") as f:
    f.write(css)

# 3. Ensure viewport-fit=cover is in index.html
with open(os.path.join(repo_root, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

if 'viewport-fit=cover' not in html:
    html = html.replace('content="width=device-width, initial-scale=1"', 'content="width=device-width, initial-scale=1, viewport-fit=cover"')

with open(os.path.join(repo_root, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("Done.")