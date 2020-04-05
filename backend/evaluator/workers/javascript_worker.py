#!/bin/python3
import sys,json,os,subprocess
from timeit import default_timer
#Function that creates a file and
#writes content to it
def writeToFile(file, input):
	file = open(file, "w")
	file.write(input)
	file.close()


#Collect json data
json_str = sys.argv[1]
#Convert json to dicitionary
obj = json.loads(json_str)
#Set provided execution time limit
EXECUTION_TIME_LIMIT = float(obj['time_limit'])
MEMORY_LIMIT = float(obj['memory_limit'])

#Get file name from the request
file_name = obj['filename'] if obj['filename'] else 'example'

#Insert Javascript source code into a file
writeToFile("{}.js".format(file_name), obj['source_text'])

#Initial response is empty
FINAL_RESPONSE = []


#https://nodejs.org/api/cli.html#cli_c_check
#Check for syntax errors
#If there are syntax errors we should let the 
#user know that his program has encountered
# a `compilation` error

proc = subprocess.run(
    [
        "node",
        "--check",
        "{}.js".format(file_name)
    ],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)
if proc.stderr:
    RESPONSE = {}
    RESPONSE['compilation_error'] = proc.stderr.decode("utf-8")
    try:
        os.remove("{}.js".format(file_name))
        pass
    except:
        pass
    print(json.dumps(RESPONSE))
    exit()




for input_set in obj['stdin']:
    RESPONSE = {}
    #Start timer
    START_TIME = default_timer()
    try:
        proc = subprocess.run(
            [
                "node",
                "{}.js".format(file_name)
            ],
            input=input_set,
            encoding="utf-8",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=EXECUTION_TIME_LIMIT
        )
    except subprocess.TimeoutExpired:
        RESPONSE['time'] = "Time limit exceeded"
    else:
        elapsed = default_timer() - START_TIME
        RESPONSE['stdout'] = proc.stdout
        RESPONSE['stderr'] = proc.stderr
        RESPONSE['time'] = "%.2fms" % (elapsed*1000)
        RESPONSE['returncode'] = proc.returncode
    finally:
        #Add current response to the final response
        #print(json.dumps(RESPONSE))
        FINAL_RESPONSE.append(RESPONSE)
print(json.dumps(FINAL_RESPONSE))



try:
    os.remove("{}.js".format(file_name))
    pass
except:
    pass
