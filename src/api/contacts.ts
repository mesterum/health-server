import express/* , { NextFunction, Request, Response } */ from 'express'
import validate from 'express-zod-safe';
import { contactSchema } from '../models/contacts.js' // 
// import { listContacts, getContactById, removeContact, addContact, updateContact } from '../service/index.js'
// import { Contact } from '../service/schemas/contacts.js';
import { get, getById, create, update, updateStatusContact, remove } from '../controller/index.js'
import { z } from 'zod';
import { auth } from './auth.js';

const router = express.Router()

router.get('/', auth, get)

router.get('/:contactId', validate({ params: { contactId: contactSchema.shape.id } }), auth, getById)

router.post('/', validate({ body: contactSchema.omit({ id: true }) }), auth, create)

router.delete('/:contactId', validate({ params: { contactId: contactSchema.shape.id } }), auth, remove)

router.patch('/:contactId', validate({
  params: { contactId: contactSchema.shape.id },
  body: contactSchema.omit({ id: true }).partial(),
}), auth, update)

router.patch('/:contactId/favorite', validate({
  params: { contactId: contactSchema.shape.id },
  body: { favorite: z.boolean().optional() },
}), auth, updateStatusContact)

export default router
