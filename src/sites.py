
class SiteData:
    def __init__(self, site):
        self.siteName = site
        self.ips = []
        self.trafficSize = 0
        self.timeBucket = {}                    #Creates an empty dictionary to keep packet count by time
        for i in xrange(0,24):                  #Creates 23 entries on dictionary, each index will be a time
            if i < 10:                             
                self.timeBucket["0"+str(i)] = 0     #from 0 to 9, the time key will have a zero before the number, ie. '05' and not '5'
            else:
                self.timeBucket[str(i)] = 0
        self.trafficCount = 0
        self.jsonD = {}


    def getCount(self):                 #get the total number of packets
        return self.trafficCount

    def getIPlength(self):              #get the total number of local IPs (different devices going to the site)
        return len(self.ips)

    def getIPs(self):                   #get the total number of lcoal IPs (gets the IP of devices going to the site) 
        return self.ips                 #This Data will not be kept. Keeping it now for testing reasons

    def getName(self):                  #get the name of the site. We get name by converting the public IP to a hostname, using python's socket lib
        return self.siteName

    def incrementCount(self):           #Increment packet count for a site
        self.trafficCount += 1

    def incrementTraffic(self, packetLength):   #Increment traffic length for a site
        self.trafficSize += packetLength

    def addIP(self, ipstr):                     #Adds a local IP to the list (device)
        if ipstr not in self.ips:               #checks to make sure the device has not already been added (this may lead to time complexity when problem gets larger)
            self.ips.append(ipstr)

    def fillTime(self):                         #Have not gotten to this yet.
        x = time.strftime('%H:%M%S %Z on %b %d, %Y')
        x = x[0:2]
        self.timeBucket[x] += 1

    def getJSON(self):
        jsonD = {self.siteName: {"totalPackets": self.trafficCount, "trafficLength": sizeof_fmt(self.trafficSize), "timeInterval" : "10 - 11", "IPcount": len(self.ips)}}
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
