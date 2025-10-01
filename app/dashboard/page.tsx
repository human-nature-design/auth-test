import { stackServerApp } from "@/lib/stack";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { fooBar } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

async function getFooBarItems(userId: string) {
  // Set the user_id in the session for RLS
  await db.execute(sql`SELECT set_config('app.current_user_id', ${userId}, false)`);

  return await db.select().from(fooBar).where(eq(fooBar.userId, userId));
}

async function createFooBarItem(formData: FormData) {
  "use server";

  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await db.execute(sql`SELECT set_config('app.current_user_id', ${user.id}, false)`);

  await db.insert(fooBar).values({
    userId: user.id,
    name,
    description,
  });

  redirect("/dashboard");
}

async function updateFooBarItem(formData: FormData) {
  "use server";

  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await db.execute(sql`SELECT set_config('app.current_user_id', ${user.id}, false)`);

  await db.update(fooBar)
    .set({ name, description, updatedAt: new Date() })
    .where(eq(fooBar.id, id));

  redirect("/dashboard");
}

async function deleteFooBarItem(formData: FormData) {
  "use server";

  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const id = parseInt(formData.get("id") as string);

  await db.execute(sql`SELECT set_config('app.current_user_id', ${user.id}, false)`);

  await db.delete(fooBar).where(eq(fooBar.id, id));

  redirect("/dashboard");
}

export default async function Dashboard() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/handler/sign-in");
  }

  const items = await getFooBarItems(user.id);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <span className="text-gray-600">{user.primaryEmail}</span>
            <Link
              href="/handler/sign-out"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </Link>
          </div>
        </div>

        {/* Create Form */}
        <div className="bg-gray-900 p-6 rounded-lg shadow mb-8 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-white">Create New Item</h2>
          <form action={createFooBarItem} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </form>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Your Items</h2>
          {items.length === 0 ? (
            <p className="text-gray-400">No items yet. Create one above!</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-300 mt-2">{item.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <form action={deleteFooBarItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </div>

                {/* Update Form */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                    Edit
                  </summary>
                  <form action={updateFooBarItem} className="mt-4 space-y-4">
                    <input type="hidden" name="id" value={item.id} />
                    <div>
                      <label htmlFor={`name-${item.id}`} className="block text-sm font-medium mb-1 text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        id={`name-${item.id}`}
                        name="name"
                        defaultValue={item.name}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor={`description-${item.id}`} className="block text-sm font-medium mb-1 text-gray-300">
                        Description
                      </label>
                      <textarea
                        id={`description-${item.id}`}
                        name="description"
                        defaultValue={item.description || ""}
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                  </form>
                </details>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
