import Permission from './'

describe('Bitmask Permissions', () => {
  it('Creates a new Permission instance', () => {
    const p = new Permission()
    expect(p.role).toEqual(0)
  })
})
