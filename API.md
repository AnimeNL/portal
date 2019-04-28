# API Documentation
The volunteer portal requires a number of API calls in order to work properly. They can be provided
by any back-end, as long as the returned data matches the specification below. Data for all API
calls must be returned in JSON. Optional fields must be given, but may be set to `null`.

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
| `userToken`      | `string`  | The token that identifies this user. Should be pseudo-anonymous. |
| `authToken`      | `string`  | The token that authenticates this user. Should be pseudo-anonymous. |
| `expirationTime` | `number`  | Time, in milliseconds since the UNIX epoch, at which the session expires. |
| `enableDebug`    | `boolean` | Setting on whether debug mode should be enabled for this user. |

#### 🡄 Failure response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `false` to indicate authentication failed. |

### /api/event
Returns information about the current event, its volunteers and its sessions. This call is only
available for authenticated users and requires the `authToken` to be included. Must accept `GET`
requests. May be cached offline.

#### 🡆 GET fields

| Property    | Type     | Description |
| :---        | :---     | :--- |
| `authToken` | `string` | The token that authenticates this user. Should be pseudo-anonymous. |

#### 🡄 Success response

| Property          | Type               | Description |
| :---              | :---               | :--- |
| `success`         | `boolean`          | Always set to `true` to indicate that event data is available. |
| `volunteerGroups` | `VolunteerGroup[]` | Array with information about the different groups of volunteers. |
| `volunteers`      | `VolunteerInfo[]`  | Array with information for all the event's volunteers. |

##### `VolunteerGroup` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `groupToken`     | `string`  | The token that identifies this group of volunteers. |
| `primary`        | `boolean` | Whether this group is the primary group of interest to the logged in user. |
| `label`          | `string`  | Label describing the group of volunteers. |

##### `VolunteerInfo` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `userToken`      | `string`  | The token that identifies this volunteer. Should be pseudo-anonymous. |
| `groupToken`     | `string`  | The token that identifies the group this volunteer is part of. |
| `name`           | `string`  | The full name of this volunteer. |
| `avatar`         | `string?` | URL to the avatar that's to be displayed for this volunteer. |
| `title`          | `string`  | Title to be displayed for this volunteer. |
| `accessCode`     | `string?` | Access code of this volunteer. Should be restricted to admins. |
| `telephone`      | `string?` | Telephone number of this volunteer. Should be restricted. |

#### 🡄 Failure response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `false` to indicate that event data is not available. |
