![logo](logo2.PNG)

### About CriticalPath

CriticalPath is a project management tool that uses network analysis to help teams handle complex and time-sensitive operations. When getting involved with larger, complex projects there is often significant investment and risk. As risk and complexity increase, so does the difficulty of identifying the relationship between activities and the most efficient course of action. 

CriticalPath is inspired by critical path analysis (CPA) and is a system that allows users to input activity-on-node task networks. A critical path, its length, and slack times will be calculated and displayed. In addition, the system will also execute topological sorting to show the execution sequences of the activities.
 
 ### Critical Path Model
 
 A critical path system constructs a model of the project that includes the following:
 
* A list of all activities required to complete a project
* The duration (hours) to complete an activity
* The dependencies between activities

This information is used to calculate:

* The longest sequence of activities to reach the end of a project (the Critical Path)
* The earliest and latest that each activity can start and finish without making the project longer

The system determines which activities are "critical" (on the longest path) and which have "float" or can be delayed without increasing the time to complete the project. 

The critical path is:

**"The sequence of of project activities which add up to the longest overall duration"**

### Installation

1. Install Ionic

```bash
$ sudo npm install -g ionic cordova
```

2. [Download](https://github.com/Team-Rambutan/CriticalPath) a copy of CriticalPath 

3. Run the App

```bash
$ cd CriticalPath
$ ionic serve
```
