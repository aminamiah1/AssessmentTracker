import { RiSave3Fill } from "react-icons/ri";

import { editModuleName, editModuleCode } from "@/app/actions/module-form";

export default async function EditModule({
  params,
}: {
  params: { moduleCode: string };
}) {
  return (
    <>
      <form action={editModuleName}>
        <input
          type="hidden"
          name="module-code-init"
          value={params.moduleCode}
        />
        <label htmlFor="module-name">New Module Name</label>
        <input type="text" name="module-name" id="module-name" />
        <button type="submit">
          <RiSave3Fill />
        </button>
      </form>
      <form action={editModuleCode}>
        <input
          type="hidden"
          name="module-code-init"
          value={params.moduleCode}
        />
        <label htmlFor="module-code">New Module Code</label>
        <input type="text" name="module-code" id="module-code" />
        <button type="submit">
          <RiSave3Fill />
        </button>
      </form>
    </>
  );
}
