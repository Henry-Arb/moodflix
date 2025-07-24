import { Client, Databases, Query, ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const PROJECT_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
  .setEndpoint(PROJECT_ENDPOINT)
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    //1. use Appwrite SDK to check if a document already exists in the DB.
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("search_term", searchTerm),
    ]);
    if (res.documents.length > 0) {
      //2. if it does, update count.
      const doc = res.documents[0];

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      //3. if it doesn't, create new document, with search term and count as 1.
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        search_term: searchTerm,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return res.documents;
  } catch (error) {
    console.error(error);
  }
};
