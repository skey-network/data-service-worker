import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'keys' })
export class Key {
  @ObjectIdColumn()
  id: ObjectID

  @Column({ type: 'string', nullable: false })
  name: string

  @Column({ type: 'string', nullable: false })
  device: string

  @Column({ type: 'string', nullable: false })
  owner: string

  @Column({ type: 'string', nullable: false })
  issuer: string

  @Column({ type: 'number', nullable: false })
  validTo: number

  @Column({ type: 'number', nullable: false })
  issueTimestamp: number

  @Column({ type: 'boolean', nullable: false })
  active: boolean
}
