import mongoClientPromise from "../../lib/mongodb";

export const getBooks = async (filter = {}) => {
  const mongoClient = await mongoClientPromise;
  const db = mongoClient.db(process.env.MONGODB_DBNAME);
  const books = await db
    .collection("books")
    .find(filter)
    .project({ _id: 0 })
    .toArray();
  return books;
};

const getBooksAPIHandler = async (req, res) => {
  const books = await getBooks();
  res.json(books);
};

export default getBooksAPIHandler;
