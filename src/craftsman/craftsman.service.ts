import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CraftsmanEntity } from './craftsman.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreateCraftsmanDto } from './dto/create-craftsman.dto';
import { auth } from 'src/utils/auth';
// import { CreateCraftsmanDto } from './dto/create-craftsman.dto';

@Injectable()
export class CraftsmanService {
  constructor(
    @InjectRepository(CraftsmanEntity)
    private readonly craftsmanRepository: Repository<CraftsmanEntity>, // Repository TypeORM for CraftsmanEntity
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>, // Repository TypeORM for UserEntity
  ) {}

  // Retrieve all craftsmen with their associated user data
  async findAll(): Promise<CraftsmanEntity[]> {
    return this.craftsmanRepository.find({ relations: ['user'] });
  }

  // Create a new craftsman along with the associated user
  async createCraftsman(craftsmanDto: CreateCraftsmanDto) {
    const user = await auth.api.signUpEmail({
      body: {
        email: craftsmanDto.email,
        password: craftsmanDto.password,
        name: craftsmanDto.name,
        location: craftsmanDto.location,
        image: craftsmanDto.profileImage,
      },
    });

    // Change role to artisan
    const createdUser = await this.userRepo.findOne({
      where: { id: user.user?.id },
    });

    if (!createdUser)
      throw new BadRequestException('User not found after creation');

    createdUser.role = 'artisan';
    await this.userRepo.save(createdUser);

    // Create the Craftsman with the user relation
    try {
      const craftsman = this.craftsmanRepository.create({
        user: createdUser,
        businessName: craftsmanDto.businessName,
        bio: craftsmanDto.bio,
        specialty: craftsmanDto.specialty,
        phone: craftsmanDto.phone,
        workshopAddress: craftsmanDto.workshopAddress,
        deliveryPrice: craftsmanDto.deliveryPrice,
        instagram: craftsmanDto.instagram,
        facebook: craftsmanDto.facebook,
        profileImage: craftsmanDto.profileImage,
      });

      // Save the Craftsman entity
      const savedCraftsman = await this.craftsmanRepository.save(craftsman);
      return savedCraftsman;
    } catch {
      // If craftsman creation fails, rollback user creation
      await this.userRepo.delete({ id: createdUser.id }); // Rollback user creation
      throw new BadRequestException('Craftsman not created');
    }
  }
}
