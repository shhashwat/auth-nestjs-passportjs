import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  username: string;
  password: string;
}

//todo: This is a mockup data replace this with real db 
const users: User[] = [
    {userId: 1, username: 'john', password: 'changeme' },
    {userId: 2, username: 'maria', password: 'guess' },
    {userId: 3, username: 'bob', password: 'password' }
]

@Injectable()
export class UsersService {
  async findUserByName(username: string): Promise<User | undefined> {
    return users.find(user => user.username === username);
  }
}
