import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Add fixed position for html and body on mobile
css = css.replace("""
  html, body {
    position: fixed;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }

  #root {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
""", """
  html, body {
    width: 100%;
    min-height: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: var(--site-bg);
    /* Crucial fix for iOS safe areas */
    background-color: #ffffff;
  }

  body {
    padding-bottom: env(safe-area-inset-bottom);
    padding-top: env(safe-area-inset-top);
    background-color: var(--site-bg);
  }
""")

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
