import { Users } from 'src/users/users.entities';
import { calculatorScore } from 'src/util/calculator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Posts {
  @PrimaryColumn()
  id: string;
  @Column()
  title: string;

  @Column()
  rankScore: number;

  @Column()
  commentCount: number;

  @Column()
  viewCount: number;

  @Column()
  likeCount: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
  user: Users;

  constructor(
    postsId: string,
    title: string,
    createdAt: string,
    viewCount?: number,
    commentCount?: number,
    likeCount?: number,
  ) {
    this.id = postsId;
    this.title = title;

    this.createdAt = new Date(createdAt);
    this.viewCount = viewCount ?? 0;
    this.commentCount = commentCount ?? 0;
    this.likeCount = likeCount ?? 0;
    this.rankScore = calculatorScore(
      this.viewCount,
      this.likeCount,
      this.commentCount,
    );
  }
}
