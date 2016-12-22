import packetAnalyzer
import json
from sites import *
import time
import socket
from sendData import *



def writeJson(d):  #not yet implemented
	for key in d:
		d[key].setWeights()

	# for key in sorted(d, key = lambda name: d[name].getRT()):
	# 	while(count < 20 or count2 < len(d)):
	# 		# if not key in newd:
	# 		# 	newd[key] = d[key]
	# 		newd[key] = key
	# 		count+=1
	# 		count2+=1


	with open('data.json', 'w') as fp:
		fp.write("[")
		for key in d:
			json.dump(d[key].getJSON(), fp)
			if (key != d.keys()[-1]):
				fp.write(',')
			fp.write('\n')
		fp.write("]")
	print "wrote json"
	fp.close()
	client()  

