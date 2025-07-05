// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

// https://dbdiagram.io/d

Table messages {
  id serial [primary key, not null]
  conversation_id varchar(255) [not null]
  type enum('text', 'image', 'audio', 'video', 'sticker', 'document', 'unsupported') [not null]
  text text
  meta_message_id varchar(255) [not null]
  media_url varchar(255)
  meta_media_id varchar(255)
  created_at timestamp [not null]
  update_at timestamp
}

Table contacts {
  id serial [primary key, not null]
  meta_contact_id varchar [not null]
  name varchar(255) [not null]
  created_at timestamp [not null]
  update_at timestamp
}

Table conversations {
  id serial [primary key, not null]
  type enum('subject', 'config') [not null]
  contact_id varchar(255) [not null]
  subject varchar(60)
  status enum('started', 'ongoing', 'finalized') [not null]
  created_at timestamp [not null]
  update_at timestamp
}


Ref: contacts.id < conversations.contact_id
Ref: conversations.id < messages.conversation_id


