import os

# First reset back to origin/main styles
with open("src/styles.css", "w", encoding="utf-8") as f:
    pass

import subprocess
repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"
subprocess.run(["git", "restore", "src/styles.css"], cwd=repo_root)
subprocess.run(["git", "restore", "index.html"], cwd=repo_root)
