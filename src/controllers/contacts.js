import createHttpError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";

export const getContactsController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = "name", sortOrder = "asc", type, isFavourite } = req.query;

    const result = await getAllContacts({
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      type,
      isFavourite,
    });

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body);
    if (!contact) throw createHttpError(404, "Contact not found");
    res.json({
      status: 200,
      message: "Successfully patched a contact!",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);
    if (!contact) throw createHttpError(404, "Contact not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};