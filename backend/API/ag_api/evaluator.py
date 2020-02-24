#!/usr/bin/python3
import subprocess
import json
def execute(data_object):
    json_str = json.dumps(data_object)
    proc = subprocess.run(
        [
            "lxc", "exec", "my-ubuntu", "--", "sudo", "--login", "--user", "ag", "./worker.py", json_str,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    resp = proc.stdout.decode("utf-8")
    return json.loads(resp)
