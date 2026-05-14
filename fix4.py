import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

css += """
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
"""

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
