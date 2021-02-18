# Tiny Permission

There are 16 possible combinations of CRUD (Create, Read, Update, Delete) (4\*4) and 8 bits per byte, so we can store all possible CRUD combinations in 16 bits! :smile:

All possible permission combinations:

| bit  | role                      |
| ---- | ------------------------- |
| 0000 | no permissions            |
| 0001 | create                    |
| 0010 | read                      |
| 0011 | create read               |
| 0100 | update                    |
| 0101 | create update             |
| 0110 | read update               |
| 0111 | create read update        |
| 1000 | delete                    |
| 1001 | create delete             |
| 1010 | read delete               |
| 1011 | create read delete        |
| 1100 | update delete             |
| 1101 | create update delete      |
| 1110 | read update delete        |
| 1111 | create read update delete |

This is cool because we can use the integer value 0-15, or the hexidecimal 0-F to store permissions.

## Example

Imagine you need to track permissions for a set of resources:

```ts
import Permission from 'bitmask-permission'

const resources = {
  project: new Permission('create', 'read', 'update', 'delete'),
  analytics: new Permission('read'),
  users: new Permission('read', 'update'),
  clientArea: new Permission()
}

resources.project.has('read', 'delete') // => true
resources.project.hex() // => F

resources.project.remove('create').has('create') // => false

resources.project.reset().hex() // => 0
```

## API

# new Permission(...initialRole: InitialRole[])

Creates an instance of the Permission class. The constructor accepts optional arguments to set the initial state.

where `InitialRole` can be any of `string | number | RoleOption`

**Returns**

Returns the new Permission instance

**Example**

```ts
const user = new Permission('read', 'update')
user.has('read', 'update') // => true
user.has('create', 'delete') // => false

const admin = new Permission(15)
admin.can('create', 'read', 'update', 'delete') // => true
```

---

# add(...role: RoleOption[]): this

description

**Returns**

description

**Example**

```ts
// example code
```

---
