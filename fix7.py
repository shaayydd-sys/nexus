import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make sure body is full size
if "html, body, #root {" not in html:
    html = html.replace('</head>', '  <style>\n    html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #ffffff; }\n  </style>\n  </head>')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
