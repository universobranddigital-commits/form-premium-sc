import { redirect } from "next/navigation";
import { backendOrigin } from "../../lib/backend";
export default function ConsultantPage() { redirect(`${backendOrigin}/consultor`); }
