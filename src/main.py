from sites import *
import threading
import time
from packetAnalyzer import *
import multiprocessing


def main():
    
    p = multiprocessing.Process(target=startCapture, name="startCapture")
    p.start()

    time.sleep(3)   #Time to run capture

    p.terminate()
    p.join()
    print "Packet pacture terminated"

    #writeJson()


main()