import { Action, UserRole, can } from "@sarastra/shared";
import { z } from "zod";

import type { CurrentUser } from "@/lib/auth-guard";
import { AppError } from "@/lib/errors";

import { clientRepository } from "./client.repository";

const createClientSchema = z.object({
  name: z.string().min(1),
  company: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  contacts: z
    .array(
      z.object({
        name: z.string().min(1),
        email: z.email(),
        phone: z.string().nullable().optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .optional(),
});

const updateClientSchema = createClientSchema.partial();

export const clientService = {
  async list(user: CurrentUser) {
    if (!can(user.role, Action.CLIENT_READ) && user.role !== UserRole.CLIENT) {
      throw new AppError("FORBIDDEN", "Cannot list clients");
    }
    if (user.role === UserRole.CLIENT) {
      if (!user.clientId) {
        return [];
      }
      const mine = await clientRepository.findById(user.clientId);
      return mine ? [mine] : [];
    }
    return clientRepository.list();
  },

  async get(user: CurrentUser, id: string) {
    if (user.role === UserRole.CLIENT && user.clientId !== id) {
      throw new AppError("FORBIDDEN", "Clients can only view their own profile");
    }
    if (user.role !== UserRole.CLIENT && !can(user.role, Action.CLIENT_READ)) {
      throw new AppError("FORBIDDEN", "Cannot read clients");
    }
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new AppError("NOT_FOUND", "Client not found");
    }
    return client;
  },

  async create(user: CurrentUser, body: unknown) {
    if (!can(user.role, Action.CLIENT_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot create clients");
    }
    const input = createClientSchema.parse(body);
    return clientRepository.create(input);
  },

  async update(user: CurrentUser, id: string, body: unknown) {
    if (!can(user.role, Action.CLIENT_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot update clients");
    }
    const input = updateClientSchema.parse(body);
    const updated = await clientRepository.update(id, input);
    if (!updated) {
      throw new AppError("NOT_FOUND", "Client not found");
    }
    return updated;
  },

  async remove(user: CurrentUser, id: string) {
    if (!can(user.role, Action.CLIENT_WRITE)) {
      throw new AppError("FORBIDDEN", "Cannot delete clients");
    }
    const removed = await clientRepository.softDelete(id);
    if (!removed) {
      throw new AppError("NOT_FOUND", "Client not found");
    }
    return removed;
  },
};
