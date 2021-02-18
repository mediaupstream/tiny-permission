# Tiny Permission

Manage CRUD permissions using bitmasks. You can store all possible CRUD combinations in 2 bytes (0-15), or one hexidecimal value (0-F)

All CRUD combinations:

```
bytes  int  hex  role

0000   0    0    no permissions
0001   1    1    create
0010   2    2    read
0011   3    3    create read
0100   4    4    update
0101   5    5    create update
0110   6    6    read update
0111   7    7    create read update
1000   8    8    delete
1001   9    9    create delete
1010   10   A    read delete
1011   11   B    create read delete
1100   12   C    update delete
1101   13   D    create update delete
1110   14   E    read update delete
1111   15   F    create read update delete
```

## Example

Imagine you want to track a users permissions for a set of resources:

```ts
import Permission from 'tiny-permission'

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

- [constructor](#-new-permissioninitialrole-initialrole)
- [add](#-permissionaddrole-roleoption-this)
- [remove](#-permissionremoverole-roleoption-this#-permissionaddrole-roleoption-this)
- [reset](#-permissionreset-this)
- [has](#-permissionhasrole-roleoption-boolean)
- [can](#-permissioncanrole-roleoption-boolean)
- [bin](#-permissionbin-string)
- [hex](#-permissionhex-string)

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

### # Permission.add(...role: RoleOption[]): this

Add permission(s) to the Permission instance state

**Returns**

Returns the Permission instance <sup>1</sup>

**Example**

```ts
const user = new Permission()

user.add('create', 'read').has('create') // => true
```

### # Permission.remove(...role: RoleOption[]): this

Remove permission(s) from the Permission instance state

**Returns**

Returns the Permission instance <sup>1</sup>

**Example**

```ts
const user = new Permission('create', 'read', 'update')

user.remove('create', 'read')

user.has('create', 'read') // => false
user.has('update') // => true
```

### # Permission.reset(): this

Remove all permission from the Permission instance

**Returns**

Returns the Permission instance <sup>1</sup>

**Example**

```ts
const user = new Permission('create', 'read', 'update')

user.reset().has('create', 'read', 'update') // => false
```

### # Permission.has(...role: RoleOption[]): boolean

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

### # Permission.can(...role: RoleOption[]): boolean

Same as `Permission.has`

### # Permission.bin(): string

Convert the current permission instance to a binary representation of the permission

**Example**

```ts
const user = new Permission('read', 'update')
user.bin() // => 0110

const admin = new Permission('create', 'read', 'update', 'delete')
admin.bin() // => 1111
```

### # Permission.hex(): string

Same as `Permission.bin` but converts to `hexidecimal`

**Example**

```ts
const user = new Permission('read', 'update')
user.hex() // => 6

const admin = new Permission('create', 'read', 'update', 'delete')
admin.hex() // => F
```

## Additional Notes

If you cast a `Permission` instance to string you will get the integer value of the role, so a value of 0-15 depending on the permissions set in that instance.

**Example**:

```ts
const user = new Permission()
String(user) // => 0

user.add('create', 'read', 'update', 'delete')
String(user) // => 15

JSON.stringify({ user }) // => '{"user":15}'
```

## Types

```ts
type RoleOption = 'create' | 'read' | 'update' | 'delete'
type InitialRole = number | string | RoleOption
```

## Footnotes

<sup>1</sup> chainable methods: add, remove, reset
