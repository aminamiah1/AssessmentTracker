import { RiSave3Fill } from "react-icons/ri";

import { editModuleName, editModuleCode } from "@/app/actions/module-form";

export default async function EditModule({
  params,
}: {
  params: { moduleCode: string };
}) {
  return (
    <>
      <div className="flex flex-col justify-center items-center p-10 w-full min-h-fit h-full">
        <div className="flex flex-col gap-6 justify-center items-center w-2/5 min-w-fit px-4 py-8 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md dark:shadow-gray-500">
          <h3 data-cy="edit-module-header" className="text-2xl font-bold">
            Edit Module {params.moduleCode}
          </h3>
          <form action={editModuleName} className="flex flex-col gap-2">
            <input
              type="hidden"
              name="module-code-init"
              value={params.moduleCode}
            />
            <label
              className="flex justify-start items-center col-span-2"
              htmlFor="module-name"
            >
              Change Module Name
            </label>
            <div className="flex gap-4">
              <input
                data-cy="edit-module-name-input"
                className="flex justify-center items-center w-64 border focus:outline-none py-2 px-3 rounded-xl text-gray-800"
                type="text"
                name="module-name"
                id="module-name"
              />
              <button
                data-cy="edit-module-name-submit"
                className="flex justify-start items-center text-2xl"
                type="submit"
              >
                <RiSave3Fill />
              </button>
            </div>
          </form>
          <form action={editModuleCode} className="flex flex-col gap-2">
            <input
              type="hidden"
              name="module-code-init"
              value={params.moduleCode}
            />
            <label
              className="flex justify-start items-center col-span-2"
              htmlFor="module-code"
            >
              Change Module Code
            </label>
            <div className="flex gap-4">
              <input
                data-cy="edit-module-code-input"
                className="flex justify-center items-center border focus:outline-none py-2 px-3 rounded-xl text-gray-800"
                type="text"
                name="module-code"
                id="module-code"
              />
              <button
                data-cy="edit-module-code-submit"
                className="flex justify-start items-center text-2xl"
                type="submit"
              >
                <RiSave3Fill />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
