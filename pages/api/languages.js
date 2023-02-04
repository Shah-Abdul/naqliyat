import { LANGUAGES } from "./naqliyat";

export const getLanguages = () => LANGUAGES;

const getLanguagesApiHandler = async (req, res) => {
  res.json(LANGUAGES);
};

export default getLanguagesApiHandler;
