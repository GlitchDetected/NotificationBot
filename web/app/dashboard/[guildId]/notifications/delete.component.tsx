"use client";

import { Button, Tooltip } from "@heroui/react";
import { useState } from "react";
import { HiTrash } from "react-icons/hi";

import { guildStore } from "@/common/guildStore";
import Modal from "@/components/input/modal";

interface Props {
    id: string | null;
    name: string;

    remove: (id: string) => void;
}

export function DeleteNotification({
    id,
    name,

    remove
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip content="Delete Notification" closeDelay={0}>
                <Button isIconOnly color="danger" variant="flat" onClick={() => setOpen(true)} isDisabled={!id}>
                    <span>
                        <HiTrash />
                    </span>
                    <span className="sr-only">Delete selected notification</span>
                </Button>
            </Tooltip>

            <Modal
                buttonName="Delete"
                variant="destructive"
                title={"Delete Notification: " + name}
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                }}
                onSuccess={() => {
                    if (id) remove(id);
                }}
            >
                Are you sure you want to delete the {"\""}
                {name}
                {"\""} channel from your notifications list?
            </Modal>
        </>
    );
}