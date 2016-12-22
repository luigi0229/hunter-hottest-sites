
import socket               # Import socket module
import os
import time
#import netifaces as ni
# ni.ifaddresses('eth0')
# ip = ni.ifaddresses('eth0')[2][0]['addr']


host = '35.164.59.77'  # Get local machine name
port = 12345    

         # Create a socket object

def startSend(s):
    f = open('data.json','rb')
    data = f.read()
    s.sendall(data)
    f.close()
    s.close()
    print "Data Sent!"


def client():
    try:
        s = socket.socket()
        #s.bind((ip,0))
        print "Trying to connect to host..."
        s.connect((host, port))
        startSend(s)
    except socket.error:
        print "socket error"
