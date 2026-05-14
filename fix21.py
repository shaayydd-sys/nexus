import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Let's revert the mobile section height changes back to 100svh/100dvh combo that was working better for layout
css = re.sub(r"min-height: 100dvh;\s+min-height: 100vh;", "min-height: 100svh;\n    min-height: 100dvh;", css)
css = re.sub(r"height: 100dvh;\s+height: 100vh;", "height: 100svh;\n    height: 100dvh;", css)

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
