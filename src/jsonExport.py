import packetAnalyzer
import json
from sites import *
import time
import socket



def writeJson(d):  #not yet implemented

	with open('data.json', 'w') as fp:
		fp.write("[")
		for key in d:
			json.dump(d[key].getJSON(), fp)
			if (key != d.keys()[-1]):
				fp.write(',')
			fp.write('\n')
		fp.write("]")
	fp.close()

	# s = socket.socket()         # Create a socket object
	# host = '146.95.219.133' # Get local machine name
	# port = 12348                 # Reserve a port for your service.

	# s.connect((host, port))
	# s.send("Hello server!")
	# f = open('data.json','rb')
	# print 'Sending...'
	# l = f.read(1024)
	# while (l):
	#     print 'Sending...'
	#     s.send(l)
	#     l = f.read(1024)
	# f.close()
	# print "Done Sending"
	# # s.send("STOP")
	# print s.recv(1024)
	# s.shutdown(2)
	# s.close    

