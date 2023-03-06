import { UpdateUserDTO } from '@/dtos/update.user.dto';
import { CreateUserDto } from '@/dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserByAddress(address: string): Promise<User> {
    if (isEmpty(address)) throw new HttpException(400, 'address is empty');

    const findUser: User = await this.users.findOne({ address });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    let findUser: User = await this.users.findOne({ address: userData.address });
    if (!findUser) {
      findUser = await this.users.create(userData);
    }
    return findUser;
  }

  public async updateUser(address: string, updateData: UpdateUserDTO): Promise<User> {
    if (isEmpty(updateData)) throw new HttpException(400, 'updateData is empty');
    const updateUser: User = await this.users.findOneAndUpdate({ address }, updateData);
    return updateUser;
  }
}
export default UserService;
