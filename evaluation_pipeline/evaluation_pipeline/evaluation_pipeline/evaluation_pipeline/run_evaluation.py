import subprocess

print("Running evaluation pipeline...")

subprocess.run(["python", "validator.py"])

print("Evaluation completed.")
