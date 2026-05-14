import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make sure meta viewport is super precise for iOS
html = html.replace('content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no"', 'content="width=device-width, initial-scale=1, viewport-fit=cover"')
html = html.replace('<meta name="apple-mobile-web-app-capable" content="yes" />', '')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
