# API Documentation
The volunteer portal requires a number of API calls in order to work properly. They can be provided
by any back-end, as long as the returned data matches the specification below. Data for all API
calls must be returned in JSON.

### /api/environment
Returns information about the volunteer portal environment, enabling it to be customized for a
particular event or group of volunteers. Must accept `GET` requests.

#### 🡄 Success response

| Property         | Type     | Description |
| :---             | :---     | :--- |
| `portalTitle`    | `string` | Title to use for identifying the volunteer portal instance. |
| `seniorTitle`    | `string` | Title to use for senior volunteers, who can provide assistance. |
| `year`           | `number` | Year in which the event will take place. |

#### 🡄 Failure response

_Not applicable. This is a data-only call that must be supported._

### /api/login

Handles user authentication requests in response to someone submitting the login form. Must validate
the input data and return user status when successful. Must accept `POST` requests.

#### 🡆 POST fields

| Property     | Type     | Description |
| :---         | :---     | :--- |
| `email`      | `string` | The e-mail address with which the user is logging in. |
| `accessCode` | `string` | The access code associated with the e-mail address for verification. |


#### 🡄 Success response

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `success`        | `boolean` | Always set to `true` to indicate authentication succeeded. |
| `userToken`      | `string`  | The token that identifies this user. Should be pseudo-anonymous.|
| `authToken`      | `string`  | The token that authenticates this user. Should be pseudo-anonymous. |
| `expirationTime` | `number`  | Time, in milliseconds since the UNIX epoch, at which the session expires.|

#### 🡄 Failure response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `false` to indicate authentication failed. |
