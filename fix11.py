import re

with open("src/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Add fixed position for html and body on mobile
css += """
@media (max-width: 768px) {
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
}
"""

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(css)
