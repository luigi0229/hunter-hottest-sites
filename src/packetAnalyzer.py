
from sites import *
import math
import pyshark
import socket
from jsonExport import *
import time
from datetime import datetime, timedelta

trigger = True
global endTime
endTime = int(time.time()) + 300


d = {}

def examinePacket(pkt):
    global trigger
    try:
        destIP = str(pkt.ip.dst)    #strips the destination of the packet (in IP format)
        srcIP = str(pkt.ip.src)     #strips the source of the packet (IP of device)
        traffic = int(pkt.length)   #strips the length of the packet

        if (destIP[0:3] == "146"):  #Filters anything with a 146 address on the first octect (These are hunter's network addresses)
                return

        try:
            destIP = socket.gethostbyaddr(destIP)[0]    #Converts IP to hostname (if it exists)
            destIP = destIP.split('.',destIP.count('.')-1)[-1]

            if not destIP in d:                         #Creates a new instance of the class, adds it to a dictionary (d), and the hostname is the key
                d[destIP] = SiteData(destIP)

            d[destIP].addIP(srcIP)
            d[destIP].incrementCount()
            d[destIP].incrementTraffic(traffic)

        except socket.herror as e:
            pass

    except AttributeError as e:
        pass

    for key in d:
        print d[key]
        print "total sites seen: ", len(d)
        print "-------------------------------------------------------"


    if(int(time.time()) > endTime and trigger == True):
        print "Writting to json"
        writeJson(d)
        trigger = False


def startCapture():
    capture = pyshark.LiveCapture(interface='en0', only_summaries=False)    #creates a new pyshark object with a specific interface and desired parameters 
    capture.apply_on_packets(examinePacket)                                 #sends every packet to the examinePAcket function above to examine them
