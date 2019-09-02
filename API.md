# API Documentation
The volunteer portal requires a number of API calls in order to work properly. They can be provided
by any back-end, as long as the returned data matches the specification below. Data for all API
calls must be returned in JSON. Optional fields must be given, but may be set to `null`.

### /api/content
Returns static content that can be rendered on the registration application.

| Property         | Type            | Description |
| :---             | :---            | :--- |
| `lastUpdate`     | `number`        | Time, in milliseconds since the UNIX epoch, at which the content was last updated. |
| `pages`          | `ContentPage[]` | Pages of content that should be available on the portal. |

Implementations **must** provide pages for the following two URLs:

| URL    | Description |
| :---   | :---  |
| `/`    | Home page of the portal, will be displayed by default. |
| `/404` | Error page to be displayed when a non-existent page has been requested. |

##### `ContentPage` interface

| Property     | Type     | Description |
| :---         | :---     | :--- |
| `url`        | `string` | URL of the page, relative to the application's base. |
| `content`    | `string` | Content of the page. May contain markdown content. |

### /api/environment
Returns information about the volunteer portal environment, enabling it to be customized for a
particular event or group of volunteers. Must accept `GET` requests.

#### 🡄 Success response

| Property         | Type     | Description |
| :---             | :---     | :--- |
| `eventName`      | `string` | Name of the event that this portal exists for. |
| `portalTitle`    | `string` | Title to use for identifying the volunteer portal instance. |
| `seniorTitle`    | `string` | Title to use for senior volunteers, who can provide assistance. |
| `timezone`       | `string` | Timezone indicator as supported by the [moment](https://momentjs.com/timezone/docs/) library. |
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

The following `abilities` will be recognized: `debug`, `manage-event-info`, `root`,
`update-avatar-self`, `update-avatar-all`, `view-confidential-logbook-entries`.

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
| `version`         | `string`           | Version code associated with this version of the event data. |
| `volunteerGroups` | `VolunteerGroup[]` | Array with information about the different groups of volunteers. |
| `volunteers`      | `VolunteerInfo[]`  | Array with information for all the event's volunteers. |
| `logbook`         | `LogbookEntry[]`   | Array with logbook entries recorded by volunteers at the event. |

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

##### `LogbookEntry` interface

| Property         | Type      | Description |
| :---             | :---      | :--- |
| `entryID`        | `number`  | Id (number) of the logbook entry. Must be unique. |
| `entryTime`      | `number`  | Time, in seconds since the UNIX epoch, at which the entry was recorded. |
| `message`        | `strings` | The message for a logbook entry. |
| `confidential`   | `boolean` | Whether an entry is marked as confidential. (Note that the server should filter out entries the user doesn't have access to.) |
| `photo`          | `string?` | URL to the photo that has been attached to the entry, or `null` if none was added. |

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

| Property          | Type      | Description |
| :---              | :---      | :--- |
| `userToken`       | `string`  | The token that identifies this volunteer. Should be pseudo-anonymous. |
| `groupToken`      | `string`  | The token that identifies the group this volunteer is part of. |
| `name`            | `string`  | The full name of this volunteer. |
| `avatar`          | `string?` | URL to the avatar that's to be displayed for this volunteer. |
| `title`           | `string`  | Title to be displayed for this volunteer. |
| `accessCode`      | `string?` | Access code of this volunteer. Should be restricted to admins. |
| `telephone`       | `string?` | Telephone number of this volunteer. Should be restricted. |
| `lastLogbookRead` | `number?` | Time, in seconds since the UNIX epoch, of the last logbook entry the user has read. |

#### 🡄 Failure response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `false` to indicate that event data is not available. |

### /api/registration
Handles volunteer registration from the Registration application. Must accept `POST` requests.

#### 🡆 POST fields

| Property           | Type      | Description |
| :---               | :---      | :--- |
| `firstName`        | `string`  | The volunteer's first name. |
| `lastName`         | `string`  | The volunteer's last name. |
| `emailAddress`     | `string`  | The volunteer's e-mail address. |
| `telephoneNumber`  | `string`  | The volunteer's phone number. Format unspecified. |
| `dateOfBirth`      | `string`  | The volunteer's date of birth. YYYY-MM-DD. |
| `fullAvailability` | `boolean` | Whether the volunteer is available for the full event. |
| `nightShifts`      | `boolean` | Whether the volunteer is willing to run night shifts. |
| `socialMedia`      | `boolean` | Whether the volunteer wants to be included on social media. |
| `dataProcessing`   | `boolean` | Whether the volunteer agrees with data processing guidelines. |

#### 🡄 Success response

| Property         | Type       | Description |
| :---             | :---       | :--- |
| `success`        | `boolean`  | Always set to `true` to indicate registration succeeded. |
| `accessCode`     | `number`   | The access code with which they can identify themselves. |

#### 🡄 Failure response

| Property         | Type       | Description |
| :---             | :---       | :--- |
| `success`        | `boolean`  | Always set to `false` to indicate registration failed. |
| `message`        | `string`   | Message that's to be displayed to the user about the failure. |


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

##### Type: `update-event`

| Property    | Type      | Description |
| :---        | :---      | :--- |
| `eventId`   | `number`  | Id (number) of the event. |
| `notes`     | `string?` | Updated notes for the event, if any. |

##### Type: `logbook-entry`

| Property       | Type      | Description |
| :---           | :---      | :--- |
| `message`      | `string`  | The message to record in the logbook. |
| `confidential` | `boolean` | Whether this item is marked as confidential. |
| `photo`        | `string?` | Base64-encoded image data of the photo to be uploaded, or `null` if no photo is added. |

##### Type: `logbook-read`

| Property    | Type      | Description |
| :---        | :---      | :--- |
| `entryTime` | `number`  | Time, in seconds since the UNIX epoch, of the last logbook item the user has read. |

#### 🡄 Success response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `true` to indicate that the data upload succeeded. |

#### 🡄 Failure response

| Property  | Type      | Description |
| :---      | :---      | :--- |
| `success` | `boolean` | Always set to `false` to indicate that the data upload failed. |
