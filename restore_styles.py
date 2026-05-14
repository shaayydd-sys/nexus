import urllib.request
import json
import os

# We will read the main file from local git if we can, or just write it from the show command output
import subprocess
repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"
result = subprocess.run(["git", "show", "origin/main:src/styles.css"], cwd=repo_root, capture_output=True, text=True)

with open("src/styles.css", "w", encoding="utf-8") as f:
    f.write(result.stdout)

result_html = subprocess.run(["git", "show", "origin/main:index.html"], cwd=repo_root, capture_output=True, text=True)
with open("index.html", "w", encoding="utf-8") as f:
    f.write(result_html.stdout)
