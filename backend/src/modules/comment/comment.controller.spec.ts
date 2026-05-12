import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { AuthUser } from 'src/auth/types/auth-user';


jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

const mockService = {
    findAll: jest.fn(),
    findByProductId: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        { provide: CommentService, useValue: mockService },
      ],
    })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

    it('should be defined', () => {
    expect(controller).toBeDefined();
    });

  //retrieve all comments 
  describe('findAll', () => {
    it('should return all comments', async () => {
    mockService.findAll.mockResolvedValue(['c1', 'c2']);

    const result = await controller.getAllComments();
    expect(result).toEqual(['c1', 'c2']);
    expect(service.findAll).toHaveBeenCalled();
  });
  })
  

  //return comments given a certain product
  describe('findByProductId', () => {
  it('should return comments by product ID', async () => {
    mockService.findByProductId.mockResolvedValue('PAGINATED');

    const result = await controller.getCommentsByProductId('p1', 1, 10);

    expect(service.findByProductId).toHaveBeenCalledWith('p1', 1, 10);
    expect(result).toBe('PAGINATED');
  });
  })

  //create a comment
  describe('createComment', () => {
  it('should create a comment', async () => {
    const dto = { productId: 'p1', content: 'hello', mark: 5 };
    const user : AuthUser= { id: 'u1', email: 'a@a', role: 'client' };

    mockService.create.mockResolvedValue({ id: 'c1', ...dto });

    const result = await controller.createComment(user, dto);

    expect(service.create).toHaveBeenCalledWith(dto, 'u1');
    expect(result).toEqual({ id: 'c1', ...dto });
  });
  })

//delete a comment
  describe('deleteComment', () => {
  it('should delete a comment', async () => {
    mockService.delete.mockResolvedValue({ message: 'Deleted' });

    const user: AuthUser = { id: 'u1', email: 'a@a', role: 'client' };

    const result = await controller.deleteComment('c1', user);

    expect(service.delete).toHaveBeenCalledWith('c1', 'u1');
    expect(result).toEqual({ message: 'Deleted' });
  });
          it('should throw error if category not found', async () => {
            const user: AuthUser = { id: 'u1', email: 'a@a', role: 'client' };
             mockService.delete!.mockRejectedValueOnce(
            new Error('Comment not found'),
         );
      await expect(controller.deleteComment('nonexistent', user)).rejects.toThrow(
        'Comment not found',
      );
    });
  })
});

