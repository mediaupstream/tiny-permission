# Tiny Permission

Manage CRUD permissions using bitmasks. You can store all possible CRUD combinations in 2 bytes (0-15), or one hexidecimal value (0-F)

All CRUD combinations:

```
bits     role

0000     no permissions
0001     create
0010     read
0011     create read
0100     update
0101     create update
0110     read update
0111     create read update
1000     delete
1001     create delete
1010     read delete
1011     create read delete
1100     update delete
1101     create update delete
1110     read update delete
1111     create read update delete
```

Nice!

## Unrealistic Example

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

# API

### Types

```ts
type RoleOption = 'create' | 'read' | 'update' | 'delete'
type InitialRole = number | string | RoleOption
```

### # new Permission(...initialRole: InitialRole[])

Creates an instance of the Permission class

**Arguments**

Accepts any number of arguments of type `InitialRole`

**Returns**

Returns a new Permission instance

**Example**

```ts
const user = new Permission('read', 'update')
user.has('read', 'update') // => true
user.has('create', 'delete') // => false

const admin = new Permission(15)
admin.can('create', 'read', 'update', 'delete') // => true
```

### # add(...role: RoleOption[]): this

Add permission(s) to the Permission instance state

**Returns**

Returns the Permission instance <sup>I</sup>

**Example**

```ts
const user = new Permission()

user.add('create', 'read').has('create') // => true
```

### # remove(...role: RoleOption[]): this

Remove permission(s) from the Permission instance state

**Returns**

Returns the Permission instance <sup>I</sup>

**Example**

```ts
const user = new Permission('create', 'read', 'update')

user.remove('create', 'read')

user.has('create', 'read') // => false
user.has('update') // => true
```

### # has(...role: RoleOption[]): boolean

Check permission(s) on the Permission instance. If you provide multiple arguments they all must be present on the instance permission. see example below

**Returns**

Returns a `boolean` value

**Example**

```ts
const user = new Permission('create', 'read', 'update')

user.has('create', 'read', 'update') // => true
user.has('delete') // => false

// this is false because the user doesn't have delete permission
user.has('create', 'read', 'update', 'delete') // => false
```

### # can(...role: RoleOption[]): boolean

Same as `has`

### # bin(): string

Convert the current permission instance to a binary representation of the permission

**Example**

```ts
const user = new Permission('read', 'update')
user.bin() // => 0110

const admin = new Permission('create', 'read', 'update', 'delete')
admin.bin() // => 1111
```

### # hex(): string

Same as `bin` but converts to `hexidecimal`

**Example**

```ts
const user = new Permission('read', 'update')
user.hex() // => 6

const admin = new Permission('create', 'read', 'update', 'delete')
admin.hex() // => F
```
