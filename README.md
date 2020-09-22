Welcome to the 
# 10,000 hours project!

This repo includes the back end support for my 10,000 hours application that you can find here:

https://github.com/MathewMurray/ten-thousand-hours (repo link)

https://ten-thousand-hours.vercel.app/ (live application)

This is currently hosted by Heroku!

[Alt text](/screenshots/homepage.png?raw=true "Optional Title")
## API Service files - 
### auth-service.js:
[Alt text](/screenshots/login.png?raw=true "Optional Title")
this endpoint gives authentication functionality to my back end. It gets the username based on what the user puts in the login field of the front end, compares the password entered to what is stored in the database and grants access with a Authentication token if the credentials match.

### goals-service:
[Alt text](/screenshots/userpage.png?raw=true "Optional Title")
this endpoint gives the user access to their specific goals stored on the database.

### logs-service:
[Alt text](/screenshots/goalpage.png?raw=true "Optional Title")
The Logs endpoint allows the user to access their posted logs for each goal, as well as post new ones to be stored into the database.

### users-service:
[Alt text](/screenshots/register.png?raw=true "Optional Title")
The user-service goes hand in hand with the auth-service endpoint. this endpoint allows for creating new users for my application as well as validating that their password meets the level of security I've set for their password.(1 uppercase letter, 1 lowercase letter, 1 number and 1 special character). It also hashes their password for safe storage in the database I've created for future login's. 

## what does this API do?
This API acts as middleware for my 10,000 hours database. The API will receive requests(GET,POST,ect) from the client Side application, process the request based on data available from the database and respond to the user's request. When a user posts a new goal, this API takes the request and inserts the goal into the goals table with the user's id. this insures the user can recall this new goal at a later time. the same is true for logs for the user goals. All in all, The API is the nurons connection the right(client) side of 10,000 hours to the left(database) side. 

## How was this made?
10,000 hours is brought to you with the help from the following:

   1. HTML
   2. JavaScript
   3. CSS
   4. React
   5. Postgresql
   6. Express