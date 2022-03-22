import { DB } from "../Database";
import { MessageHandler } from "../MessageHandler";

async function onMessage(): Promise<any> {
  const artists = await DB.runQuery("get_artists");
  return { artists };
}

const schema = {};

export const GetArtistsHandler = new MessageHandler(
  "get_artists",
  schema,
  onMessage
);
