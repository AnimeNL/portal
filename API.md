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
| `timezone`       | `string` | Timezone indicator as supported by the [moment](https://momentjs.com/timezone/docs/) library. |
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

| Property         | Type       | Description |
| :---             | :---       | :--- |
| `success`        | `boolean`  | Always set to `true` to indicate authentication succeeded. |
| `userToken`      | `string`   | The token that identifies this user. Should be pseudo-anonymous. |
| `authToken`      | `string`   | The token that authenticates this user. Should be pseudo-anonymous. |
| `expirationTime` | `number`   | Time, in milliseconds since the UNIX epoch, at which the session expires. |
| `abilities`      | `string[]` | Abilities that are available for this user. |

The following `abilities` will be recognized: `debug`, `manage-event-info`, `update-avatar-self`,
`update-avatar-all`.

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
| `events`          | `ProgramEvent[]`   | Array with information about the events that will take place. |
| `floors`          | `Floor[]`          | Array with information about the floors available for the event. |
| `internalNotes?`  | `object`           | Object of string => string pairs with notes that should be displayed on the Internals page. |
| `locations`       | `Location[]`       | Array with information about the locations available for the event. |
| `shifts`          | `Shift[]`          | Array with information about the shifts that will take place this event. |
| `volunteerGroups` | `VolunteerGroup[]` | Array with information about the different groups of volunteers. |
| `volunteers`      | `VolunteerInfo[]`  | Array with information for all the event's volunteers. |

##### `Floor` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `id`             | `number`  | Id (number) of the floor. Usually begins with zero. |
| `label`          | `string`  | Label describing the name of the floor. |
| `iconColor`      | `string?` | Color ([CSS value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)) that should be applied to the floor and its icons. |
| `icon`           | `string?` | URL to an SVG definition icon that should be displayed for this floor. Optional. |

##### `Location` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `id`             | `number`  | Id (number) of the location. Must be unique. |
| `floorId`        | `number`  | Id (number) of the floor where this location is. Usually begins with zero. |
| `label`          | `string`  | Label describing the name of the location. |

##### `ProgramEvent` interface

| Property         | Type               | Description |
| :---             | :---               | :--- |
| `id`             | `number`           | Id (number) of the event. Must be unique. |
| `internal`       | `boolean`          | Whether this event is internal to the conference and not publicly announced. |
| `notes`          | `string?`          | _Shift description_ notes associated with this event. May be empty. |
| `sessions`       | `ProgramSession[]` | Array detailing the sessions that are part of this event. |

##### `ProgramSession` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `name`           | `string`  | Name of the event. |
| `description`    | `string?` | Description of the event. |
| `locationId`     | `number`  | Id of the location in which the session will be taking place. |
| `beginTime`      | `number`  | Time, in seconds since the UNIX epoch, at which session begins. |
| `endTime`        | `number`  | Time, in seconds since the UNIX epoch, at which session ends. |

##### `Shift` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `userToken`      | `string`  | The token that identifies the volunteer taking this shift. |
| `type`           | `string`  | The type of shift this entry describes. Must be one of {available, unavailable, event}. |
| `eventId`        | `number?` | Id (number) of the event that describes this shift. |
| `beginTime`      | `number`  | Time, in seconds since the UNIX epoch, at which shift begins. |
| `endTime`        | `number`  | Time, in seconds since the UNIX epoch, at which shift ends. |

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

### /api/upload
Handles data uploads from the portal, for instance uploading a new avatar. Authentication must
happen dilligently on the server side. Must accept `POST` requests.

#### 🡆 POST fields

| Property     | Type     | Description |
| :---         | :---     | :--- |
| `authToken`  | `string` | The token that authenticates this user. Should be pseudo-anonymous. |
| `type`       | `string` | Type of data upload that should occur. |

##### Type: `update-avatar`

| Property           | Type     | Description |
| :---               | :---     | :--- |
| `targetUserToken`  | `string` | The token that identifies the target volunteer. |
| `targetUserAvatar` | `string` | Base64-encoded image data of the avatar that is to be updated. |

#### 🡄 Success response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `true` to indicate that the data upload succeeded. |

#### 🡄 Failure response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `false` to indicate that the data upload failed. |
