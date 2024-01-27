import { prisma } from "@/lib/utils";
import Calendar from "./calendar";
import { getCategoriesFromDb } from "@/components/actions/categorie";
const page = async ({ params }: { params: { idEnfant: string } }) => {
  const idEnfantNumber = Number(params.idEnfant);
  if (isNaN(idEnfantNumber)) {
    return <h2 className="bg-red-400 bold ">aucun enfant trouvé</h2>;
  }

  const enfantEdtSemaines = await prisma.enfant.findUnique({
    select: {
      nom: true,
      prenom: true,
    },
    where: {
      id: idEnfantNumber,
    },
  });

  const evenements = await prisma.evenement.findMany();
  const categories = await getCategoriesFromDb();

  if (enfantEdtSemaines) {
    const { nom, prenom } = enfantEdtSemaines;
    return (
      <>
        <h1>hello schedule</h1>
        <Calendar
          calendarEvents={evenements.map(
            (
              curr
            ): {
              id: string;
              title: string;
              description: string | null;
              start: Date;
              end: Date;
            } => ({
              id: String(curr.id),
              title: curr.titre,
              description: curr.description,
              start: curr.dateDebut,
              end: curr.dateFin,
            })
          )}
          idEnfant={idEnfantNumber}
          categories={categories}
        />
      </>
    );
  } else {
    return <h2 className="bg-red-400 bold ">aucun enfant trouvé</h2>;
  }
};

export default page;
