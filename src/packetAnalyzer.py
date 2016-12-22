import math
import pyshark
import socket
import time
from datetime import datetime, timedelta

from sites import *
from jsonExport import *
from knownStuff import *

global Max
Max = 0
maxIP = 0
maxPackets = 0


trigger = True
global endTime
#endTime = int(time.time()) + 1400

d = {}

#17.249.121.246
def examinePacket(pkt):
    global trigger
    global destIP
    #destIP = " "
    global Max
    global maxIP
    global maxPackets
    try:
        destIP = str(pkt.ip.dst)    #strips the destination of the packet (in IP format)
        serverIP = destIP
        srcIP = str(pkt.ip.src)     #strips the source of the packet (IP of device)
        traffic = int(pkt.length)   #strips the length of the packet

        if (destIP[0:3] == "146" or destIP == "17.249.121.246" ):  #Filters anything with a 146 address on the first octect (These are hunter's network addresses) AND my home address
            return

        #destIP.count('.')-2)[-1] will get 2 dots. example, it will get xxx.yyy.zzz
        #destIP.count('.')-1)[-1] will get 1 dot. example, it will get yyy.zzz
        #'.'.join(x.split('.')[0:2])

        if (knownSitesDic.has_key('.'.join(destIP.split('.')[0:2]))): #this is checking if the destination IP is a key in a dictionary called 'knownSitesDic'
            print "saw ", knownSitesDic['.'.join(destIP.split('.')[0:2])]
            destIP = knownSitesDic['.'.join(destIP.split('.')[0:2])]
            
            if not destIP in d:             # This dictionary has list of services mapped to their IPs, this is more accurate than using the socket.gethostbyaddr on the try method below
                d[destIP] = SiteData(destIP) # Because we know for a fact that these IPs are mapped to these websites/services
                d[destIP].setMax(Max)
                d[destIP].setServerIP(serverIP)

            d[destIP].addIP(srcIP)
            d[destIP].incrementCount()
            d[destIP].incrementTraffic(traffic)
            d[destIP].setMax(Max)
            d[destIP].setLastSeen()

            if(Max < d[destIP].getSize()):   #All the sites need to who has the max length (in bytes), and have this value. I forgot why...
                Max = d[destIP].getSize()
                for key in d:
                    d[key].setMax(Max)  
                
            if(maxIP < d[destIP].getIPlength()):
                maxIP = d[destIP].getIPlength()

            for key in d:
                d[key].setMaxIP(maxIP)

            if(maxPackets < d[destIP].getCount()):
                maxPackets = d[destIP].getCount()

            for key in d:
                d[destIP].setMaxPackets(maxPackets)

            #Below old coloring approach, it works

            # if(d[destIP].getName() == "Facebook" and d[destIP].getRandomColor() == True):
            #     print "set color on ", d[destIP].getName()
            #     d[destIP].setColor('3b5998')   #Sets the color
            #     d[destIP].setRandomColor()     #Sets the trigger to false informing the color was already set

            # if(d[destIP].getName() == "Netflix" and d[destIP].getRandomColor() == True):
            #     print "set color on ", d[destIP]
            #     d[destIP].setColor('B9090B')
            #     d[destIP].setRandomColor()

            # if(d[destIP].getName() == "Spotify" and d[destIP].getRandomColor() == True):
            #     print "set color on ", d[destIP].getName()
            #     d[destIP].setColor('84bd00')
            #     d[destIP].setRandomColor()

            # if(d[destIP].getName() == "Snapchat" and d[destIP].getRandomColor() == True):
            #     print "set color on ", d[destIP].getName()
            #     d[destIP].setColor('fffc00')
            #     d[destIP].setRandomColor()

                #New coloring approach

            if(colorsDic.has_key(destIP) and d[destIP].getRandomColor() == True):
                print "set color on ", d[destIP].getName()
                d[destIP].setColor(colorsDic[d[destIP].getName()])
                d[destIP].setRandomColor()

        else:
            try:
                destIP = socket.gethostbyaddr(destIP)[0]    #Converts IP to hostname (if it exists)
                destIP = destIP.split('.',destIP.count('.')-1)[-1]

                if(destIP in ignorelist):
                	return

                if (destIP == "fbcdn.net" or destIP == "facebook.com"):
                	destIP = "Facebook"
                
                if (destIP == "nflxvideo.net"):
                    destIP = "Netflix"

                if (destIP == "spotify.com"):
                    destIP = "Spotify"
                
                if not destIP in d:                         #Creates a new instance of the class, adds it to a dictionary (d), and the hostname is the key
                    d[destIP] = SiteData(destIP)
                    d[destIP].setMax(Max)
                    d[destIP].setServerIP(serverIP)

                d[destIP].addIP(srcIP)
                d[destIP].incrementCount()
                d[destIP].incrementTraffic(traffic)
                d[destIP].setMax(Max)
                d[destIP].setLastSeen()

                if(maxIP < d[destIP].getIPlength()):
                    maxIP = d[destIP].getIPlength()

                for key in d:
                    d[key].setMaxIP(maxIP)

                if(maxPackets < d[destIP].getCount()):
                    maxPackets = d[destIP].getCount()

                for key in d:
                    d[destIP].setMaxPackets(maxPackets)

                if(Max < d[destIP].getSize()):           #All the sites need to who has the max length (in bytes), and have this value. I forgot why...
                	Max = d[destIP].getSize()            #I think because in the future we will represent radius as a ratio of the max length. Havent found the right function...
                	for key in d:                        #to do this without making websites with small traffic size extremely small compared to the max. 
                		d[key].setMax(Max)

                if(colorsDic.has_key(destIP) and d[destIP].getRandomColor() == True):
                    print "set color on ", d[destIP].getName()
                    d[destIP].setColor(colorsDic[d[destIP].getName()])
                    d[destIP].setRandomColor()

            except socket.herror as e:    #if socket does not find a host for the given IP.
                pass

    except AttributeError as e:      #If we can't find a destination IP for the packet. Some packets, such as broadcast packets, do not have an IP as a destination
        pass

    ## Start hardcoding colors

    # if len(d) != 0:   #Check if dictionary is not empty, otherwise it will give an error when trying to access it when its empty



    ## Finish hardcoding colors

    #The two if's below are in charge of sending the data. 

    if(int(time.time()) % 11 == 0 and trigger == True):
        #print "Writting to json"
        writeJson(d)
        trigger = False
        
    if(int(time.time()) % 13 == 0):
        trigger = True

    #destIP == ''

def examinePacketDNS(pkt):
    global Max
    try:
        destIP = str(pkt.dns.qry_name)    #strips the destination of the packet (in IP format)
        srcIP = str(pkt.ip.src)     #strips the source of the packet (IP of device)
        traffic = int(pkt.length)   #strips the length of the packet

        if (destIP[0:3] == "146"):  #Filters anything with a 146 address on the first octect (These are hunter's network addresses)
                return

        if not destIP in d:                         #Creates a new instance of the class, adds it to a dictionary (d), and the hostname is the key
            d[destIP] = SiteData(destIP)
            d[destIP].setMax(Max)

        d[destIP].addIP(srcIP)
        d[destIP].incrementCount()
        d[destIP].incrementTraffic(traffic)
        d[destIP].setMax(Max)

        if(Max < d[destIP].getSize()):
            Max = d[destIP].getSize()
            for key in d:
                d[key].setMax(Max)  

        print pkt.dns.qry_name

    except AttributeError as e:
        pass



        # for key in d:
        #     print d[key]
        #     print "total sites seen: ", len(d)
        #     print "-------------------------------------------------------"

    # if(int(time.time()) % 11 == 0 and trigger == True):
    #     #print "Writting to json"
    #     writeJson(d)
    #     trigger = False
        
    # if(int(time.time()) % 13 == 0):
    #     trigger = True

def startCapture():
    capture = pyshark.LiveCapture(interface='en0', only_summaries=False)    #creates a new pyshark object with a specific interface and desired parameters 
    capture.apply_on_packets(examinePacket)                                 #sends every packet to the examinePAcket function above to examine them

def startCaptureDNS():
    capture = pyshark.LiveCapture(interface='en0', display_filter='dns')    #creates a new pyshark object with a specific interface and desired parameters 
    capture.apply_on_packets(examinePacketDNS)       
