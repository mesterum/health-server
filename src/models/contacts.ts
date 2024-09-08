/* 
import path from 'node:path';
import fs from 'node:fs/promises';
import { nanoid } from 'nanoid';
// import contactsPath from './db/contacts.json' assert { type: 'json' };
const contactsPath = path.resolve('db', 'contacts.json');
let contacts = null as Contact[] | null;

export async function listContacts() {
  if (contacts === null) {
    const contactsFile = await fs.readFile(contactsPath, 'utf8');
    contacts = JSON.parse(contactsFile) as Contact[];
  }
  return contacts;
}

export async function getContactById(contactId: string) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
}

export async function removeContact(contactId: string) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return false;
  }
  contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return true;
}

export async function addContact({ name, email, phone }: Omit<Contact, 'id'>) {
  const contacts = await listContacts();
  const newContact: Contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function updateContact(contactId: string, contact: Partial<Contact>) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const newContact: Contact = { ...contacts[index], ...contact, id: contactId };
  contacts[index] = newContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}
 */
import { z } from 'zod';

export const contactSchema = z.object({
  id: z.string().length(24).regex(/^[a-fA-F0-9]{24}$/),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export type Contact = z.infer<typeof contactSchema>;