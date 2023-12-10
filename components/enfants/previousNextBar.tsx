"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

const PreviousNextBar = ({
  colSpan,
  limit,
  nbPages,
  setLimit,
}: {
  colSpan: number;
  limit: { skip: number; take: number };
  nbPages: number;
  setLimit: Dispatch<
    SetStateAction<{
      skip: number;
      take: number;
    }>
  >;
}) => {
  const inputClassname = "disabled:bg-secondary disabled:text-primary bg-primary text-secondary rounded cursor-pointer p-1 mr-2 ml-2";
  const currPage = limit.take / (limit.take - limit.skip);
    const jump = limit.take - limit.skip;
  const handleNext = (event: SyntheticEvent) => {
    
    if(currPage >= nbPages) {
      return;
    }
    setLimit((curr) => ({ skip: curr.skip + jump, take: curr.take + jump }));
  };
  const handlePrev = (event: SyntheticEvent) => {
    if(limit.skip < jump) return
    setLimit((curr) => {
      return { skip: curr.skip - jump, take: curr.take - jump };
    });
  };
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex justify-around items-center">
          <span>
            page: {currPage} / {nbPages}
          </span>
          <div>
            <input
              onClick={handlePrev}
              className={inputClassname}
              type="button"
              value="Precedent"
            />
            <input
              onClick={handleNext}
              className={inputClassname}
              type="button"
              value="Suivant"
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PreviousNextBar;
