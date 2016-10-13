from sites import *
import threading
import time
from packetAnalyzer import *
from packetAnalyzerFiltered import *
import multiprocessing


def main():  
    #global trigger
    p = multiprocessing.Process(target=startCapture, name="startCapture")
    p2 = multiprocessing.Process(target=startCapture2, name="startCapture") 
    p.start()
    p2.start()
    time.sleep(350)   #Time to run capture

    #time.sleep(2)

    p.terminate()
    p.join()
    p2.terminate()
    p2.join()
    print "Packet pacture terminated"

main()