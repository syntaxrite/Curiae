import {
  actionGeneric,
  httpActionGeneric,
  mutationGeneric,
  queryGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
} from "convex/server";

export const action = actionGeneric;
export const internalAction = internalActionGeneric;
export const mutation = mutationGeneric;
export const internalMutation = internalMutationGeneric;
export const query = queryGeneric;
export const internalQuery = internalQueryGeneric;
export const httpAction = httpActionGeneric;
