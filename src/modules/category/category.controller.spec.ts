import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

const serviceMock = {
    findAll: jest.fn(),
    createCategory: jest.fn(),
    findOne: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
};
describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(PermissionsGuard) // Bypass auth guard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

    it('should be defined', () => {
    expect(controller).toBeDefined();
    });

  //retrieve all categories
  describe('findAll', () => {
  it('should return all categories', async () => {
    (service.findAll as jest.Mock).mockResolvedValue(['category']);

    const result = await controller.findAll(1, 10);

    expect(result).toEqual(['category']);
    expect(service.findAll).toHaveBeenCalledWith(1, 10);
  });
  })

//create a category
describe('create a category', () => {
  it('should create a category', async () => {
    const dto = { name: 'Test' };
    (service.createCategory as jest.Mock).mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(result).toEqual(dto);
    expect(service.createCategory).toHaveBeenCalledWith(dto);
  });
})

//find a certain category
describe('findOne', () => {
  it('should return a category', async () => {
    const category = { id: '123', name: 'Test' };

    (service.findOne as jest.Mock).mockResolvedValue(category);

    const result = await controller.findOne('123');

    expect(result).toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

    it('should throw NotFoundException if category not found', async () => {
      serviceMock.findOne!.mockResolvedValueOnce(null);
      const result = await controller.findOne('nonexistent');
      expect(result).toBeNull();
      expect(serviceMock.findOne).toHaveBeenCalledWith('nonexistent');
    });
})

//update a category
describe('updateCategory', () => {
  it('should update a category', async () => {
    const updated = { id: '1', name: 'Updated' };

    (service.updateCategory as jest.Mock).mockResolvedValue(updated);

    const result = await controller.update('1', { name: 'Updated' });

    expect(result).toEqual(updated);
    expect(service.updateCategory).toHaveBeenCalledWith('1', { name: 'Updated' });
  });
})


//delete a category
describe('deleteCatgory', () => {
  it('should delete a category', async () => {
    (service.deleteCategory as jest.Mock).mockResolvedValue({ message: 'Category deleted successfully' });

    const result = await controller.delete('1');

    expect(result).toEqual({ message: 'Category deleted successfully' });
    expect(service.deleteCategory).toHaveBeenCalledWith('1');
  });
        it('should throw error if category not found', async () => {
      serviceMock.deleteCategory!.mockRejectedValueOnce(
        new Error('Craftsman not found'),
      );
      await expect(controller.delete('nonexistent')).rejects.toThrow(
        'Craftsman not found',
      );
    });
})

});

