import { createClient } from "@supabase/supabase-js";

export default function supabase() {
  const client = createClient(
    "https://bmlcmzycfrrykmlpiwgd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbGNtenljZnJyeWttbHBpd2dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2MzQ5MSwiZXhwIjoyMDQwNDM5NDkxfQ.fXSfn7FmfUXi4lZSljVs3AABZldCmDE1I_1FvsCEoR4"
  );

  return client;
}
