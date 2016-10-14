from sites import *
import threading
import time
from packetAnalyzer import *
from packetAnalyzerFiltered import *
import multiprocessing


def main():  
    global trigger
    #p = multiprocessing.Process(target=startCapture, name="startCapture")
    p = multiprocessing.Process(target=startCapture, name="startCapture") 
    p.start()
    time.sleep(1200)   #Time to run capture

    #time.sleep(2)

    p.terminate()
    p.join()
    print "Packet pacture terminated"

main()