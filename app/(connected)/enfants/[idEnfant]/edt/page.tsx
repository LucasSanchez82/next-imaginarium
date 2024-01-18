import { prisma } from "@/lib/utils";
import Calendar from "./calendar";
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

  if (enfantEdtSemaines) {
    const { nom, prenom } = enfantEdtSemaines;
    return (
      // <>
      //   {/* <Form idEnfant={params.idEnfant} /> */}
      //   {edtSemaine.length > 0 ? (
      //     <ul>
      //       {edtSemaine.map((el, key) => (
      //         <li key={key}>{new Date(el.semaine).toString()}</li>
      //       ))}
      //     </ul>
      //   ) : (
      //     <h3 className="bg-red-400 font-bold rounded w-3/4 m-auto text-center">
      //       Aucune semaine trouvé pour {nom} {prenom}
      //     </h3>
      //   )}
      // </>
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
        />
      </>
    );
  } else {
    return <h2 className="bg-red-400 bold ">aucun enfant trouvé</h2>;
  }
};

export default page;
