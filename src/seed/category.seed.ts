import { db } from "@/db";
import { category } from "@/db/schema";

async function main() {
  console.log("🌱 Seeding categories...");
  const categories = [
    { name: "Computer Science" },
    { name: "Fitness" },
    { name: "Photography" },
    { name: "Accounting" },
    { name: "Engineering" },
    { name: "Filming" },
  ];
  for (const cat of categories) {
    await db
      .insert(category)
      .values(cat)
      .onConflictDoNothing({ target: category.name });
  }
  console.log("✅ Categories seeded!");
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log("❌ Seeding failed:", err);
    process.exit(1);
  });
