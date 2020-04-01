#!/usr/bin/python3.7
import json,subprocess,sys,os
from timeit import default_timer

#If the compilation process takes too much
#then throw a TimeoutExpired execption
COMPILATION_TIME_LIMIT = 0.50


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
file_name = obj['filename'] if obj['filename'] else 'example'

#Insert C++ source code into a file
writeToFile("{}.java".format(file_name),obj['source_text'])


#Source compilation
proc=subprocess.run(
	[
	"javac",
	"{}.java".format(file_name),
	],
	stdout=subprocess.PIPE,
	stderr=subprocess.PIPE,
)

#Remove file from filesystem
try:
	os.remove("{}.java".format(file_name))
except:
	pass


if proc.stderr:
	RESPONSE = {}
	RESPONSE['compilation_error']=proc.stderr.decode("utf-8")
	print(json.dumps(RESPONSE))
else:
		#Initial response is empty
	FINAL_RESPONSE = []
	for input_set in obj['stdin']:
		RESPONSE = {}
		START_TIME = default_timer()
		try:
			proc=subprocess.run(
				[
				"java",
				file_name,
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
			FINAL_RESPONSE.append(RESPONSE)
	try:
		os.remove("{}.class".format(file_name))
	except:
		pass
	print(json.dumps(FINAL_RESPONSE))
