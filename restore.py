import os

with open("index.html", "w", encoding="utf-8") as f:
    f.write('''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta
      name="description"
      content="PT NEXUS CHEM BRIDGE is an Indonesia-registered international trading and brokerage company for industrial chemicals, fertilizers, and basic chemical commodities."
    />
    <title>PT NEXUS CHEM BRIDGE</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>''')
