import Permission from './'

describe('Bitmask Permissions', () => {
  it('Creates a new Permission instance with default (no) permission', () => {
    const p = new Permission()
    expect(+p).toEqual(0)
    expect(p.has('create')).toBe(false)
    expect(p.has('read')).toBe(false)
    expect(p.has('update')).toBe(false)
    expect(p.has('delete')).toBe(false)
  })

  it('Can set the initial role from number', () => {
    const p = new Permission(6)
    expect(p.has('create')).toBe(false)
    expect(p.has('read')).toBe(true)
    expect(p.has('update')).toBe(true)
    expect(p.has('delete')).toBe(false)
  })

  it('Can set the initial role from string', () => {
    const p = new Permission('6')
    expect(p.has('create')).toBe(false)
    expect(p.has('read')).toBe(true)
    expect(p.has('update')).toBe(true)
    expect(p.has('delete')).toBe(false)
  })

  it('Can set the initial role from hex string', () => {
    const p = new Permission('F')
    expect(p.has('create')).toBe(true)
    expect(p.has('read')).toBe(true)
    expect(p.has('update')).toBe(true)
    expect(p.has('delete')).toBe(true)

    const n = new Permission('B')
    expect(n.has('create')).toBe(true)
    expect(n.has('read')).toBe(true)
    expect(n.has('update')).toBe(false)
    expect(n.has('delete')).toBe(true)
  })

  it('Can set the initial role from a RoleOption value', () => {
    const A = new Permission('create')
    expect(A.has('create')).toBe(true)
    expect(A.has('read')).toBe(false)
    expect(A.has('update')).toBe(false)
    expect(A.has('delete')).toBe(false)

    const B = new Permission('read')
    expect(B.has('create')).toBe(false)
    expect(B.has('read')).toBe(true)
    expect(B.has('update')).toBe(false)
    expect(B.has('delete')).toBe(false)

    const C = new Permission('update')
    expect(C.has('create')).toBe(false)
    expect(C.has('read')).toBe(false)
    expect(C.has('update')).toBe(true)
    expect(C.has('delete')).toBe(false)

    const D = new Permission('delete')
    expect(D.has('create')).toBe(false)
    expect(D.has('read')).toBe(false)
    expect(D.has('update')).toBe(false)
    expect(D.has('delete')).toBe(true)
  })

  it('Can set the initial role from multiple RoleOptions', () => {
    const p = new Permission('create', 'read', 'update')
    expect(p.has('create')).toBe(true)
    expect(p.has('read')).toBe(true)
    expect(p.has('update')).toBe(true)
    expect(p.has('delete')).toBe(false)
  })

  it('Can add permissions', () => {
    const roles = ['create', 'read', 'update', 'delete']
    for (const r of roles) {
      const p = new Permission()
      p.add(r)
      expect(p.has(r)).toBe(true)
    }
  })

  it('Can reset permissions', () => {
    const p = new Permission()
    p.add('delete')
    expect(p.has('delete')).toBe(true)

    p.reset()
    expect(p.has('delete')).toBe(false)
    expect(p.role).toBe(0)
  })

  it('Can chain methods', () => {
    const p = new Permission()
    p.add('delete')
      .reset()
      .add('update')
      .add('read')
      .add('create')
      .remove('create')

    expect(p.has('create')).toBe(false)
    expect(p.has('read')).toBe(true)
    expect(p.has('update')).toBe(true)
    expect(p.has('delete')).toBe(false)
  })

  it('Can remove permissions', () => {
    const roles = ['create', 'read', 'update', 'delete']
    for (const r of roles) {
      const p = new Permission()
      p.add('create', 'read', 'update', 'delete').remove(r)
      expect(p.has(r)).toBe(false)
    }
  })

  it('Can represent all possible permission combinations', () => {
    const p = new Permission()

    // 0000 -> no permissions
    expect(p.bin()).toEqual('0')

    // 0001 -> create
    p.add('create')
    expect(p.bin()).toEqual('1')

    // 0011 -> create read
    p.reset().add('create', 'read')
    expect(p.bin()).toEqual('11')

    // 0111 -> create read update
    p.reset().add('create', 'read', 'update')
    expect(p.bin()).toEqual('111')

    // 1111 -> create read update delete
    p.reset().add('create', 'read', 'update', 'delete')
    expect(p.bin()).toEqual('1111')

    // 0010 -> read
    p.reset().add('read')
    expect(p.bin()).toEqual('10')

    // 0110 -> read update
    p.reset().add('read', 'update')
    expect(p.bin()).toEqual('110')

    // 1110 -> read update delete
    p.reset().add('read', 'update', 'delete')
    expect(p.bin()).toEqual('1110')

    // 1010 -> read delete
    p.reset().add('read', 'delete')
    expect(p.bin()).toEqual('1010')

    // 0100 -> update
    p.reset().add('update')
    expect(p.bin()).toEqual('100')

    // 0101 -> create update
    p.reset().add('create', 'update')
    expect(p.bin()).toEqual('101')

    // 1000 -> delete
    p.reset().add('delete')
    expect(p.bin()).toEqual('1000')

    // 1001 -> create delete
    p.reset().add('create', 'delete')
    expect(p.bin()).toEqual('1001')

    // 1011 -> create read delete
    p.reset().add('create', 'read', 'delete')
    expect(p.bin()).toEqual('1011')

    // 1100 -> update delete
    p.reset().add('update', 'delete')
    expect(p.bin()).toEqual('1100')

    // 1101 -> create update delete
    p.reset().add('create', 'update', 'delete')
    expect(p.bin()).toEqual('1101')
  })

  it('can check permissions: No permissions', () => {
    const p = new Permission()
    const roles = ['create', 'read', 'update', 'delete']
    roles.forEach(role => {
      expect(p.has(role)).toBe(false)
      expect(p.can(role)).toBe(false)
    })
  })

  it('can check permissions: Create permissions', () => {
    const p = new Permission()
    const has = 'create'
    p.add(has)
    const roles = ['read', 'update', 'delete']
    roles.forEach(role => expect(p.has(role)).toBe(false))
    expect(p.has(has)).toBe(true)

    p.remove(has)
    roles.forEach(role => expect(p.has(role)).toBe(false))
    expect(p.has(has)).toBe(false)
  })

  it('can return hexidecimal representation of the permission', () => {
    const p = new Permission('create', 'read', 'update', 'delete')
    expect(p.hex()).toEqual('F')

    p.remove('create')
    expect(p.hex()).toEqual('E')

    p.add('create').remove('read')
    expect(p.hex()).toEqual('D')

    p.remove('create')
    expect(p.hex()).toEqual('C')

    p.add('create', 'read').remove('update')
    expect(p.hex()).toEqual('B')

    p.add('delete').remove('create', 'update')
    expect(p.hex()).toEqual('A')
  })
})
