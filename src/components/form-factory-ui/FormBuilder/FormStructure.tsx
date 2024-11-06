"use client";

import { Button } from "@/components/ui/button";
import { Cross, CrossIcon, Info, Trash2Icon, X } from "lucide-react";
import useStore, { FormElement } from "@/lib/store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function FormStructure() {
  const formElements = useStore((state) => state.formElements);
  const removeFormElement = useStore((state) => state.removeFormElement);
  const selectCurrentFormElement = useStore(
    (state) => state.selectCurrentFormElement
  );
  const currentFormElement = useStore((state) => state.currentFormElement);
  const [modalOpen, setModalOpen] = useState<{
    isOpen: boolean;
    metadata: FormElement | null;
  }>({ isOpen: false, metadata: null });

  if (formElements.length === 0)
    return (
      <div className="w-full flex justify-center items-center">
        <Info className="w-4 h-4 mr-1" />
        Add elements to the form
      </div>
    );

  function handleRemove(el: FormElement) {
    if (currentFormElement && currentFormElement.id === el.id)
      selectCurrentFormElement(null);
    removeFormElement(el);
    setModalOpen({ isOpen: false, metadata: null });
  }

  function openModal(
    event: React.MouseEvent<HTMLButtonElement>,
    el: FormElement
  ) {
    event.stopPropagation();
    setModalOpen({ isOpen: true, metadata: el });
  }

  function onSelectElement(id: string | number) {
    selectCurrentFormElement(id);
  }

  const formElementsJSX = formElements.map((el) => (
    <div
      key={el.id}
      className="border-2 rounded-sm shadow-sm border-slate-300 h-[50px] my-5 px-2 flex flex-col justify-center"
      onClick={() => onSelectElement(el.id)}
    >
      <div className="w-full flex justify-between">
        <span>{el.label}</span>
        <Button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            openModal(event, el)
          }
          size="sm"
        >
          <Trash2Icon />
        </Button>
      </div>
    </div>
  ));

  return (
    <div>
      <Dialog open={modalOpen.isOpen}>
        {formElementsJSX}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-full flex">
              <span className="flex-1">
                <DialogTitle>Do you want to delete the field?</DialogTitle>
              </span>
              <span className="justify-self-end">
                <X
                  onClick={() =>
                    setModalOpen({ isOpen: false, metadata: null })
                  }
                  className="h-4 w-4 cursor-pointer"
                />
              </span>
            </div>
            <DialogDescription>
              <span className="font-medium text-sm">Note:</span> This action can
              not be reversed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between space-x-2">
            <Button
              onClick={() => handleRemove(modalOpen.metadata as FormElement)}
              type="button"
              className="w-full"
              variant="destructive"
            >
              Delete
            </Button>
            <Button
              onClick={() => setModalOpen({ isOpen: false, metadata: null })}
              type="button"
              className="w-full"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
