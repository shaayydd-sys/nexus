import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace -webkit-fill-available
css = re.sub(r"@supports \(-webkit-touch-callout: none\)\s*\{\s*html,\s*body,\s*#root,\s*\.page-shell,\s*\.home-main,\s*\.home-cinematic\s*\{\s*min-height:\s*-webkit-fill-available;\s*\}\s*.*?\n\}", "", css, flags=re.MULTILINE | re.DOTALL)

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
