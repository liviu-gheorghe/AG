#!/usr/bin/python3.7
import json,subprocess,sys,os
from timeit import default_timer


#If the compilation process takes too much
#then throw a TimeoutExpired execption
COMPILATION_TIME_LIMIT = 0.5


#Function that creates a file and 
#writes content to it
def writeToFile(file,input):
	file = open(file,"w")
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
filename = obj['filename'] if obj['filename'] else 'example'

#Insert C++ source code into a file
writeToFile("{}.cpp".format(filename),obj['source_text'])


#Source compilation
try:
	proc=subprocess.run(
		[
		"make",
		filename,
		],
		stdout=subprocess.PIPE,
		stderr=subprocess.PIPE,
		timeout=COMPILATION_TIME_LIMIT,
	)
except subprocess.TimeoutExpired:
	RESPONSE = {}
	RESPONSE['compilation_error']='Compilation time exceeded'
	print(json.dumps(RESPONSE))
	exit()

#Remove file from filesystem

os.remove("{}.cpp".format(filename))

if proc.stderr:
	RESPONSE = {}
	RESPONSE['compilation_error']=proc.stderr.decode("utf-8")
	print(json.dumps(RESPONSE))
	exit()


#Initial response is empty
FINAL_RESPONSE = []

for input_set in obj['stdin']:
	RESPONSE = {}
	START_TIME = default_timer()
	try:
		proc=subprocess.run(
			[
			"./{}".format(filename)
			],
			input=input_set,
			encoding="utf-8",
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE,
			timeout=EXECUTION_TIME_LIMIT,
		)
	except subprocess.TimeoutExpired:
		RESPONSE['time']="Time limit exceeded"
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


os.remove(filename)
print(json.dumps(FINAL_RESPONSE))

