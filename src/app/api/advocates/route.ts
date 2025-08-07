import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET() {
  const data = await db.select().from(advocates);

  // const data = advocateData;

  return Response.json({ data });
}
