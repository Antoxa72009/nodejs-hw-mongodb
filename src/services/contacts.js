import { Contact } from "../models/contact.js";

export const getAllContacts = async (options = {}) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite,
  } = options;

  const filter = {};
  if (type) filter.contactType = type;
  if (typeof isFavourite !== "undefined") filter.isFavourite = isFavourite === "true";

  const skip = (page - 1) * perPage;
  const sort = {};
  if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(perPage))
      .select("-__v")
      .lean(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage) || 1;

  return {
    data,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage: Number(page) > 1,
    hasNextPage: Number(page) < totalPages,
  };
};

export const getContactById = async (id) => {
  return await Contact.findById(id).select("-__v");
};

export const createContact = async (data) => {
  const doc = await Contact.create(data);
  return doc.toObject({ versionKey: false }); // remove __v in returned object
};

export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-__v");
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};