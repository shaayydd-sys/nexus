import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make sure meta viewport is correct for iOS bottom bar
if "viewport-fit=cover" not in html:
    html = html.replace('content="width=device-width, initial-scale=1"', 'content="width=device-width, initial-scale=1, viewport-fit=cover"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
