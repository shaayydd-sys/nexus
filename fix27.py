import subprocess
repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"
subprocess.run(["git", "restore", "src/styles.css"], cwd=repo_root)
subprocess.run(["git", "restore", "index.html"], cwd=repo_root)
