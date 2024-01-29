import { getCategoriesFromDb } from "@/components/actions/categorie";
import { prisma } from "@/lib/utils";
import Calendar from "./calendar";
import { EventInput } from "@fullcalendar/core";
import { CategorieUsedEvent } from "./categoryUsedEvent";
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

  const evenements = await prisma.evenement.findMany({
    select: {
      id: true,
      titre: true,
      description: true,
      dateDebut: true,
      dateFin: true,
      categorie: {
        select: {
          id: true,
          couleur: true,
        },
      },
    },
    where: { idEnfant: idEnfantNumber },
  });
  const categories = await getCategoriesFromDb();

  if (enfantEdtSemaines) {
    const { nom, prenom } = enfantEdtSemaines;
    return (
      <>
        <h1>Calendrier de {prenom + " " + nom}</h1>
        <Calendar
          calendarEvents={evenements.map(
            (
              curr
            ) => ({
              id: String(curr.id),
              title: curr.titre,
              description: curr.description,
              start: curr.dateDebut,
              end: curr.dateFin,
              backgroundColor: curr?.categorie?.couleur,
              extendedProps: {
                categorie: curr.categorie,
              }

            } as EventInput & CategorieUsedEvent & {backgroundColor?: string;} )
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
