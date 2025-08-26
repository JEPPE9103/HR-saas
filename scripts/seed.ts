/*
  Demo seed generator (JSON output to console). In a real app, write to Firestore.
*/

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice<T>(a: T[]) { return a[rand(0, a.length - 1)]; }

const roles = ["Engineer", "Developer", "Designer", "Sales", "HR", "Finance"];
const depts = ["Engineering", "Design", "Sales", "HR", "Finance", "Support"];
const sites = ["SE-1", "SE-2", "NO-1"];

type Row = {
  employeeId: string;
  gender: "male" | "female";
  role: string;
  department: string;
  site: string;
  country: string;
  basePay: number;
  bonus: number;
  currency: string;
  fte: number;
};

const out: Row[] = [];
for (let i = 0; i < 500; i++) {
  const gender = Math.random() < 0.52 ? "male" : "female";
  const role = choice(roles);
  const department = choice(depts);
  const site = choice(sites);
  const base = 35000 + rand(0, 40000);
  const bonus = rand(0, 15000);
  out.push({
    employeeId: `E${1000 + i}`,
    gender,
    role,
    department,
    site,
    country: site.startsWith("SE") ? "SE" : "NO",
    basePay: base,
    bonus,
    currency: "SEK",
    fte: 1,
  });
}

console.log(JSON.stringify(out, null, 2));


