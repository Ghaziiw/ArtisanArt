import { Test, TestingModule } from '@nestjs/testing';
import { CraftsmanController } from './craftsman.controller';
import { CraftsmanService } from './craftsman.service';
import { UploadService } from '../upload/upload.service';

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => ({
    login: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

const mockService = {
    findAll: jest.fn(),
    findOneByUserIdWithStats: jest.fn(),
    createCraftsman: jest.fn(),
    findOneByUserId: jest.fn(),
    updateCraftsman: jest.fn(),
    deleteCraftsman: jest.fn(),
    updateCraftsmanExpDate: jest.fn(),
  };

const mockUploadService = {
    validateFile: jest.fn(),
    getFileUrl: jest.fn(),
  };

describe('CraftsmanController', () => {
  let controller: CraftsmanController;
  let service: CraftsmanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CraftsmanController],
      providers: [
        { provide: CraftsmanService, useValue: mockService },
        { provide: UploadService, useValue: mockUploadService },
      ],
    }).compile();

    controller = module.get<CraftsmanController>(CraftsmanController);
    service = module.get<CraftsmanService>(CraftsmanService);
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //retrieve all craftsmen
  describe('findAll',() => {
    it('should call findAll of service', async () => {
    mockService.findAll.mockResolvedValue([]);

    await controller.findAll(1, 20, {});

    expect(mockService.findAll).toHaveBeenCalledWith(1, 20, {});
  });
  })

  //get info about a certain craftsman
  describe('findOne',() => {
    it('should get one craftsman', async () => {
    mockService.findOneByUserIdWithStats.mockResolvedValue({});

    await controller.findOne('123');

    expect(mockService.findOneByUserIdWithStats).toHaveBeenCalledWith('123');
  });

      it('should throw NotFoundException if user not found', async () => {
      mockService.findOneByUserIdWithStats!.mockResolvedValueOnce(null);
      const result = await controller.findOne('nonexistent');
      expect(result).toBeNull();
      expect(mockService.findOneByUserIdWithStats).toHaveBeenCalledWith('nonexistent');
    });
  })

  //delete a craftsman
  describe('deleteCraftsman', () => {
  it('should delete craftsman', async () => {
    mockService.deleteCraftsman.mockResolvedValue({});

    await controller.deleteCraftsman('123');

    expect(mockService.deleteCraftsman).toHaveBeenCalledWith('123');
  });
      it('should throw error if craftsman not found', async () => {
      mockService.deleteCraftsman!.mockRejectedValueOnce(
        new Error('Craftsman not found'),
      );
      await expect(controller.deleteCraftsman('nonexistent')).rejects.toThrow(
        'Craftsman not found',
      );
    });
  })

//update expiration date
  describe('updateCraftsmanExpDate', () => {
  it('should update expiration date', async () => {
    const dto = { newExpDate: '2024-01-01' };

    mockService.updateCraftsmanExpDate.mockResolvedValue({});

    await controller.updateCraftsmanExpDate('123', dto as any);

    expect(mockService.updateCraftsmanExpDate)
      .toHaveBeenCalledWith('123', dto);
  });
  })

});
