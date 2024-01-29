"use server";
import { prisma } from "@/lib/prisma";
import { EdtJour, EdtSemaine, Evenement, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const getFirstDayOfWeek = (dayInitial: Date) => {
  const day = new Date(dayInitial); // Copy date so don't modify original
  const dayOfWeek = day.getDay();
  const diff = day.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday as first day of the week
  const firstDayOfWeek = new Date(day.setDate(diff));
  return firstDayOfWeek;
};

const addEdtSemaine = async (edtSemaine: Omit<EdtSemaine, "id">) => {
  const edtSemaineAdded = prisma.edtSemaine.create({
    data: edtSemaine,
  });
  return edtSemaineAdded;
};
const getEdtSemaineByDate = async (dateInitial: Date) => {
  const date = new Date(dateInitial);
  const firstDay = getFirstDayOfWeek(date);
  const edtSemaine = await prisma.edtSemaine.findFirst({
    where: {
      debutSemaine: firstDay,
    },
  });
  if (edtSemaine) {
    return edtSemaine;
  } else {
    const edtSemaineAdded = await addEdtSemaine({ debutSemaine: firstDay });
    return edtSemaineAdded;
  }
};
const addEdtJour = async (
  edtJourInitial: Omit<EdtJour, "id" | "idSemaine">
) => {
  const edtJour = { ...edtJourInitial };
  edtJour.date = new Date(edtJour.date);
  try {
    const firstDay = getFirstDayOfWeek(edtJour.date);
    const semaine = await getEdtSemaineByDate(firstDay);
    console.log(
      "addEdtJour -> debut semaine 🚀",
      edtJour.date.toLocaleString()
    );
    const edtJourAdded = await prisma.edtJour.create({
      data: { date: edtJour.date.toISOString(), idSemaine: semaine.id },
    });
    console.log(
      "🚀 ~  data: { date: edtJour.date.toISOString(), idSemaine: semaine.id }:",
      { date: edtJour.date.toISOString(), idSemaine: semaine.id }
    );
    console.log("🚀 ~ edtJourAdded:", edtJourAdded);
    revalidatePath("/api/edt");
    return edtJourAdded;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getEdtJourByEvenement = async (
  evenement: Omit<Evenement, "id" | "idJour">
) => {
  const dateWithoutHours = new Date(
    new Date(evenement.dateDebut).setHours(0, 0, 0, 0)
  );
  console.log("dateWithoutHours🚀", dateWithoutHours);

  const edtJour = await prisma.edtJour.findFirst({
    where: {
      date: dateWithoutHours,
    },
  });
  console.log("🚀 ~ edtJour:", edtJour);
  // throw Error('test');

  if (edtJour) {
    return edtJour;
  } else {
    const edtJourAdded = await addEdtJour({ date: dateWithoutHours });
    return edtJourAdded;
  }
};

export const addEvenementToDb = async (
  evenementInitial: Omit<Evenement, "id" | "idJour">,
  path?: string
) => {
  const evenement = { ...evenementInitial };
  const isEnfant = await prisma.enfant.findFirst({
    where: { id: evenement.idEnfant },
  });
  if (isEnfant) {
    const edtJour = await getEdtJourByEvenement({ ...evenement });

    const evenementAdded = prisma.evenement.create({
      data: { ...evenement, idJour: edtJour.id },
    });
    revalidatePath(path || "/(connected)/enfants/[idEnfant]/edt");
    return evenementAdded;
  } else {
    throw Error("idEnfant isn't valid");
  }
};

export const updateEvenementToDb = async (
  evenement: Omit<Evenement, "idEnfant" | "idJour">,
  path?: string
) => {
  try {
    const { dateDebut, dateFin, id, description, titre, idCategorie } = evenement; // get only pertinents datas

    const evenementUpdated = await prisma.evenement.update({
      where: { id },
      data: { titre, description, dateDebut, dateFin, id, idCategorie },
    });

    revalidatePath(path || "/(connected)/enfants/[idEnfant]/edt");
    return evenementUpdated;
  } catch (error) {
    console.error("🚀 ~ updateEvenementToDb ~ error:", error);
    throw Error(
      "🚀 ~ updateEvenementToDb ~ error: \n " + JSON.stringify(error)
    );
  }
};

export const deleteEvenementToDb = async (
  evenement: Pick<Evenement, "id">,
  path?: string
) => {
  try {
    const id = Number(evenement.id);
    if (id) {
      const evenementDeleted = await prisma.evenement.delete({
        where: { id },
      });
      revalidatePath(path || "/(connected)/enfants/[idEnfant]/edt");
      return evenementDeleted;
    } else {
      throw Error("id isn't valid number");
    }
  } catch (error) {
    console.error("🚀 ~ deleteEvenementToDb ~ error:", error);
    throw Error(
      "🚀 ~ deleteEvenementToDb ~ error: \n " + JSON.stringify(error)
    );
  }
};

export const testEdtServerAction = async () => {
  console.log("🚀 ~ testEdtServerAction ~ testEdtServerAction");
};
