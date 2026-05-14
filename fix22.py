import subprocess

repo_root = "C:/Users/damir/Documents/PT NEXUS CHEM BRIDGE"
subprocess.run(["git", "checkout", "b57f09d4fc440b7bea0fcc2c735d0527b83e8d20", "src/styles.css"], cwd=repo_root)
subprocess.run(["git", "checkout", "b57f09d4fc440b7bea0fcc2c735d0527b83e8d20", "index.html"], cwd=repo_root)
