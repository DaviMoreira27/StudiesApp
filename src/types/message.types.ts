import { IsString, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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

class ImageDTO {
  @IsString()
  mime_type: string;

  @IsString()
  sha256: string;

  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  caption?: string;
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
  type: 'text' | 'image';

  @ValidateNested()
  @IsOptional()
  @Type(() => TextDTO)
  text?: TextDTO;

  @ValidateNested()
  @IsOptional()
  @Type(() => ImageDTO)
  image?: ImageDTO;
}

class ValueDTO {
  @IsString()
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

class ChangeDTO {
  @IsString()
  field: string;

  @ValidateNested()
  @Type(() => ValueDTO)
  value: ValueDTO;
}

class EntryDTO {
  @IsString()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChangeDTO)
  changes: ChangeDTO[];
}

export class WhatsAppWebhookPayloadDTO {
  @IsString()
  object: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDTO)
  entry: EntryDTO[];
}

// WEBHOOK QUERY PARAMS DTO

export class HubWebhookQueryDTO {
  @IsString()
  'hub.mode': string;

  @IsString()
  'hub.challenge': string;

  @IsString()
  'hub.verify_token': string;
}
