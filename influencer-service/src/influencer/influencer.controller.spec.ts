import { Test, TestingModule } from '@nestjs/testing';
import { InfluencerController } from './influencer.controller';
import { InfluencerService } from './influencer.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { FilterInfluencerDto } from './dto/filter-influencer.dto';
import { Influencer } from './entities/influencer.entity';

describe('InfluencerController', () => {
  let controller: InfluencerController;
  let service: InfluencerService;

  beforeEach(async () => {
    const mockInfluencerService = {
      createInfluencer: jest.fn(),
      findAll: jest.fn(),
      findByFilter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfluencerController],
      providers: [
        {
          provide: InfluencerService,
          useValue: mockInfluencerService,
        },
      ],
    }).compile();

    controller = module.get<InfluencerController>(InfluencerController);
    service = module.get<InfluencerService>(InfluencerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new influencer', async () => {
      const createDto: CreateInfluencerDto = {
        firstName: 'John',
        lastName: 'Smith',
        socialMedia: [
          {
            type: 'Instagram',
            username: 'johnsmith',
          },
        ],
      };
      const mockCreatedInfluencer = {
        UId: 1,
        firstName: 'Test',
        lastName: 'User',
        socialMedia: [
          {
            smId: 1,
            type: 'Instagram',
            username: 'testuser',
            influencer: { UId: 1 },
          },
        ],
      };
      jest
        .spyOn(service, 'createInfluencer')
        .mockResolvedValue(mockCreatedInfluencer);
      const result = await controller.create(createDto);
      expect(result).toEqual({
        ...mockCreatedInfluencer,
      });
      expect(service.createInfluencer).toHaveBeenCalledWith(createDto);
    });
  });

  describe('find', () => {
    const Influencers: Influencer[] = [
      {
        UId: 1,
        firstName: 'Max',
        lastName: 'Mustermann',
        socialMedia: [],
      },
      {
        UId: 2,
        firstName: 'Ad',
        lastName: 'Cash',
        socialMedia: [],
      },
    ];
    it('should return all influencers when no filters provided', async () => {
      const emptyFilter: FilterInfluencerDto = {};
      const expectedResult = Influencers;
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);
      const result = await controller.find(emptyFilter);
      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findByFilter).not.toHaveBeenCalled();
    });

    it('should filter influencers when filters are provided', async () => {
      const filters: FilterInfluencerDto = {
        firstName: 'Max',
        lastName: 'Muster',
      };
      const expectedResult = [Influencers[0]];
      jest.spyOn(service, 'findByFilter').mockResolvedValue(expectedResult);
      const result = await controller.find(filters);
      expect(result).toBe(expectedResult);
      expect(service.findByFilter).toHaveBeenCalledWith(filters);
      expect(service.findAll).not.toHaveBeenCalled();
    });
  });
});
