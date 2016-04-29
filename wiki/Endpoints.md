# Space Location Endpoints

Staging environment application on: https://goonapp-dev.herokuapp.com/  
Production environment application on: https://goonapp.herokuapp.com/


### Display 'Hello World!'
> **GET** /helloworld  

Returns 'Hello World!' if the application is up

#### EXAMPLE:  
Request:  

    GET /helloworld

Response:  

    Hello World!

### User Details
> **GET** https://goonapp.herokuapp.com/user/USER_ID

Returns profile information for a given user, including selected mayorships

#### Parameters
All parameters are optional, unless otherwise indicated.  

| **USER_ID** | Identity of the user to get details for. Required |

#### Response fields
| **user** | A user |

EXAMPLE:  
Request:  

    GET /user/1

Response:  

    {
      "id": 2,
      "username": "test",
      "email": "test@test.com",
      "password": "azerty",
      "citizen": "lyon",
      "age": null,
      "tags": null,
      "createdAt": "2016-04-28T07:36:29.276Z",
      "updatedAt": "2016-04-28T07:36:29.276Z"
    }
