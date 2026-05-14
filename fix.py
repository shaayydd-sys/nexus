import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace 100svh with 100vh
css = css.replace("100svh", "100vh")
# Replace 100dvh with 100lvh
css = css.replace("100dvh", "100lvh")

# Remove the -webkit-fill-available block for height
css = re.sub(r"@supports \(-webkit-touch-callout: none\) \{[^\}]*min-height: -webkit-fill-available;\s*\}\s*\}", "", css, flags=re.MULTILINE | re.DOTALL)

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
