The user storage is set up as following:
const user = {
    uName: uName.toLowerCase(),
    name: name,
    mail: mail.toLowerCase(), 
    hash: undefined,
    salt: undefined,
}

**signup Status codes and messages:**

    status : 400,
    message : "Invalid uName"
    Username is not only defined by the scope of regex wordcharacters 

    status: 400,
    message: "uName is already taken"
    Username is not available

    status : 400,
    message : "Invalid email address"
    The email is incorrectly formatted

    status : 400,
    message : "Mail is already taken"
    The email is alredy in use

    status: 400,
    message: "Name is too short"
    The name is 1 character or not filled in

    status : 400,
    message : 'Invalid password'
    The password does not direct to the criteria of being 8 characters long and containing atleast one symbol

    status : 403,
    message : "Invalid password attempt"
    The password used is an attempt to get behind the defences of a SQL or any type of SQ database

**login Status codes and messages:**

    status : 401, 
    message : "User unauthorized"
    User provided *wrong* password

    status : 200,
    message : "User authenticated"
    User provided the *correct* password   

    status : 400,
    message : "User not found"
    User could not be found in the database