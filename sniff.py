import pyshark
import time
import socket
import math
from uuid import getnode as get_mac

#
# Netflix = 108.175.42.190

class SiteData:

    def __init__(self, site):
    	self.site = site
    	self.ips = []
        self.why = 0
        #self.trafficLength = 0
        self.timeBucket = {}
        for i in xrange(0,24):
            if i < 10:
                self.timeBucket[" "+str(i)] = 0
            else:
                self.timeBucket[str(i)] = 0
    	self.trafficCount = 0


    def getCount(self):
        return self.trafficCount

    def getIPlength(self):
        return len(self.ips)

    def getIPs(self):
        return self.ips

    def getName(self):
        return self.site

    def incrementCount(self):
    	self.trafficCount += 1

    def incrementTraffic(self, packetLength):
        self.why += packetLength

    def setIP(self, ipstr):
    	if ipstr not in self.ips:
    		self.ips.append(ipstr)

    def fillTime(self):
        x = time.strftime('%H:%M%S %Z on %b %d, %Y')
        x = x[0:2]
        self.timeBucket[x] += 1

    def __str__(self):
        return "site: " + self.site + "   total # of packets: " + str(self.trafficCount) + "      total traffic: " + sizeof_fmt(self.why) + "\nlist of IPs " + str([str(x) for x in self.ips])
    	#return "For site: " + self.site +  "\nlist of IPs " + str([str(x) for x in self.ips])

def sizeof_fmt(num, suffix='B'):
    for unit in ['','K','M','G','T','P','E','Z']:
        if abs(num) < 1000.0:
            return "%3.0f%s%s" % (num, unit, suffix)
        num /= 1000.0
    return "%.0f%s" % (num, suffix)


def main():

    macaddr = hex(get_mac())

    global d
    d = {}
    capture = pyshark.LiveCapture(interface='en0', only_summaries=False)

    def compute(pkt):
        try:
            destIP = str(pkt.ip.dst)
            srcIP = str(pkt.ip.src)
            traffic = int(pkt.length)

            if (destIP[0:3] == "146"):
                    return

            #print str(pkt.mac.src)

            try:
                destIP = socket.gethostbyaddr(destIP)[0]
                
                if not destIP in d:
                    d[destIP] = SiteData(destIP)

                d[destIP].setIP(srcIP)
                d[destIP].incrementCount()
                d[destIP].incrementTraffic(traffic)

            except socket.herror as e:
                pass

        except AttributeError as e:
            pass

        for key in d:
            print d[key]
            print "site count: ", len(d)
            print "-------------------------------------------------------"

    capture.apply_on_packets(compute) #sends every packet to the above compute function to examine them

main()
