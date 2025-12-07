import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "./comment.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { Product } from "../product/product.entity";
import { paginate } from "nestjs-typeorm-paginate";
import { NotFoundException } from "@nestjs/common";

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

const mockCommentRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

const mockProductRepository = {
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

describe('CommentService', () => {
    let service: CommentService;
    beforeEach(async () => {
        mockCommentRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CommentService,
            {
            provide: getRepositoryToken(Comment),
            useValue: mockCommentRepository,
            },
            {
            provide: getRepositoryToken(Product),
            useValue: mockProductRepository,
            },
        ],
        }).compile();
        service = module.get<CommentService>(CommentService);
        jest.clearAllMocks();
    });


    //find comments for a certain product
    describe('findOneById', () => {
    it('should paginate comments by product ID', async () => {
    (paginate as jest.Mock).mockResolvedValue('PAGINATED_RESULT');

    const result = await service.findByProductId('prod1', 1, 10);

    expect(paginate).toHaveBeenCalledWith(
      mockCommentRepository,
      { page: 1, limit: 10 },
      {
        where: { productId: 'prod1' },
        order: { createdAt: 'DESC' },
        relations: ['user'],
      },
    );

    expect(result).toBe('PAGINATED_RESULT');
    });
    })

    //create a comment
    describe('createComment', () => {
         it('should create a comment if product exists', async () => {
    const dto = { productId: 'p1', content: 'Hello', mark: 5 };
    mockProductRepository.findOne = jest.fn().mockResolvedValue({ id: 'p1' });

    const created = { id: 'c1', ...dto, userId: 'u1' };
    mockCommentRepository.create = jest.fn().mockReturnValue(created);
    mockCommentRepository.save = jest.fn().mockResolvedValue(created);

    const result = await service.create(dto, 'u1');
    expect(result).toEqual(created);

    expect(mockProductRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'p1' },
    });
  });

  it('should throw if product not found on create()', async () => {
    mockProductRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(
      service.create({ productId: 'pX', content: 'test', mark: 5 }, 'u1'),
    ).rejects.toThrow(NotFoundException);
  });

    })

    //delete a comment
    describe('deleteComment', () => {
    it('should delete comment if exists and user owns it', async () => {
    mockCommentRepository.findOne = jest.fn().mockResolvedValue({
      id: 'c1',
      userId: 'owner123',
    });

    mockCommentRepository.delete = jest.fn().mockResolvedValue(null);

    const result = await service.delete('c1', 'owner123');

    expect(mockCommentRepository.delete).toHaveBeenCalledWith('c1');
    expect(result).toEqual({ message: 'Comment deleted successfully' });
  });

  it('should throw if comment not found', async () => {
    mockCommentRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.delete('c404', 'u1')).rejects.toThrow(NotFoundException);
  });

  it('should throw if user is not the owner', async () => {
    mockCommentRepository.findOne = jest.fn().mockResolvedValue({
      id: 'c1',
      userId: 'otherUser',
    });

    await expect(service.delete('c1', 'uX')).rejects.toThrow(NotFoundException);
  });
    })
});
