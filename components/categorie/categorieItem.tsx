import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Categorie, Tag, CategorieTag } from "@prisma/client";
import { DeleteCategorieButton } from "./actionButtons/delete";
import EditCategorieButton from "./actionButtons/edit";

export const CategorieItem = ({
  categorie,
  backgroundColor,
}: {
  categorie: Categorie & {tags:  (CategorieTag & {tag: Tag  })[] };
  backgroundColor: React.CSSProperties;
}) => {
  const ActionButtons = () => (
    <div className="flex justify-between items-end w-full">
      <DeleteCategorieButton
        categorie={{ id: categorie.id, libelle: categorie.libelle }}
      />
      <EditCategorieButton categorie={categorie} />
    </div>
  );
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <Badge
            variant={categorie.important ? "default" : "secondary"}
            className="m-1"
          >
            <li
              key={categorie.id}
              className={cn(
                // `${categorie.important && "underline"}`,
                "flex justify-center items-center"
              )}
            >
              <div
                style={backgroundColor}
                className="rounded h-2 w-2 mr-2"
              ></div>{" "}
              <span>
                {categorie.libelle} : {categorie.description}
              </span>
            </li>
          </Badge>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col justify-between items-center space-x-4">
          <ActionButtons />
          <h3>{categorie.libelle}</h3>
          <Separator className="my-4" />
          <p>{categorie.description}</p>
          <span>{categorie.important && "⚠️ important ⚠️"}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
