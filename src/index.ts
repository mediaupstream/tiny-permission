enum Role {
  create = 0,
  read = 1,
  update = 2,
  delete = 3
}

type RoleOptions = 'create' | 'read' | 'update' | 'delete'

class Permission {
  role: number = 0
  add(r: RoleOptions) {
    this.role = this.role |= 1 << Role[r]
  }
  remove(r: RoleOptions) {
    this.role = this.role &= ~(1 << Role[r])
  }
  has(r: RoleOptions) {
    return (this.role & (1 << Role[r])) > 0
  }
  bin() {
    return this.role.toString(2)
  }
}

export default Permission
