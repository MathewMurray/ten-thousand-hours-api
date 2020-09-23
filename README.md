Welcome to the 
# 10,000 hours project!

This repo includes the back end support for my 10,000 hours application that you can find here:

https://github.com/MathewMurray/ten-thousand-hours (repo link)

https://ten-thousand-hours.vercel.app/ (live application)

This is currently hosted by Heroku!

![Alt text](/screenshots/homepage.png?raw=true "Optional Title")


## what does this API do?
This API acts as middleware for my 10,000 hours database. The API will receive requests(GET,POST,ect) from the client Side application, process the request based on data available from the database and respond to the user's request. When a user posts a new goal, this API takes the request and inserts the goal into the goals table with the user's id. this insures the user can recall this new goal at a later time. the same is true for logs for the user goals. All in all, The API is the neurons connecting the right(client) side of 10,000 hours to the left(database) side. 

## Open Endpoints 
* auth-router -

used to collect a Token from a registered User.

**URL** : `/auth/login`

**Method** : `POST`

**AUTH required**: NO

**Data constraints**
```json
{
   "username":"[valid username]",
   "password":"[password in plain text]"
}
```
**Data example**
```json
{
   "username":"Demo",
   "password":"Demo1234!"
}
```
**Success Response -** 

**Code**: `200 OK`

**Content example**
```
{
   "Token":93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```
**Error Response -**
**condition**: If the username and password combination is wrong.

**Code**: 400 BAD REQUEST

**Content**:
```json
{
   "error":[
   "Incorrect user_name or password"
   ]
}
```
* users-router -

allows for Account creation and pointing the /login endpoint to the correct user page. 

**URL** : `/users`

**Method** : `POST`

**AUTH required**: NO

**Data constraints**
```json
{
   "full_name":"[none]",
   "username":"[none]",
   "password":
         "[8 characters min, 1 uppercase ,1 lowercase ,1 number,1 special character]"
}
```
**Data example**
```json
{
   "full_name":"demo user",
   "username":"Demo",
   "password":"Demo1234!"
}
```
**Success Response -** 

**Code**: `201 Created`

**Content example**
```json
{
    "id": 15,
    "full_name": "test",
    "user_name": "test15",
    "date_created": "2020-09-23T21:33:01.857Z"
}}
```
**Error Response -**
**condition**: If the request is missing the users full name, username and password, or if the password does not meet requirements.

**Code**: 400 BAD REQUEST

**Content**:
```json
{
   "error":[
   "missing ${field} in request body"
   ]
}
```
or
```json
{
   "error":[
      "password must contain 1 uppercase, 1 lowercase,1 number and 1 special character"
   ]
}
```
## Closed Endpoints
* users-router
**Method** : `GET`
**Data constraints**
```json
{
   "Authorization":"[bearer token]",
}
```
**Success response**
**Code** : `200 OK`

*goals-router
**method** : `GET`
**Data constraints**
```json
{
   "Authorization":"[bearer token]",
   "user_id":"[valid user id]"
}
```
**method** : `POST`
**Data constraints**
```json
{
   "Authorization": "[bearer token]",
   "user_id":"[valid user id]",
   "title":"[goal title]",
   "target":"[target hours]"
}
```
*logs-router
**method** : `POST`
**Data constraints**
```json
{
   "Authorization": "[bearer token]",
   "text":"[text for the log]",
   "user_hours":"[hours worked]",
   "goal_id":"[vlid goal id]",
   ""
}


## How was this made?
10,000 hours is brought to you with the help from the following:

   1. HTML
   2. JavaScript
   3. CSS
   4. React
   5. Postgresql
   6. Express