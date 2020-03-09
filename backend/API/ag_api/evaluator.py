#!/usr/bin/python3
import subprocess
import json
def execute(data_object,worker_type):
    json_str = json.dumps(data_object)
    proc = subprocess.run(
        [
            "lxc", 
            "exec",
            "my-ubuntu", 
            "--", "sudo", 
            "--login", 
            "--user", 
            "liviu", 
            "/workers/{}_worker.py".format(worker_type), 
            json_str,
        ],
        
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    resp = proc.stdout.decode("utf-8")
    
    '''
    print("\n"*2,"-"*5,"Evaluator Error","-"*5)
    print(proc.stderr.decode("utf-8"))
    print("\n"*2,"-"*5, "Evaluator Error", "-"*5)
    print(resp)
    '''

    return json.loads(resp)
