import mongoClientPromise from "../../lib/mongodb";

import { validateBookId, respondWithError } from "./naqliyat";

export const LANGUAGES = ["english", "urdu"];
export const PAGE_SIZES = [10, 25, 50];

export const getNaqliyatCount = async (
  bookId
) => {
  const mongoClient = await mongoClientPromise;
  const db = mongoClient.db(process.env.MONGODB_DBNAME);
  const naqliyatCount = await db
    .collection("naqliyat")
    .count({ bookId })
  return naqliyatCount;
};

const getNaqliyatCountAPIHandler = async (req, res) => {
  const { bookId: bookIdString } = req.query;

  // bookId validation.
  const { invalidBookIdRequested, bookIdRequested } = await validateBookId(
    bookIdString
  );
  if (invalidBookIdRequested) {
    respondWithError(res, 400, "Invalid bookId requested.", bookIdRequested);
    return;
  }
  const bookId = bookIdRequested;


  const naqliyat = await getNaqliyatCount(bookId
  );
  res.json(naqliyat);
};

export default getNaqliyatCountAPIHandler;
