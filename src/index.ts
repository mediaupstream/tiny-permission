/* eslint-disable no-bitwise, no-multi-assign */

type RoleOption = 'create' | 'read' | 'update' | 'delete'

type InitialRole = number | string | RoleOption

const ROLE_MAX = 15

class Permission {
  static Role = {
    create: 0,
    read: 1,
    update: 2,
    delete: 3
  }

  role = 0

  /**
   * Initialize a `Permission` with optional initial permissions
   */
  constructor(...initialRole: InitialRole[]) {
    if (initialRole.length > 1) {
      this.add(...(initialRole as RoleOption[]))
    } else if (initialRole.length === 1) {
      const role = initialRole[0]
      if (!isNaN(role as number) && role <= ROLE_MAX) {
        this.role = Number(initialRole)
      } else {
        // is the value a hex?
        if (/^[a-f]$/i.test(role as string)) {
          this.role = Number(parseInt(role as string, 16))
        } else {
          this.add(role as RoleOption)
        }
      }
    }
  }

  /**
   * Normalize `RoleOption`
   */
  private _normalizeOptions(options: RoleOption[]): RoleOption[] {
    return options.filter(this._isRoleOption)
  }

  /**
   * Check if a string is a valid `RoleOption`
   */
  private _isRoleOption(s: string): boolean {
    return ['create', 'read', 'update', 'delete'].includes(s)
  }

  /**
   * Resets `Permission.role` to the default (no permissions)
   */
  reset(): this {
    this.role = 0
    return this
  }

  /**
   * Add permission(s) to the `Permission.role`
   */
  add(...r: RoleOption[]): this {
    const roles = this._normalizeOptions(r)
    this.role = roles.reduce((role, n) => {
      role |= 1 << Permission.Role[n]
      return role
    }, this.role)
    return this
  }

  /**
   * Remove permission(s) from the `Permission.role`
   */
  remove(...r: RoleOption[]): this {
    const roles = this._normalizeOptions(r)
    this.role = roles.reduce((role, n) => {
      role &= ~(1 << Permission.Role[n])
      return role
    }, this.role)
    return this
  }

  /**
   * Check permission(s) on the `Permission.role`
   */
  has(...r: RoleOption[]): boolean {
    const role = this.role
    if (role === 0) {
      return false
    }
    const roles = this._normalizeOptions(r)
    return roles.every(n => (role & (1 << Permission.Role[n])) > 0)
  }

  /**
   * Alias to `Permission.has`
   */
  can(...r: RoleOption[]): boolean {
    return this.has(...r)
  }

  /**
   * Return a "binary" string representation of the role, eg 1111
   */
  bin(): string {
    return this.role.toString(2)
  }

  /**
   * Return a hexidecimal representation of the role, eg F
   */
  hex(): string {
    return this.role.toString(16).toUpperCase()
  }

  /**
   * Return the role value, eg 15
   */
  toString(): number {
    return this.role
  }

  /**
   * Return `Permission.role` for the class valueOf method
   */
  valueOf(): number {
    return this.role
  }
}

export default Permission
