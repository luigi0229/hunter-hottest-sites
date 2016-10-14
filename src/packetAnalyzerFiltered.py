
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
        destIP = "nothing"    #strips the destination of the packet (in IP format)
        srcIP = str(pkt.ip.src)     #strips the source of the packet (IP of device)
        traffic = int(pkt.length)   #strips the length of the packet

        if (destIP[0:3] == "146"):  #Filters anything with a 146 address on the first octect (These are hunter's network addresses)
                return

        if "facebook" in str(pkt):
            destIP = "Facebook"

        if "netflix" in str(pkt):
            destIP = "Netflix"

        if "youtube" in str(pkt):
            destIP = "Youtube"

        if "instagram" in str(pkt):
            destIP = "Instagram"

        if "amazon" in str(pkt):
            destIP = "Amazon"

        if "git" in str(pkt):
            destIP = "GitHub"

        if destIP != "nothing":
            if not destIP in d:                         #Creates a new instance of the class, adds it to a dictionary (d), and the hostname is the key
                d[destIP] = SiteData(destIP)

            d[destIP].addIP(srcIP)
            d[destIP].incrementCount()
            d[destIP].incrementTraffic(traffic)


    except AttributeError as e:
        pass

    for key in d:
        print d[key]
        print "total sites seen: ", len(d)
        print "-------------------------------------------------------"


    if(int(time.time()) > endTime and trigger == True):
        print "Writting to json"
        writeJson2(d)
        trigger = False


def startCapture2():
<<<<<<< HEAD
    capture = pyshark.LiveCapture(interface='en0s asdf', only_summaries=False)    #creates a new pyshark object with a specific interface and desired parameters 
=======
    capture = pyshark.LiveCapture(interface='en0', only_summaries=False)    #creates a new pyshark object with a specific interface and desired parameters
>>>>>>> bb71a2585c1512d4242d2efaf2847b02745e8708
    capture.apply_on_packets(examinePacket)                                 #sends every packet to the examinePAcket function above to examine them
