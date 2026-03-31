"use client";

import { useMemo, useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import { KANBAN_COLUMNS, APPLICATION_STATUSES, STATUS_CLASS_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Building2, Calendar, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditApplicationModal } from "./EditApplicationModal";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanBoardProps {
  applications: Application[];
}

export function KanbanBoard({ applications: initialApplications }: KanbanBoardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const columns = useMemo(() => {
    return KANBAN_COLUMNS.map((colValue) => ({
      id: colValue,
      title: APPLICATION_STATUSES.find((s) => s.value === colValue)?.label || colValue,
      emoji: APPLICATION_STATUSES.find((s) => s.value === colValue)?.emoji || "",
      applications: applications.filter((app) => app.status === colValue),
    }));
  }, [applications]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setApplications((apps) => {
        const activeIndex = apps.findIndex((t) => t.id === activeId);
        const overIndex = apps.findIndex((t) => t.id === overId);

        if (apps[activeIndex].status !== apps[overIndex].status) {
          const newApps = [...apps];
          newApps[activeIndex].status = apps[overIndex].status;
          return arrayMove(newApps, activeIndex, overIndex);
        }

        return arrayMove(apps, activeIndex, overIndex);
      });
    }

    // Dropping a task over a column
    if (isActiveTask && isOverColumn) {
      setApplications((apps) => {
        const activeIndex = apps.findIndex((t) => t.id === activeId);
        const newApps = [...apps];
        newApps[activeIndex].status = overId as ApplicationStatus;
        return arrayMove(newApps, activeIndex, activeIndex);
      });
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    
    const activeApp = applications.find(a => a.id === active.id);
    if (!activeApp) return;

    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: activeApp.status })
        .eq("id", activeApp.id);

      if (error) throw error;
      
      router.refresh();
    } catch (err: any) {
      toast.error("Gagal menyimpan perubahan status.");
      console.error(err);
    }
  }

  return (
    <div className="flex h-[calc(100vh-280px)] w-full overflow-x-auto gap-4 pb-4 animate-in fade-in">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {columns.map((col) => (
          <KanbanColumn key={col.id} column={col} />
        ))}

        <DragOverlay>
          {activeId ? <KanbanCard application={applications.find((a) => a.id === activeId)!} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ column }: { column: any }) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col flex-shrink-0 w-80 bg-surface/50 border border-app hover:border-border rounded-2xl transition-colors"
    >
      <div className="p-4 flex items-center justify-between border-b border-app/50 font-semibold text-main">
        <div className="flex items-center gap-2">
          <span>{column.emoji}</span>
          {column.title}
        </div>
        <span className="bg-main text-secondary px-2 py-0.5 rounded-full text-xs">
          {column.applications.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <SortableContext items={column.applications.map((a: any) => a.id)}>
          {column.applications.map((app: any) => (
            <SortableTask key={app.id} application={app} />
          ))}
        </SortableContext>
        {column.applications.length === 0 && (
          <div className="h-full min-h-[100px] flex items-center justify-center text-sm text-hint border-2 border-dashed border-app/50 rounded-xl">
            Seret lamaran ke sini
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTask({ application }: { application: Application }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: application.id,
    data: { type: "Task", application },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-32 bg-main rounded-xl border-2 border-dashed border-sage/50 opacity-50"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard application={application} />
    </div>
  );
}

function KanbanCard({ application }: { application: Application }) {
  const [mounted, setMounted] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-main border border-app hover:border-sage/50 rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-sm text-main leading-tight line-clamp-2">{application.position}</h4>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-secondary hover:text-main shrink-0"
          onPointerDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setIsEditOpen(true);
          }}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="flex items-center gap-2 text-secondary text-sm mb-4 line-clamp-1">
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        {application.company}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span
          className={cn(
            "px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded flex items-center gap-1",
            STATUS_CLASS_MAP[application.status]
          )}
        >
          {APPLICATION_STATUSES.find(s => s.value === application.status)?.label}
        </span>
        <span className="text-[10px] text-hint flex items-center gap-1">
           <Calendar className="w-3 h-3"/>
           {mounted ? new Date(application.apply_date).toLocaleDateString("id-ID", { month: "short", day: "numeric" }) : "..."}
        </span>
      </div>
      <EditApplicationModal open={isEditOpen} onOpenChange={setIsEditOpen} application={application} />
    </div>
  );
}
