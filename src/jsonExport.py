import packetAnalyzer
import json
from sites import *
import time


def writeJson(d):  #not yet implemented

	with open('data.json', 'w') as fp:
		for key in d:
			json.dump(d[key].getJSON(), fp)
			fp.write('\n')

def writeJson2(d):  #not yet implemented

	with open('data2.json', 'w') as fp:
		for key in d:
			json.dump(d[key].getJSON(), fp)
			fp.write('\n')