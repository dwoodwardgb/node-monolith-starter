import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

export class Profile {
  @Column({ type: "text" })
  nickname: string;

  // NOTE: this could be a facebook or google id, it's just that regardless we
  // receive our id's through the auth0 integration
  @Index({ unique: true })
  @Column({ type: "text" })
  auth0Id: string;

  @Index({ unique: true })
  @Column({ type: "text" })
  email: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column(() => Profile)
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
