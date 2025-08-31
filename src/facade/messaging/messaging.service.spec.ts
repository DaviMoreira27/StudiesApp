import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Messages } from 'src/database/entities/message.entity';
import { Conversations } from 'src/database/entities/conversation.entity';
import { Contacts } from 'src/database/entities/contact.entity';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mockToken') },
        },
        {
          provide: getRepositoryToken(Messages),
          useValue: { find: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Conversations),
          useValue: { find: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Contacts),
          useValue: { find: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
