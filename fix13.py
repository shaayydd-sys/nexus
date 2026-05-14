import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make sure meta viewport is super precise for iOS
html = html.replace('<style>\n      html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #ffffff; }\n    </style>', '<style>\n      html { background-color: #ffffff; }\n      body { background-color: transparent; }\n    </style>')


with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
