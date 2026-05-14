import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's fix safe areas explicitly
css = css.replace("""
  body {
    padding-bottom: env(safe-area-inset-bottom);
    padding-top: env(safe-area-inset-top);
    background-color: var(--site-bg);
  }""", """
  body {
    background-color: var(--site-bg);
  }

  #root {
    padding-bottom: env(safe-area-inset-bottom);
    padding-top: env(safe-area-inset-top);
  }
""")


with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
