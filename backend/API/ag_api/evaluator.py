#!/usr/bin/python3

import subprocess,os
import json

def log_output(process):
    print("\n"*2,"-"*5,"Evaluator Error","-"*5)
    print(process.stderr.decode("utf-8"))
    print("\n"*2,"-"*5, "Evaluator Error", "-"*5)
    print("\n"*2, "-"*5, "Evaluator Response", "-"*5)
    print(process.stdout.decode("utf-8"))
    print("\n"*2, "-"*5, "Evaluator Response", "-"*5)

def execute(data_object,worker_type):

    '''
    First copy the updated worker into the 
    container

    cps = subprocess.run(
        [
            'lxc',
            'file',
            'push',
            '../evaluator_workers/{}_worker.py'.format(worker_type),
            'my-ubuntu/workers/{}_worker.py'.format(worker_type),
        ],
        stdout=subprocess.DEVNULL,
    )
    '''

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

    #log_output(proc)

    return json.loads(resp)

