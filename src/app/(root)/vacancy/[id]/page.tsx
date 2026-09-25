import { getVacancyServer } from "@/lib/request.server";
import { IVacancy } from "@/types";
import dynamic from 'next/dynamic'
const VacancyApply= dynamic(() => import("@/components/user/vacancy-apply"));
interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const vacancy = await getVacancyServer({ id });
  return <VacancyApply vacancy={vacancy?.data } />
}
