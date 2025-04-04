import { Posts } from 'src/posts/posts.entities';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }
}
