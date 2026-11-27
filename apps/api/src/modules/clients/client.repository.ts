import { Client, type ClientContact, type ClientDocument } from "@sarastra/db";
import type { FilterQuery } from "mongoose";

export const clientRepository = {
  async create(input: {
    name: string;
    company?: string | null;
    contacts?: ClientContact[];
    notes?: string | null;
  }) {
    return Client.create(input);
  },

  async findById(id: string) {
    return Client.findOne({ _id: id, deactivatedAt: null }).lean<ClientDocument | null>();
  },

  async list(filter: FilterQuery<ClientDocument> = {}, limit = 50) {
    return Client.find({ deactivatedAt: null, ...filter })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<ClientDocument[]>();
  },

  async update(
    id: string,
    patch: Partial<Pick<ClientDocument, "name" | "company" | "notes" | "contacts">>,
  ) {
    return Client.findOneAndUpdate({ _id: id, deactivatedAt: null }, { $set: patch }, { new: true }).lean<
      ClientDocument | null
    >();
  },

  async softDelete(id: string) {
    return Client.findOneAndUpdate(
      { _id: id, deactivatedAt: null },
      { $set: { deactivatedAt: new Date() } },
      { new: true },
    ).lean<ClientDocument | null>();
  },
};
