# Calculator App
This is a calculator app built using React.js and TypeScript (using no other third-party libraries). 
The app can be found here: https://650e3e80fb627700088e0624--sparkly-selkie-487e61.netlify.app/
<img width="705" alt="Screenshot 2023-09-22 at 6 48 54 PM" src="https://github.com/dianna-SE/calculator-app/assets/97206862/08993a53-a85d-4453-9fda-c381ea5d73f9">


## Table of Contents

- [Calculator](#Calculator)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Development Overview](#features)
  - [Acknowledgments](#acknowledgments)


## Installation
1. Simply open your IDE and in the terminal and run:
```npm start```

## Development Overview

The development for this app is structured into several components:

###Objective
The main objective is to develop a calculator app that focuses on keyboard accessibility. There were several things that were to be considered, especially how the accessibility should be coded so that it is simple and functions properly.

###Functionalities
Several functionalities were implemented, along with additional functionalities I felt many people might like to use. These functionalities include:
* addition
* subtraction
* multiplication
* division
* exponentiation
* modulo
* radical
* other misc, functionalities include displaying a history feature and a plus/minus function.

###Planning
First, I sketched a rough design of how the calculator should look, along with the buttons that are laid out. Design is arguably one of the primal features of accessibility. Accessibility comes with being able to use the application with little to no learning curve and is inviting for any and all users. The design should look very simple and clean, essentially a good user interface.

Next, I broke down each task into steps. This involves implementing the functionalities, and later the keyboard and mouse features. Since the keyboard feature is emphasized the most for this project, I had to be careful with handling this feature and ensure that any potential outcomes were handled accordingly.

After the functionalities are almost complete, testing becomes the forefront of the process. I encountered many different unique cases that I would not have thought of as I implemented the features, and so these features had to be adjusted and handled accordingly. Error handling and debugging were crucial in problem identification, problem-solving, and conflict resolution.
  
###Testing & Error Handling
Testing involves many different test cases. This involves testing each unique case, such as if a user enters operations in multiple successions, or if expressions are calculated through different arithmetic operations in a row.

Testing involves debugging using Chrome DevTools to monitor the output displayed using the console.log(). This is used to observe the activity through key presses or clicks. Status checks are spread out throughout the code in order for the user or developer to observe the event when an action is triggered.

Another debugging method used is observing React's runtime error. As I am more familiar with JavaScript than TypeScript, this is particularly useful in observing the different issues that occur with pieces of code. This is also used to monitor mistakes with code syntax, variables, types, etc.

###Structure & Modularization
Developing an application can become very complex. I have tried my best to modularize pieces of code with different features and functionalities so that the code is easier to read. Comments are displayed throughout the code to help assist with understanding what each block of code is doing.

As I developed more features for the calculator, I took into consideration different versions. Because of this, each was separated into different branches. Eventually, once the calculator was complete, it was ready to be merged into the main branch for official deployment.

###Deployment
Several deployment platforms were considered before I ultimately chose Netlify. I have deployed websites in different platforms and I found that Netlify was by far one of the simplest platforms to deploy a website from. As this is a simple calculator application, I felt it optimal to deploy it here.

Moreover, Netlify integrates Git repositories through GitHub well. As I deploy the calculator application, Netlify shows the complete deployment process along with identifying issues that can prevent full deployment.


## Acknowledgements
