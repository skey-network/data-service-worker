import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'suppliers' })
export class Supplier {
  @ObjectIdColumn()
  id: ObjectID

  @Column({ nullable: false, unique: true, type: 'string' })
  address: string

  @Column({ type: 'string' })
  name?: string

  @Column({ type: 'string' })
  description?: string

  @Column({ type: 'array' })
  keyWhitelist: string[]
}
