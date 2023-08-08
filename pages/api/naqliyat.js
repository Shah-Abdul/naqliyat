import mongoClientPromise from "../../lib/mongodb";

import { getBooks } from "./books";

export const LANGUAGES = ["english", "urdu"];
export const PAGE_SIZES = [10, 25, 50];

export const getNaqliyats = async (
  filter = {},
  pageSize = PAGE_SIZES[1],
  languages = LANGUAGES
) => {
  const mongoClient = await mongoClientPromise;
  const db = mongoClient.db(process.env.MONGODB_DBNAME);
  const naqliyat = await db
    .collection("naqliyat")
    .find(filter)
    .project({
      bookId: 1,
      index: 1,
      _id: 0,
      ...languages.reduce((acc, language) => {
        acc[language] = 1;
        return acc;
      }, {}),
    })
    .sort({ index: 1 })
    .limit(pageSize)
    .toArray();
  return naqliyat;
};

const getNaqliyatsAPIHandler = async (req, res) => {
  const {
    lang: languagesString,
    pageSize: pageSizeString,
    bookId: bookIdString,
    startAtIndex: startIndexString,
    // TODO: Add a parameter for sort: asc/desc
  } = req.query;

  // languages validation.
  const { invalidLanguageRequested, languagesRequested } =
    validateLanguages(languagesString);
  if (invalidLanguageRequested) {
    respondWithError(
      res,
      400,
      "Unsupported language requested.",
      languagesString
    );
    return;
  }
  const languages = languagesRequested;

  // pageSize validation.
  const { invalidPageSizeRequested, pageSizeRequested } =
    validatePageSize(pageSizeString);
  if (invalidPageSizeRequested) {
    respondWithError(
      res,
      400,
      "Invalid pageSize requested.",
      pageSizeRequested
    );
    return;
  }
  const pageSize = pageSizeRequested;

  // bookId validation.
  const { invalidBookIdRequested, bookIdRequested } = await validateBookId(
    bookIdString
  );
  if (invalidBookIdRequested) {
    respondWithError(res, 400, "Invalid bookId requested.", bookIdRequested);
    return;
  }
  const bookId = bookIdRequested;

  // startIndex validation.
  const { invalidStartIndexIdRequested, startIndexRequested } =
    await validateStartIndex(startIndexString, bookId);
  if (invalidStartIndexIdRequested) {
    respondWithError(
      res,
      400,
      "Invalid startIndex requested.",
      startIndexRequested
    );
    return;
  }
  const startIndex = startIndexRequested;

  const naqliyat = await getNaqliyats(
    { bookId, index: { $gte: startIndex } },
    pageSize,
    languages
  );
  res.json(naqliyat);
};

export default getNaqliyatsAPIHandler;

export const respondWithError = (res, status, message, data) => {
  res.status(status).json({ message, data });
};

const validateLanguages = (languagesString) => {
  if (!languagesString) {
    return { invalidLanguageRequested: false, languagesRequested: LANGUAGES };
  }
  const languagesSplit = languagesString.split(",");
  const invalidLanguageRequested = languagesSplit.some(
    (language) =>
      !LANGUAGES.some((supportedLanguage) => supportedLanguage === language)
  );
  if (invalidLanguageRequested) {
    return {
      invalidLanguageRequested: true,
      languagesRequested: languagesSplit,
    };
  }
  return {
    invalidLanguageRequested: false,
    languagesRequested: languagesSplit,
  };
};

const validatePageSize = (pageSizeString) => {
  if (!pageSizeString) {
    // Default Page Size.
    return {
      invalidPageSizeRequested: false,
      pageSizeRequested: PAGE_SIZES[1],
    };
  }
  if (isNaN(Number.parseInt(pageSizeString))) {
    // Invalid Page size provided.
    return {
      invalidPageSizeRequested: true,
      pageSizeRequested: pageSizeString,
    };
  }
  return {
    invalidPageSizeRequested: false,
    pageSizeRequested: Number.parseInt(pageSizeString),
  };
};

export const validateBookId = async (bookIdString) => {
  if (!bookIdString) {
    // Default bookId.
    return {
      invalidBookIdRequested: false,
      bookIdRequested: 1,
    };
  }
  if (isNaN(Number.parseInt(bookIdString))) {
    // Invalid Book Id provided.
    return {
      invalidBookIdRequested: true,
      bookIdRequested: bookIdString,
    };
  }
  const bookData = await getBooks({ bookId: Number.parseInt(bookIdString) });
  if (!bookData.length) {
    return {
      invalidBookIdRequested: true,
      bookIdRequested: bookIdString,
    };
  }
  return {
    invalidBookIdRequested: false,
    bookIdRequested: Number.parseInt(bookIdString),
  };
};

const validateStartIndex = async (startIndexString, bookId) => {
  if (!startIndexString) {
    // Default startIndex.
    return {
      invalidStartIndexIdRequested: false,
      startIndexRequested: 1,
    };
  }
  if (
    isNaN(Number.parseInt(startIndexString)) ||
    Number.parseInt(startIndexString) < 0
  ) {
    // Invalid Start Index provided.
    return {
      invalidStartIndexIdRequested: true,
      startIndexRequested: startIndexString,
    };
  }
  const naqliyat = await getNaqliyats(
    {
      bookId,
      index: Number.parseInt(startIndexString),
    },
    1
  );
  if (!naqliyat.length) {
    return {
      invalidStartIndexIdRequested: true,
      startIndexRequested: startIndexString,
    };
  }
  return {
    invalidStartIndexIdRequested: false,
    startIndexRequested: Number.parseInt(startIndexString),
  };
};
