import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's remove the absolute positioning stuff that usually breaks PWA on iOS
html = html.replace('body { background-color: #ffffff; } /* explicitly setting body to white too */', 'body { background-color: #ffffff; }\n      #root { background-color: #ffffff; }')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
