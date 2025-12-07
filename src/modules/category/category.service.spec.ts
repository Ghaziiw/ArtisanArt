import { getRepositoryToken } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";
import { Test, TestingModule } from "@nestjs/testing";
import { paginate } from "nestjs-typeorm-paginate";
import { BadRequestException, NotFoundException } from "@nestjs/common";

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

const mockQueryBuilder: any = {
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  cache: jest.fn().mockReturnThis(),
  clone: jest.fn().mockReturnThis(),

  getMany: jest.fn(),
  getCount: jest.fn(),
};

const mockCategoryRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

describe('CategoryService', () => {
    let service: CategoryService;
    beforeEach(async () => {
        mockCategoryRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CategoryService,
            {
            provide: getRepositoryToken(Category),
            useValue: mockCategoryRepository,
            },
        ],
        }).compile();
        service = module.get<CategoryService>(CategoryService);
        jest.clearAllMocks();
    });

    //retrieve all categories
    describe('findAll', () => {
    it('should return paginated categories', async () => {
    (paginate as jest.Mock).mockResolvedValue({ items: [], meta: {} });

    const result = await service.findAll(1, 10);

    expect(paginate).toHaveBeenCalledWith(mockCategoryRepository, { page: 1, limit: 10 }, { order: { name: 'ASC' } });
    expect(result).toEqual({ items: [], meta: {} });
  });
})

    //create a category
    describe('create category', () => {
    it('should create a category', async () => {
    const dto = { name: 'New Category' };

    mockCategoryRepository.findOne.mockResolvedValue(null);
    mockCategoryRepository.create.mockReturnValue(dto as any);
    mockCategoryRepository.save.mockResolvedValue({ id: '1', ...dto } as any);

    const result = await service.createCategory(dto);

    expect(result).toEqual({ id: '1', name: 'New Category' });
  });

  it('should throw BadRequest if name already exists', async () => {
    mockCategoryRepository.findOne.mockResolvedValue({ id: '1', name: 'Existing' } as any);

    await expect(service.createCategory({ name: 'Existing' }))
      .rejects
      .toThrow(BadRequestException);
  });
})

    //find a certain category
    describe('findOne', () => {
    it('should return a category by id', async () => {
    const category = { id: 'abc', name: 'Test' };

    mockCategoryRepository.findOne.mockResolvedValue(category as any);

    expect(await service.findOne('abc')).toEqual(category);
  });

  it('should throw NotFound if id does not exist', async () => {
    mockCategoryRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('xyz'))
      .rejects
      .toThrow(NotFoundException);
  });
})

    //update a category
    describe('updateCategory', () => {
    it('should update a category', async () => {
    const existing = { id: '1', name: 'Old' };
    mockCategoryRepository.findOne.mockResolvedValueOnce(existing as any);

    mockCategoryRepository.save.mockImplementation(async (c) => c);

    const result = await service.updateCategory('1', { name: 'Updated' });

    expect(result.name).toBe('Updated');
  });

  it('should throw BadRequest if updated name already exists', async () => {
    mockCategoryRepository.findOne
      .mockResolvedValueOnce({ id: '1', name: 'Old' })
      .mockResolvedValueOnce({ id: '2', name: 'Taken' });

    await expect(service.updateCategory('1', { name: 'Taken' }))
      .rejects
      .toThrow(BadRequestException);
  });
})

    //delete a category
    describe('deleteCategory', () => {
    it('should delete a category', async () => {
    const category = { id: '1', name: 'ToDelete' };

    mockCategoryRepository.findOne.mockResolvedValue(category as any);
    mockCategoryRepository.remove.mockResolvedValue(category as any);

    const result = await service.deleteCategory('1');

    expect(result).toEqual({ message: 'Category deleted successfully' });
  });
})

});