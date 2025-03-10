import { Test, TestingModule } from '@nestjs/testing';
import { WhatssapService } from './whatssap.service';

describe('WhatssapService', () => {
  let service: WhatssapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatssapService],
    }).compile();

    service = module.get<WhatssapService>(WhatssapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
