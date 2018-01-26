# uchicago-canvas-file-grabber
Chrome plugin to bulk download course content from Canvas portal

## Plugin download link
https://chrome.google.com/webstore/detail/uc-grabber/dimmeocemhglaadjicpnogdadmkkgpln

 I wrote this Chrome plugin to automate some routine and mundane tasks that all of the students at University of Chicago have to do. I believe this project will be useful for all of uChicago students who use Canvas and/or ilykei.com portal.
 
## The Problem
The problem that I wanted to solve was very simple, both of these websites require students to take some unnecessary steps to download files. For example, to download the lecture materials for a certain week’s module, one has to click on each link and open all the files in their respective tabs and then click the download link for each file.  

![download1](https://i.imgur.com/2Gw91wO.png)

Similarly, for ilykei.com, a user has to go through each link separately to download course material. Also, the html files open in separate tab instead of downloading and downloads have ASCII URL encodings in file names.  

![ilykei](https://i.imgur.com/L6uE4Pu.png)

So, to be able to easily download content from Canvas and/or ilykei.com, I developed an application that can be installed in our browser. Its purpose is to provide easy, one-click workarounds to the above problems that I mentioned. This application can be installed as a chrome extension from the official Google Chrome Web Store.  

## How to use this extension?  
Say for example, if I want to download the course material for Data Mining class, I would go the data mining module page on Canvas, and then click on the extension icon next to the address bar, then click the Process button.  
![example1](https://i.imgur.com/Srjei4b.png)

Parsing might take a few seconds, depending upon the number of modules/files on the page.  
![example2](https://i.imgur.com/MG1qk9x.png)

In a few seconds, user is able to see a list of buttons, clicking on a button would download all the available files for the corresponding module. The downloads are organized in directories named according to the module.  
![example3](https://i.imgur.com/NroKEH9.png)

On ilykei.com, if you navigate to a lecture page and click on the Process button, the extension will put two download links on the lecture page itself.  
![example4](https://i.imgur.com/p9uKcp8.png)

Clicking on the first link would download all the documents in the lecture material. And clicking on the second link would download all the documents in the sidebar.  

