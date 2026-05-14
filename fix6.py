import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Add height/min-height fixes
css = """
html, body, #root {
  height: 100%;
}
""" + css

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
