import { IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// WHATSSAP BODY DTO

class MetadataDTO {
  @IsString()
  display_phone_number: string;

  @IsString()
  phone_number_id: string;
}

class ProfileDTO {
  @IsString()
  name: string;
}

class ContactDTO {
  @ValidateNested()
  @Type(() => ProfileDTO)
  profile: ProfileDTO;

  @IsString()
  wa_id: string;
}

class TextDTO {
  @IsString()
  body: string;
}

class MessageDTO {
  @IsString()
  from: string;

  @IsString()
  id: string;

  @IsString()
  timestamp: string;

  @IsString()
  // FIXME: Maybe change it to an ENUM
  type: 'text';

  @ValidateNested()
  @Type(() => TextDTO)
  text: TextDTO;
}

class ValueDTO {
  @IsString()
  // FIXME: Maybe change it to an ENUM
  messaging_product: 'whatsapp';

  @ValidateNested()
  @Type(() => MetadataDTO)
  metadata: MetadataDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDTO)
  contacts: ContactDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages: MessageDTO[];
}

export class WhatsAppWebhookPayloadDTO {
  @IsString()
  field: string;

  @ValidateNested()
  @Type(() => ValueDTO)
  value: ValueDTO;
}

// WEBHOOK QUERY PARAMS DTO

export class HubVerifyTokenDTO {
  @IsString()
  'hub.verify_token': string;
}

export class HubChallengeDTO {
  @IsString()
  'hub.challenge': string;
}

export class HubModeDTO {
  @IsString()
  'hub.mode': string;
}
