
import random
import time
import math
from math import *


class SiteData:
    def __init__(self, site):
        self.siteName = site
        self.ips = []
        self.trafficSize = 0
        self.firstSeen = time.strftime('%l:%M%p')
        self.lastSeen = 0
        self.timeBucket = {}                    #Creates an empty dictionary to keep packet count by time
        for i in xrange(0,24):                  #Creates 23 entries on dictionary, each index will be a time
            if i < 10:                             
                self.timeBucket["0"+str(i)] = 0     #from 0 to 9, the time key will have a zero before the number, ie. '05' and not '5'
            else:
                self.timeBucket[str(i)] = 0
        self.trafficCount = 0
        self.jsonD = {}
        cc = lambda: random.randint(0,255)
        self.color = ('#%02X%02X%02X' % (cc(),cc(),cc()))
        self.max = 1
        self.rt = 0
        self.ru = 0
        self.rp = 0
        self.randomColor = True
        self.serverIP = ''
        self.lowerbound = 25
        self.upperbound = 125
        self.maxIP = 0
        self.maxPackets = 0
        self.weight = 0

    def setLastSeen(self):
        self.lastSeen = time.strftime('%l:%M%p')

    def getCount(self):                 #get the total number of packets
        return self.trafficCount

    def setMax(self, Max):              
        self.max = Max

    def setMaxIP(self,Max):
        self.maxIP = Max

    def setMaxPackets(self,Max):
        self.maxPackets = Max

    def setServerIP(self,serverIP):
        self.serverIP = serverIP

    def setRT(self, radius):
        self.rt = radius

    def setRU(self, radius):
        self.ru = radius

    def setRP(self, radius):
        self.rp = radius

    def getRT(self):
        return self.rt

    def getRU(self):
        return self.ru

    def getRP(self):
        return self.rp

    def getWeight(self):
        return self.weight

    def setColor(self, color):         #manually set the site's color.
        self.color = color

    def getMax(self):              
        return self.max

    def getRandomColor(self):            #Check if this site had a random color generated 
        return self.randomColor

    def setRandomColor(self):             #Changes to false when a color is set. To indicate it no longer contains a random color
        self.randomColor = False

    def getIPlength(self):              #get the total number of local IPs (different devices going to the site)
        return int(len(self.ips))

    def getSize(self):                 #get the total number of packets
        return self.trafficSize

    def getIPs(self):                   #get the total number of lcoal IPs (gets the IP of devices going to the site) 
        return self.ips                 #This Data will not be kept. Keeping it now for testing reasons

    def getName(self):                  #get the name of the site. We get name by converting the public IP to a hostname, using python's socket lib
        return self.siteName

    def incrementCount(self):           #Increment packet count for a site
        self.trafficCount += 1

    def getCount(self):
        return self.trafficCount

    def incrementTraffic(self, packetLength):   #Increment traffic length for a site
        self.trafficSize += packetLength

    def addIP(self, ipstr):                     #Adds a local IP to the list (device)
        if ipstr not in self.ips:               #checks to make sure the device has not already been added (this may lead to time complexity when problem gets larger)
            self.ips.append(ipstr)

    def fillTime(self):                         #Have not gotten to this yet.
        x = time.strftime('%H:%M%S %Z on %b %d, %Y')
        x = x[0:2]
        self.timeBucket[x] += 1


    def setWeights(self):
        self.rt = (  (self.lowerbound + (self.upperbound - self.lowerbound))*(math.log(1+ self.trafficSize,2)/math.log(1+ self.max,2))  )
        self.ru = (  (self.lowerbound + (self.upperbound - self.lowerbound))*(math.log(1+ len(self.ips),2)/math.log(1+ self.maxIP,2))  )
        self.rp = ( (self.lowerbound + (self.upperbound - self.lowerbound))*(math.log(1+ self.trafficCount,2)/math.log(1+ self.maxPackets,2))  )
        #self.weight = self.rt + self.ru + self.rp

    def getJSON(self):
        jsonD = {"color": self.color, "rt": self.rt, "ru": self.ru,"rp": self.rp, "name": self.siteName, "packets": self.trafficCount, "size": sizeof_fmt(self.trafficSize), "users": len(self.ips), "firstSeen": self.firstSeen, "lastSeen": self.lastSeen, "ServerIP": self.serverIP} 
        return jsonD

    def __str__(self):
        return "site: " + self.siteName + "   total # of packets: " + str(self.trafficCount) +\
        "      total traffic size: " + sizeof_fmt(self.trafficSize) + "\nlist of IPs " + str([str(x) for x in self.ips])


#This function converts bytes to human readeble format. Returns a string of the size
def sizeof_fmt(num, suffix='B'):
        for unit in ['','K','M','G','T','P','E','Z']:
            if abs(num) < 1000.0:
                return "%3.0f%s%s" % (num, unit, suffix)
            num /= 1000.0
        return "%.0f%s" % (num, suffix)
