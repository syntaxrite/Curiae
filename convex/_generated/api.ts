// hello
type FunctionReference = string & {
  readonly __brand: "FunctionReference";
};

const ref = <T extends string>(path: T): FunctionReference => path as FunctionReference;

export const api = {
  users: {
    getUserByClerkId: ref("users:getUserByClerkId"),
    createUser: ref("users:createUser"),
    updateJurisdiction: ref("users:updateJurisdiction")
  },
  queries: {
    getQueriesByUser: ref("queries:getQueriesByUser"),
    getRecentQueries: ref("queries:getRecentQueries"),
    saveQuery: ref("queries:saveQuery")
  },
  documents: {
    getDocumentsByUser: ref("documents:getDocumentsByUser"),
    getDocumentById: ref("documents:getDocumentById"),
    generateUploadUrl: ref("documents:generateUploadUrl"),
    saveDocument: ref("documents:saveDocument"),
    updateDocumentAnalysis: ref("documents:updateDocumentAnalysis")
  },
  rights: {
    getRightsByCountryAndCategory: ref("rights:getRightsByCountryAndCategory")
  },
  ai: {
    askStandard: ref("ai:askStandard"),
    askDeep: ref("ai:askDeep"),
    analyzeDocument: ref("ai:analyzeDocument")
  },
  email: {
    sendWelcomeEmail: ref("email:sendWelcomeEmail")
  }
} as const;

export type Api = typeof api;
