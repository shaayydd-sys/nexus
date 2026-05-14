import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make sure meta viewport is super precise for iOS
html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />', '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />')
html = html.replace('<meta name="apple-mobile-web-app-status-bar-style" content="default" />', '<meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />')


with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
