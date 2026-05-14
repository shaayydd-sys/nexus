import subprocess
import os

repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"
subprocess.run(["git", "restore", "index.html", "src/styles.css"], cwd=repo_root)
