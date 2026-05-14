import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Add height/min-height fixes specifically targeting iOS overscroll
css = css.replace("height: 100vh;", "height: 100vh; height: 100dvh;")
css = css.replace("min-height: 100vh;", "min-height: 100vh; min-height: 100dvh;")

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
