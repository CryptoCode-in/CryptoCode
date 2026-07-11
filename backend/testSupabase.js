const supabase = require("./src/config/supabase");
async function test() {
  try {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*').limit(1);
    console.log("Profiles check:", { profiles, pError });

    const { data: practicals, error: prError } = await supabase.from('practicals').select('*');
    console.log("Practicals check:", { practicals, prError });
  } catch (err) {
    console.error("Test error:", err);
  }
}
test();
