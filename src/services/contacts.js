import { Contact } from "../models/contact.js";

export const getAllContacts = async (options = {}) => {
  const {
    userId,
    page = 1,
    perPage = 10,
    sortBy = "name",
    sortOrder = "asc",
    type,
    isFavourite,
  } = options;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (typeof isFavourite !== "undefined") {
    filter.isFavourite = isFavourite === "true" || isFavourite === true;
  }

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

export const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId }).select("-__v");
};

export const createContact = async (data) => {
  const doc = await Contact.create(data);
  return doc.toObject({ versionKey: false });
};

export const updateContact = async (id, userId, data) => {
  return await Contact.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true, runValidators: true }
  ).select("-__v");
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};