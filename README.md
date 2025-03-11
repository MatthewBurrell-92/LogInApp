# Overview

I created this program because I have always thought the process of hashing was interesting. Along side my interest in working with databases, this program was a natural next step.

The software is mostly written in JavaScript. It uses a Node.js server to connect the app with the database. I created two API endpoints to handle the create_new_user feature, and the log_in feature. The database is written in PostgresSQL.

One day, I want to create web apps that allow users to safely and securely write to and query from databases. The Fire Department that I work for would greatly benefit from a system that allows the employees to track their shift hours (right now we use paper. One sheet per employee per shift. It's a lot of paper). With a web app that allows users to log their own hours, that would save time and money. Of course, the information has to be reliable. I don't want just anyone with the link to add data. Thus, I developed this feature, to allow users to log in.

[Software Demo Video](https://youtu.be/vd1WXP5e88s)

# Development Environment

I used Visual Studio Code and the command line to develop this application.

I used several libraries from JavaScript:
* BCrypt for hashing.
* Express for running the app
* Node.js for running the server
  
# Useful Websites

- [W3 Schools SQL Help](https://www.w3schools.com/sql/default.asp)
- [SuperTokens Password Hashing and Salting](https://supertokens.com/blog/password-hashing-salting)

# Future Work

- Include the use of tokens.
- Include a tool for administrators to change the access level of users.
- Create more API endpoints to allow for other features to be implemented.
