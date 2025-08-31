import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessagingService } from 'src/facade/messaging/messaging.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Messages } from 'src/database/entities/message.entity';
import { Conversations } from 'src/database/entities/conversation.entity';
import { Contacts } from 'src/database/entities/contact.entity';

describe('MessageController', () => {
  let controller: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessagingService,
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('mockToken') } },
        { provide: getRepositoryToken(Messages), useValue: {} },
        { provide: getRepositoryToken(Conversations), useValue: {} },
        { provide: getRepositoryToken(Contacts), useValue: {} },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
