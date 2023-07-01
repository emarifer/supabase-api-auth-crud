import { Database } from "../types/supabase";
import { createClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL_PROJECT } from "../config";

const supabase = createClient<Database>(
  SUPABASE_URL_PROJECT as string,
  SUPABASE_ANON_KEY as string,
  {
    auth: {
      persistSession: false,
    },
  }
);

export default supabase;

/*
 * SOLUCIONAR EL WARNING "No storage option exists to persist the session, which may result in unexpected behavior when using auth.". VER:
 * https://stackoverflow.com/questions/76543335/next-js-12-supabase-project-error-no-storage-option-exists-to-persist-the-ses
 * https://supabase.com/docs/reference/javascript/release-notes#explicit-constructor-options
 */
