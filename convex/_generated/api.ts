/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { anyApi } from "convex/server";
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

import type * as ai from "../ai.js";
import type * as documents from "../documents.js";
import type * as email from "../email.js";
import type * as helpers from "../helpers.js";
import type * as queries from "../queries.js";
import type * as rights from "../rights.js";
import type * as users from "../users.js";

type FullApi = ApiFromModules<{
  ai: typeof ai;
  documents: typeof documents;
  email: typeof email;
  helpers: typeof helpers;
  queries: typeof queries;
  rights: typeof rights;
  users: typeof users;
}>;

export const api: FilterApi<FullApi, FunctionReference<any, "public">> =
  anyApi as unknown as FilterApi<FullApi, FunctionReference<any, "public">>;

export const internal: FilterApi<FullApi, FunctionReference<any, "internal">> =
  anyApi as unknown as FilterApi<
    FullApi,
    FunctionReference<any, "internal">
  >;
