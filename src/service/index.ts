import { Types } from 'mongoose'
import ContactSchema, { Contact } from './schemas/contact.js'
import { DocumentType } from '@typegoose/typegoose'

export const listContacts = (owner: Types.ObjectId): Promise<Contact[]> =>
  ContactSchema.find({ owner })

export const getContactById = (id: string) =>
  ContactSchema.findOne({ _id: id })

export const addContact = (contact: Omit<Contact, '_id'>) =>
  ContactSchema.create(contact)

export const updateContact = (filter: Pick<DocumentType<Contact>, '_id' | 'owner'>, fields: Partial<Contact>) =>
  ContactSchema.findOneAndUpdate(filter, fields, { new: true })

export const removeContact = (filter: Pick<DocumentType<Contact>, '_id' | 'owner'>) =>
  ContactSchema.findOneAndDelete(filter)

