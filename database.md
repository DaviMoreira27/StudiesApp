// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

// https://dbdiagram.io/d

Table messages {
  id serial [primary key, not null]
  meta_message_id varchar(255) [not null]
  contact_id varchar(255) [not null]
  type enum('text', 'image', 'audio', 'video', 'sticker', 'document', 'unsupported') [not null]
  text text
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


Ref: contacts.id < messages.contact_id

