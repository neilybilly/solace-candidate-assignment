import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql, or, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "10";
  const searchParam = url.searchParams.get("search")?.trim() ?? "";

  const page = Math.max(1, parseInt(pageParam, 10));
  const limit = Math.min(100, Math.max(1, parseInt(limitParam, 10)));
  const offset = (page - 1) * limit;

  const whereClause = searchParam
  ? or(
      ilike(advocates.firstName, `%${searchParam}%`),
      ilike(advocates.lastName, `%${searchParam}%`),
      ilike(advocates.city, `%${searchParam}%`),
      ilike(advocates.degree, `%${searchParam}%`),
      sql`${advocates.specialties}::text ILIKE ${`%${searchParam}%`}`,
      sql`${advocates.yearsOfExperience}::text ILIKE ${`%${searchParam}%`}`
    )
  : undefined;

  const data = await db
    .select()
    .from(advocates)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(advocates)
    .where(whereClause);

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return new Response(
    JSON.stringify({
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    }),
  );
}
