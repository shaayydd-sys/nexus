import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make sure meta viewport is super precise for iOS
html = html.replace('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />', '<meta name="apple-mobile-web-app-status-bar-style" content="white" />')


with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
