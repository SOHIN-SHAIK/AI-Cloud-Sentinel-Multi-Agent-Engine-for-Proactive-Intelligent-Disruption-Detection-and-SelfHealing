import os

def validate():
    if not os.path.exists("anomaly_report.txt"):
        print("FAIL: output file missing")
        return

    with open("anomaly_report.txt") as f:
        data = f.read()

    if "ALERT" not in data:
        print("FAIL: anomaly not detected")
        return

    print("PASS: evaluation successful")

validate()
