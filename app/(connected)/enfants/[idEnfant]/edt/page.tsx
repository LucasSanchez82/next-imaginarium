import { prisma } from '@/lib/utils';

const page = async ({ params }: { params: { idEnfant: string } }) => {
  const enfantEtSemaines = await prisma.enfant.findUnique({
    select: {
      nom: true,
      prenom: true,
      edtSemaine: true,
    },
    where: {
      id: params.idEnfant,
    },
  });
  if (enfantEtSemaines) {
    const { edtSemaine, nom, prenom } = enfantEtSemaines;
    return (
      <>
        {/* <Form idEnfant={params.idEnfant} /> */}
        {edtSemaine.length > 0 ? (
          <ul>
            {edtSemaine.map((el, key) => (
              <li key={key}>{new Date(el.semaine).toString()}</li>
            ))}
          </ul>
        ) : (
          <h3 className="bg-red-400 font-bold rounded w-3/4 m-auto text-center">
            Aucune semaine trouvé pour {nom} {prenom}
          </h3>
        )}
      </>
    );
  } else {
    return <h2 className="bg-red-400 bold ">aucun enfant trouvé</h2>;
  }
};

export default page;
