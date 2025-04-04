import { Users } from 'src/users/users.entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryColumn()
  id: string;
  @Column()
  title: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: Users;

  constructor(postsId: string, title: string, createdAt: string) {
    this.id = postsId;
    this.title = title;
    this.createdAt = new Date(createdAt);
  }
}
