import { getBooks } from "./books";
import { getLanguages } from "./languages";
import { PAGE_SIZES } from "./naqliyat";

const getBooksAPIHandler = async (req, res) => {
  const books = await getBooks();
  const languages = getLanguages();
  const pageSizes = PAGE_SIZES;
  
  res.json({ books, languages, pageSizes });
};

export default getBooksAPIHandler;
